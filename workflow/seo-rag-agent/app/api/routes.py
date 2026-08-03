import os
import uuid
import logging
import traceback
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.config import settings
from app.graph.graph import compiled_graph
from app.api.schemas import ArticleResponse

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/generate-article", response_model=ArticleResponse)
async def generate_article(
    prompt: str = Form(...),
    file: UploadFile = File(...),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    temp_path = os.path.join(settings.UPLOAD_DIR, f"{uuid.uuid4()}.pdf")

    try:
        contents = await file.read()
        with open(temp_path, "wb") as f:
            f.write(contents)

        logger.info(
            "generate-article: uploaded file saved to %s (prompt length=%d)",
            temp_path,
            len(prompt),
        )

        result = compiled_graph.invoke({
            "user_input": prompt,
            "file_path": temp_path,
        })

        logger.info(
            "generate-article: graph completed topic=%r tone=%r audience=%r",
            result["params"].get("topic"),
            result["params"].get("tone"),
            result["params"].get("target_audience"),
        )

        return ArticleResponse(
            topic=result["params"]["topic"],
            tone=result["params"]["tone"],
            target_audience=result["params"]["target_audience"],
            article=result["final_article"],
        )
    except Exception as e:
        logger.exception("generate-article failed")
        raise HTTPException(
            status_code=500,
            detail={
                "error": str(e),
                "traceback": traceback.format_exc(),
            },
        )
    finally:
        # discard the PDF — matches your "no persistence" requirement
        if os.path.exists(temp_path):
            os.remove(temp_path)


@router.get("/health")
async def health():
    return {"status": "ok"}