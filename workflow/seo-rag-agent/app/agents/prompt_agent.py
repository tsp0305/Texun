import logging
import json
from pathlib import Path
from app.services.llm_service import get_llm

TEMPLATE_PATH = Path(__file__).parent.parent / "prompts" / "prompt_formatter.txt"
logger = logging.getLogger(__name__)

def run_prompt_agent(user_input: str) -> dict:
    try:
        template = TEMPLATE_PATH.read_text()
        llm = get_llm(temperature=0)
        logger.info("prompt_agent: formatting user input")
        response = llm.invoke(template.format(user_input=user_input))
        raw = response.content.strip()
        raw = raw.removeprefix("```json").removeprefix("```").removesuffix("```").strip()

        logger.info("prompt_agent: raw model output=%s", raw)
        return json.loads(raw)
    except json.JSONDecodeError as exc:
        logger.exception("prompt_agent: failed to parse model response as JSON")
        # graceful fallback so a bad LLM response doesn't crash the pipeline
        return {
            "topic": user_input,
            "tone": "Professional",
            "length": 1200,
            "target_audience": "General readers",
        }
    except Exception as exc:
        logger.exception("prompt_agent failed for user_input=%r", user_input)
        raise RuntimeError(f"prompt_agent failed: {exc}") from exc