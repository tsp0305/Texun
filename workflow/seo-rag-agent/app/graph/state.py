from typing import TypedDict, List

class GraphState(TypedDict):
    user_input: str
    file_path: str
    params: dict
    context_chunks: List[str]
    draft_article: str
    final_article: str