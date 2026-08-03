from langchain_community.vectorstores import InMemoryVectorStore
from app.services.embedding_service import get_embedding_model

def build_vector_store(chunks: list[str]):
    embeddings = get_embedding_model()
    store = InMemoryVectorStore.from_texts(chunks, embeddings)
    return store