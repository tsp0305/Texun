import logging

from app.graph.state import GraphState
from app.agents.prompt_agent import run_prompt_agent
from app.agents.rag_agent import run_rag_agent
from app.agents.writer_agent import run_writer_agent
from app.agents.humanizer_agent import run_humanizer_agent

logger = logging.getLogger(__name__)

def prompt_node(state: GraphState) -> GraphState:
    try:
        logger.info("graph.prompt_node: starting")
        params = run_prompt_agent(state["user_input"])
        logger.info("graph.prompt_node: completed with params keys=%s", list(params.keys()))
        return {**state, "params": params}
    except Exception as exc:
        logger.exception("graph.prompt_node failed")
        raise RuntimeError(f"prompt_node failed: {exc}") from exc

def rag_node(state: GraphState) -> GraphState:
    try:
        logger.info("graph.rag_node: starting")
        query = state["params"]["topic"]
        chunks = run_rag_agent(state["file_path"], query)
        logger.info("graph.rag_node: completed with %d chunks", len(chunks))
        return {**state, "context_chunks": chunks}
    except Exception as exc:
        logger.exception("graph.rag_node failed")
        raise RuntimeError(f"rag_node failed: {exc}") from exc

def writer_node(state: GraphState) -> GraphState:
    try:
        logger.info("graph.writer_node: starting")
        article = run_writer_agent(state["params"], state["context_chunks"])
        logger.info("graph.writer_node: completed")
        return {**state, "draft_article": article}
    except Exception as exc:
        logger.exception("graph.writer_node failed")
        raise RuntimeError(f"writer_node failed: {exc}") from exc

def humanizer_node(state: GraphState) -> GraphState:
    try:
        logger.info("graph.humanizer_node: starting")
        final = run_humanizer_agent(state["draft_article"])
        logger.info("graph.humanizer_node: completed")
        return {**state, "final_article": final}
    except Exception as exc:
        logger.exception("graph.humanizer_node failed")
        raise RuntimeError(f"humanizer_node failed: {exc}") from exc