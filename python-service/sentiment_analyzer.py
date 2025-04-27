import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from typing import Literal

# Download required NLTK data
nltk.download('vader_lexicon', quiet=True)

class SentimentAnalyzer:
    def __init__(self):
        self.analyzer = SentimentIntensityAnalyzer()
    
    def analyze(self, text: str) -> Literal['positive', 'negative', 'neutral']:
        scores = self.analyzer.polarity_scores(text)
        compound = scores['compound']
        
        if compound >= 0.05:
            return 'positive'
        elif compound <= -0.05:
            return 'negative'
        else:
            return 'neutral'