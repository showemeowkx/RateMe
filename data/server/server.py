from __future__ import annotations
from fastapi import FastAPI, HTTPException
from dotenv import *
from dto.review_dto import ReviewDto
import uvicorn
import asyncio
import sys
import os

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MODELS_DIR = os.path.join(ROOT_DIR, "model", "pkl_models")

sys.path.append(ROOT_DIR)
from model.label_data import main

load_dotenv("./.env")
model_port = int(os.getenv("MODEL_PORT"))
model_host = os.getenv("MODEL_HOST")

app = FastAPI()

async def analyze_review(review: ReviewDto, models_path):
    try:
        from concurrent.futures import ThreadPoolExecutor
        from functools import partial

        with ThreadPoolExecutor() as pool:
            result = await app.state.loop.run_in_executor(
                pool,
                partial(main, review, models_path)
            )
            return {"isRecommended":result[0].item()}
    except Exception as e:
        print("Error:", e)
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )

@app.on_event("startup")
async def startup_event():
    app.state.loop = asyncio.get_event_loop()

@app.post("/")
async def analyze_rating(data: ReviewDto):
    return await analyze_review(data.model_dump(), MODELS_DIR)
        

if __name__ == "__main__":
    uvicorn.run(app, host=model_host, port=model_port, loop="auto")