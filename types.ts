
export enum SentimentType {
  POSITIVE = 'Positive',
  NEGATIVE = 'Negative',
  NEUTRAL = 'Neutral',
  MIXED = 'Mixed'
}

export interface SentenceAnalysis {
  sentence: string;
  sentiment: string;
  sentiment_score: number;
  emotional_tone: string;
}

export interface SentimentResult {
  overall_sentiment: string;
  confidence_score: number;
  sentiment_score: number;
  emotional_tone: string;
  sarcasm_detected: boolean;
  sentence_analysis: SentenceAnalysis[];
  key_emotional_words: string[];
  error?: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
}
