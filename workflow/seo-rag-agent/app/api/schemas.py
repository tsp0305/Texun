from pydantic import BaseModel

class ArticleResponse(BaseModel):
    topic: str
    tone: str
    target_audience: str
    article: str