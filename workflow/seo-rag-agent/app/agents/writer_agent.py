import logging
from pathlib import Path
from app.services.llm_service import get_llm

TEMPLATE_PATH = Path(__file__).parent.parent / "prompts" / "writer_prompt.txt"
logger = logging.getLogger(__name__)

def run_writer_agent(params: dict, context_chunks: list[str]) -> str:
    try:
        template = TEMPLATE_PATH.read_text()
        context = "\n\n".join(context_chunks)
        llm = get_llm(temperature=0.5)
        prompt = template.format(
            topic=params["topic"],
            tone=params["tone"],
            length=params["length"],
            target_audience=params["target_audience"],
            context=context,
        )
        logger.info(
            "writer_agent: generating draft for topic=%r with %d context chunks",
            params.get("topic"),
            len(context_chunks),
        )
        response = llm.invoke(prompt)
        logger.info("writer_agent: draft generation complete")
        return response.content
    except Exception as exc:
        logger.exception("writer_agent failed for topic=%r", params.get("topic"))
        raise RuntimeError(f"writer_agent failed for topic={params.get('topic')!r}: {exc}") from exc