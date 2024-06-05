from fastapi import FastAPI, HTTPException
from summarize import summarize
from schemas import TextData

app = FastAPI()

@app.post("/predict/")
async def get_prediction(data: TextData):
    text_input = f"{data.origin}[ADDED]{data.added}[/ADDED]"
    try:
        predicted_text = summarize(text_input)
        return predicted_text
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))