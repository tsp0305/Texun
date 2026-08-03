import logging
from pathlib import Path
from app.services.llm_service import get_llm

TEMPLATE_PATH = Path(__file__).parent.parent / "prompts" / "humanizer_prompt.txt"
logger = logging.getLogger(__name__)

def run_humanizer_agent(article: str) -> str:
    try:
        template = TEMPLATE_PATH.read_text()
        llm = get_llm(temperature=0.6)
        logger.info("humanizer_agent: humanizing draft of length %d", len(article))
        response = llm.invoke(template.format(article=article))
        logger.info("humanizer_agent: humanization complete")
        return response.content
    except Exception as exc:
        logger.exception("humanizer_agent failed")
        raise RuntimeError(f"humanizer_agent failed: {exc}") from exc