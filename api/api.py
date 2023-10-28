from fastapi import FastAPI
from pydantic import BaseModel
from api.analyze import getMeanSyllables, getMeanWords, getSentiment, cleanTokenize
import requests
import together

together.api_key = "40cf8a0074d3b4a1b06445377ae0edea96ff2ce61f2a1388131668ed9bcb3ad4"
ENDPOINT_URL = "https://api.together.xyz/inference"
MODEL = "togethercomputer/llama-2-7b-chat"

class Words(BaseModel):
    text: str

app = FastAPI()

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

@app.post("/neutral")
def neutral(req: Words):

    text = req.text
    
    maxTokens = (len(cleanTokenize(text)).bit_length() + 1)**2

    prompt_stem = "<human>: Reword the provided text in a more neutral tone.\nProvided Text: "

    res = together.Complete.create(
        model=MODEL,
        prompt=prompt_stem + text + "\n<bot>: ",
        max_tokens=maxTokens,
        stop=["<human>", "."],
        temperature=0.7,
        top_p=0.7,
        top_k=50,
        repetition_penalty=1
    )

    return res["output"]["choices"]
    