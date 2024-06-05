from pydantic import BaseModel

class TextData(BaseModel):
    origin: str
    added: str