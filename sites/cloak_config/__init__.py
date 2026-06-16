"""CloakBrowser AI Agent 配置与集成模块.

提供:
- cb_config: 全局配置（profile 目录、stealth 参数等）
- cb_agent: browser-use + CloakBrowser 集成（支持持久化 profile、CDP 模式）
"""

from .cb_config import CloakConfig, get_config, PROFILES_DIR
from .cb_agent import CloakAgent, create_stealth_browser

__all__ = [
    "CloakConfig",
    "get_config",
    "PROFILES_DIR",
    "CloakAgent",
    "create_stealth_browser",
]
