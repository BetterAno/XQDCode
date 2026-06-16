"""CloakBrowser + browser-use 集成模块.

提供两种集成模式:

1. CDP 模式（推荐）:
   - CloakBrowser 先启动 stealth Chromium，开启 CDP 端口
   - browser-use 通过 CDP 连接到已启动的浏览器
   - 优点: CloakBrowser 完全控制 stealth 参数和 binary

2. 直接模式:
   - 将 CloakBrowser 的 binary 路径和 stealth args 直接传给 BrowserSession
   - 优点: 代码更简洁，浏览器生命周期由 browser-use 管理

使用示例:
    from sites.cloak_config import CloakAgent

    # CDP 模式
    agent = CloakAgent(profile_name="jd_research")
    result = await agent.run("打开京东首页并搜索'手机'")

    # 直接模式
    agent = CloakAgent(mode="direct", profile_name="my_session")
    result = await agent.run("访问 example.com 并获取标题")
"""

import asyncio
import logging
from typing import Any

from browser_use import Agent, BrowserSession, ChatOpenAI
from browser_use.agent.views import AgentOutput

from cloakbrowser import launch_async
from cloakbrowser.config import get_default_stealth_args, DEFAULT_VIEWPORT
from cloakbrowser.download import ensure_binary

from .cb_config import CloakConfig, get_config

logger = logging.getLogger("cloak_agent")


async def create_stealth_browser(
    config: CloakConfig | None = None,
) -> Any:
    """启动 CloakBrowser stealth 浏览器并返回 Browser 对象.

    浏览器会开启 CDP 远程调试端口，供 browser-use 等框架连接。

    Args:
        config: CloakConfig 配置，为 None 时使用全局配置

    Returns:
        CloakBrowser 返回的 Playwright Browser 对象（已打 stealth 补丁）
    """
    cfg = config or get_config()

    args = list(cfg.extra_args)
    args.extend([
        f"--remote-debugging-port={cfg.cdp_port}",
        "--remote-debugging-address=127.0.0.1",
    ])

    browser = await launch_async(
        headless=cfg.headless,
        args=args,
        stealth_args=cfg.stealth_args,
        humanize=cfg.humanize,
        timezone=cfg.timezone,
        locale=cfg.locale,
    )

    logger.info(
        "CloakBrowser launched (headless=%s, CDP port=%s, profile=%s)",
        cfg.headless,
        cfg.cdp_port,
        cfg.profile_name,
    )
    return browser


class CloakAgent:
    """CloakBrowser + browser-use 的 AI Agent 封装.

    整合 stealth 浏览器和 AI agent，支持持久化 profile。

    Attributes:
        config: CloakConfig 配置实例
        mode: 集成模式（'cdp' 或 'direct'）
        browser: CloakBrowser 返回的浏览器对象（仅 CDP 模式）
        session: browser-use BrowserSession
    """

    def __init__(
        self,
        mode: str = "direct",
        profile_name: str = "default",
        headless: bool = True,
        humanize: bool = False,
        cdp_port: int = 9242,
        llm_model: str | None = None,
        llm_temperature: float | None = None,
        config: CloakConfig | None = None,
        **kwargs: Any,
    ):
        """初始化 CloakAgent.

        Args:
            mode: 集成模式 - 'cdp'（CDP 连接）或 'direct'（直接传参）
            profile_name: 持久化 profile 名称
            headless: 无头模式
            humanize: 人性化行为模拟
            cdp_port: CDP 端口（CDP 模式使用）
            llm_model: LLM 模型
            llm_temperature: LLM 温度
            config: 完整 CloakConfig，为 None 时用参数构建
            **kwargs: 传递给 CloakConfig 的额外参数
        """
        if config is None:
            self.config = CloakConfig(
                headless=headless,
                profile_name=profile_name,
                humanize=humanize,
                cdp_port=cdp_port,
                llm_model=llm_model or CloakConfig.llm_model,
                llm_temperature=llm_temperature if llm_temperature is not None else CloakConfig.llm_temperature,
                **kwargs,
            )
        else:
            self.config = config

        self.mode = mode
        self.browser = None
        self.session: BrowserSession | None = None
        self._agent: Agent | None = None

    # ------------------------------------------------------------------
    # 启动 / 停止
    # ------------------------------------------------------------------

    async def start(self) -> BrowserSession:
        """启动 stealth 浏览器并返回 BrowserSession.

        Returns:
            配置好的 BrowserSession，可直接传给 browser-use Agent
        """
        self.config.ensure_profile_dir()

        if self.mode == "cdp":
            return await self._start_cdp_mode()
        else:
            return await self._start_direct_mode()

    async def _start_cdp_mode(self) -> BrowserSession:
        """CDP 模式: CloakBrowser 先启动，browser-use 再连接."""
        self.browser = await create_stealth_browser(self.config)
        cdp_url = f"http://127.0.0.1:{self.config.cdp_port}"
        self.session = BrowserSession(cdp_url=cdp_url)
        logger.info("BrowserSession connected via CDP: %s", cdp_url)
        return self.session

    async def _start_direct_mode(self) -> BrowserSession:
        """直接模式: browser-use 直接使用 CloakBrowser binary 和参数."""
        binary_path = ensure_binary()
        stealth_args = get_default_stealth_args() if self.config.stealth_args else []
        all_args = stealth_args + self.config.extra_args

        self.session = BrowserSession(
            executable_path=binary_path,
            headless=self.config.headless,
            args=all_args,
            user_data_dir=str(self.config.profile_dir),
            keep_alive=self.config.keep_alive,
            use_vision=self.config.use_vision,
        )
        logger.info(
            "BrowserSession direct mode (binary=%s, profile=%s)",
            binary_path,
            self.config.profile_dir,
        )
        return self.session

    async def close(self) -> None:
        """关闭浏览器和会话."""
        if self.browser is not None:
            try:
                await self.browser.close()
            except Exception:
                pass
            self.browser = None

        self.session = None
        self._agent = None

    # ------------------------------------------------------------------
    # 执行任务
    # ------------------------------------------------------------------

    async def run(
        self,
        task: str,
        llm: Any = None,
        **agent_kwargs: Any,
    ) -> AgentOutput:
        """执行 AI Agent 任务.

        Args:
            task: 任务描述（自然语言）
            llm: 自定义 LLM 实例，为 None 时用配置创建 ChatOpenAI
            **agent_kwargs: 传递给 browser-use Agent 的额外参数

        Returns:
            Agent 执行结果

        Example:
            agent = CloakAgent(profile_name="jd_session")
            result = await agent.run("打开京东，搜索'笔记本电脑'，获取前5个商品名称")
            print(result)
        """
        if self.session is None:
            await self.start()

        if llm is None:
            llm = ChatOpenAI(
                model=self.config.llm_model,
                temperature=self.config.llm_temperature,
            )

        self._agent = Agent(
            task=task,
            llm=llm,
            browser_session=self.session,
            **agent_kwargs,
        )

        result = await self._agent.run()
        return result

    # ------------------------------------------------------------------
    # 上下文管理器
    # ------------------------------------------------------------------

    async def __aenter__(self) -> "CloakAgent":
        await self.start()
        return self

    async def __aexit__(self, *args: Any) -> None:
        await self.close()
