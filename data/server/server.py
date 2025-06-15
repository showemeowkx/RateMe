from fastapi import FastAPI
from dotenv import *
from dto.review_dto import ReviewDto
import uvicorn
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from model.label_data import main

load_dotenv()
model_port = int(os.getenv('PORT'))
model_host = os.getenv('HOST')

app = FastAPI()

@app.post("/")
async def analyze_rating(data: ReviewDto):
    res = main(data.model_dump())
    return {"isRecommended":res[0].item()}

if __name__ == "__main__":
    uvicorn.run(app, host=model_host, port=model_port)