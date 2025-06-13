from fastapi import FastAPI
from dotenv import *
import uvicorn
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from model import *

load_dotenv()
model_port = int(os.getenv('PORT'))

app = FastAPI()

if __name__ == "__main__":
    uvicorn.run(app, port=model_port)