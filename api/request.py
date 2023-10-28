import requests

response = requests.post("http://127.0.0.1:8000/analyze", json={
    "text": "If you don't get your act together, I'm going to lose my mind!!!I'm not kidding!!!I'm at my wit's end!!!I've never been so angry in my life!!!"
    }
)
print(response.content)

response2 = requests.post("http://127.0.0.1:8000/analyze", json={"text": "We turn DMs into more flexible conditional image generators by augmenting their underlying UNet backbone withthe cross-attention mechanism [97], which is effective for learning attention-based models of various input modalities [35,36]."})

print(response2.content)