from fastapi import FastAPI
from pydantic import BaseModel
from api.analyze import getMeanSyllables, getMeanWords, getSentiment, cleanTokenize
import regex as re
import together

together.api_key = ""
ENDPOINT_URL = "https://api.together.xyz/inference"
MODEL = "togethercomputer/llama-2-70b-chat"

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
    
    maxTokens = 2*(len(cleanTokenize(text)).bit_length() + 1)**2

    prompt_stem = """<human>: Rephrase the following text in a neutral tone: If you don't get your act together, I'm going to lose my mind!!!I'm not kidding!!!I'm at my wit's end!!!I've never been so angry in my life!

<bot>: I'm feeling overwhelmed and concerned about the situation. I would appreciate it if you could help me find a solution.

<human>: Rephrase the following text in a neutral tone: You had one simple job and you couldn't even do that right. I'm so sick and tired of your incompetence.

<bot>: I'm disappointed that you didn't complete the task as expected. I'm concerned about your performance and I'd like to discuss how we can improve it.

<human>: Rephrase the following text in a neutral tone:"""

    res = together.Complete.create(
        model=MODEL,
        prompt=prompt_stem + text + "\n\n<bot>:",
        max_tokens=maxTokens,
        stop=["<human>", "\n\n"],
        temperature=0.7,
        top_p=0.7,
        top_k=50,
        repetition_penalty=1
    )

    return re.sub("\\n\\n", "", res["output"]["choices"][0]["text"])
    