import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from summarize import summarize
from schemas import TextData

app = FastAPI()

# CORS 설정 (개발 환경에서 편리하게 하기 위해 모든 도메인 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LogData(BaseModel):
    index : int
    title : str
    subtitle : str
    content: str
    timestamp: str


@app.post("/log/")
async def log_data(log: LogData):
    log_entry = log.dict()
    try:
        if os.path.exists("data.json"):
            with open("data.json", "r") as file:
                data = json.load(file)
        else:
            data = []

        data.append(log_entry)

        with open("data.json", "w") as file:
            json.dump(data, file, indent=4)

        return {"message": "Log entry added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/logs/")
async def get_logs():
    try:
        if os.path.exists("data.json"):
            with open("data.json", "r") as file:
                data = json.load(file)
        else:
            data = []
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


@app.post("/predict/")
async def get_prediction(data: TextData):
    text_input = f"{data.origin}[ADDED]{data.added}[/ADDED]"
    try:
        predicted_text = summarize(text_input)
        return predicted_text
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))