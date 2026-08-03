from app.config import settings

def retrieve_relevant_chunks(vector_store, query: str) -> list[str]:
    retriever = vector_store.as_retriever(search_kwargs={"k": settings.TOP_K})
    docs = retriever.invoke(query)
    return [d.page_content for d in docs]