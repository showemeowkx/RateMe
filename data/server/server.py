from __future__ import annotations
from fastapi import FastAPI, HTTPException
from dotenv import *
from dto.review_dto import ReviewDto
import uvicorn
import asyncio
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from model.label_data import main

load_dotenv()
model_port = int(os.getenv('PORT'))
model_host = os.getenv('HOST')

app = FastAPI()

async def analyze_review(review: ReviewDto):
    try:
        from concurrent.futures import ThreadPoolExecutor
        from functools import partial

        with ThreadPoolExecutor() as pool:
            result = await app.state.loop.run_in_executor(
                pool,
                partial(main, review)
            )
            return {"isRecommended":result[0].item()}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )

@app.on_event("startup")
async def startup_event():
    import asyncio
    app.state.loop = asyncio.get_event_loop()

@app.post("/")
async def analyze_rating(data: ReviewDto):
    return await analyze_review(data.model_dump())

if __name__ == "__main__":
    uvicorn.run(app, host=model_host, port=model_port, loop="auto")