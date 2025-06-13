from fastapi import FastAPI
from dotenv import *
from dto.review_dto import ReviewDto
import uvicorn
import sys
import os
#TO BE FIXED
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
# from model.label_data import *

load_dotenv()
model_port = int(os.getenv('PORT'))
model_host = os.getenv('HOST')

app = FastAPI()

@app.post("/")
async def analyze_rating(data: ReviewDto):
    print('placeholder method')
    return data

if __name__ == "__main__":
    uvicorn.run(app, host=model_host, port=model_port)