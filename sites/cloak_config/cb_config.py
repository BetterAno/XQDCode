"""CloakBrowser 全局配置.

管理 CloakBrowser 的 profile 目录、stealth 参数、LLM 配置等。

环境变量:
    CLOAK_PROFILES_DIR: 覆盖默认 profile 存储目录
    OPENAI_API_KEY: browser-use 使用的 LLM API key
    CLOAK_LLM_MODEL: 覆盖默认 LLM 模型（默认 gpt-4o-mini）
"""

import os
from pathlib import Path
from dataclasses import dataclass, field

# ---------------------------------------------------------------------------
# Profile 持久化目录
# ---------------------------------------------------------------------------
PROFILES_DIR = Path(
    os.environ.get("CLOAK_PROFILES_DIR", Path(__file__).resolve().parent.parent.parent / "cloak_profiles")
)

# ---------------------------------------------------------------------------
# 默认 LLM 配置
# ---------------------------------------------------------------------------
DEFAULT_LLM_MODEL = os.environ.get("CLOAK_LLM_MODEL", "gpt-4o-mini")
DEFAULT_LLM_TEMPERATURE = 0.1


@dataclass
class CloakConfig:
    """CloakBrowser + browser-use 的完整配置.

    Attributes:
        headless: 是否无头模式
        profile_name: 持久化 profile 名称（对应 PROFILES_DIR 下的子目录）
        humanize: 是否启用人性化行为模拟
        stealth_args: 是否使用默认 stealth 参数
        llm_model: LLM 模型名称
        llm_temperature: LLM 温度参数
        cdp_port: CDP 远程调试端口
        viewport: 浏览器视口大小
        timezone: IANA 时区（如 'Asia/Shanghai'）
        locale: BCP 47 语言环境（如 'zh-CN'）
        extra_args: 额外的 Chromium 命令行参数
        keep_alive: browser-use 是否保持浏览器存活
    """

    # 浏览器配置
    headless: bool = True
    profile_name: str = "default"
    humanize: bool = False
    stealth_args: bool = True
    viewport: dict | None = None
    timezone: str | None = None
    locale: str | None = None
    extra_args: list[str] = field(default_factory=list)

    # CDP 配置
    cdp_port: int = 9242

    # LLM 配置
    llm_model: str = DEFAULT_LLM_MODEL
    llm_temperature: float = DEFAULT_LLM_TEMPERATURE

    # browser-use 配置
    keep_alive: bool = False
    use_vision: bool = True

    @property
    def profile_dir(self) -> Path:
        """获取当前 profile 的持久化目录."""
        return PROFILES_DIR / self.profile_name

    def ensure_profile_dir(self) -> Path:
        """确保 profile 目录存在并返回路径."""
        d = self.profile_dir
        d.mkdir(parents=True, exist_ok=True)
        return d


# 全局单例配置
_config: CloakConfig | None = None


def get_config() -> CloakConfig:
    """获取全局 CloakConfig 单例."""
    global _config
    if _config is None:
        _config = CloakConfig()
    return _config
