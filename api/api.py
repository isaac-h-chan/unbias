from fastapi import FastAPI
from pydantic import BaseModel
from api.analyze import getMeanSyllables, getMeanWords, getSentiment

class Words(BaseModel):
    text: str

app = FastAPI()

@app.get("/")
async def test():
    return {"data": "hello"}

@app.post("/analyze")
async def analyze(req: Words):
    text = req.text
    mWords = getMeanWords(text)
    mSyllables = getMeanSyllables(text)
    sents, sentiment = getSentiment(text)

    return {
        "sents": sents,
        "length": mWords,
        "complexity": mSyllables,
        "sentiment": sentiment
    }
