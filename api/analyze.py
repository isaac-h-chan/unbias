
import regex as re
import nltk
import ssl
import json
from nltk.tokenize import SyllableTokenizer
from nltk.sentiment import vader
from nltk.corpus import stopwords


try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

nltk.download('vader_lexicon')
nltk.download('stopwords')
nltk.download('punkt')

ssp = SyllableTokenizer()
sentimentAnalyzer = vader.SentimentIntensityAnalyzer()
stopwords = set(stopwords.words("english"))

# Processes a single string
def cleanTokenize(words):
    if not isinstance(words, str):
        words = str(words)
    words = words.lower()

    # remove emojis
    emoji_pattern=re.compile(pattern = "["
        u"\U0001F600-\U0001F64F"  # emoticons
        u"\U0001F300-\U0001F5FF"  # symbols & pictographs
        u"\U0001F680-\U0001F6FF"  # transport & map symbols
        u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
                           "]+", flags = re.UNICODE)
    words = emoji_pattern.sub(r'',words)

    # remove digits and punctuation
    words = words.translate(words.maketrans('!"#%&$()*+-./:;,<=>?@[\\]^_`{|}~0123456789', ' '*41))

    words = re.sub('\s+',' ', words).strip()

    return nltk.tokenize.word_tokenize(words)


def getMeanSyllables(text: str) -> float:
    """
    Args:
        - text: a raw, unprocess block of text
    
    Returns: Float value representing average syllables in the block of text excluding stopwords
    """
    words = cleanTokenize(text)
    meanSyllables = 0
    i = 0
    for word in words:
        if word.lower() not in stopwords:
            tokens = ssp.tokenize(word)
            meanSyllables += len(tokens)
            i += 1
    meanSyllables /= i
    return meanSyllables

def getSentences(text: str) -> list:
    return nltk.sent_tokenize(text)

def getMeanWords(text: str) -> float:
    """
    Args:
        - text: a raw, unprocess block of text

    Returns:
        - Float value representing the average number of words per sentence in the text
    """
    meanWords = 0
    sents = [re.sub("[.!?]", "", sent) for sent in getSentences(text)]
    meanWords += sum([len(sent.split()) for sent in sents])
    return meanWords/max(1, len(sents))

def getSentiment(text: str) -> list and list:
    """
    Args:
        - text: a raw, unprocess block of text
    
    Returns:
        - List containing the unique sentences in the text
        - List containing the polarity scores of the sentences in the corresponding index
    """
    sentiment = []
    sents = getSentences(text)
    for sent in sents:
        sentiment.append(sentimentAnalyzer.polarity_scores(sent))
    return sents, sentiment
