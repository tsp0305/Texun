import logging

from app.services.pdf_service import extract_text_from_pdf
from app.utils.chunking import split_text
from app.services.vector_service import build_vector_store
from app.services.retrieval_service import retrieve_relevant_chunks

logger = logging.getLogger(__name__)

def run_rag_agent(file_path: str, query: str) -> list[str]:
    try:
        logger.info("rag_agent: extracting text from %s", file_path)
        text = extract_text_from_pdf(file_path)

        logger.info("rag_agent: splitting extracted text into chunks")
        chunks = split_text(text)

        logger.info("rag_agent: building vector store with %d chunks", len(chunks))
        store = build_vector_store(chunks)

        logger.info("rag_agent: retrieving relevant chunks for query=%r", query)
        result = retrieve_relevant_chunks(store, query)
        logger.info("rag_agent: retrieved %d relevant chunks", len(result))
        return result
    except Exception as exc:
        logger.exception("rag_agent failed for file_path=%s query=%r", file_path, query)
        raise RuntimeError(f"rag_agent failed while processing file_path={file_path!r}: {exc}") from exc