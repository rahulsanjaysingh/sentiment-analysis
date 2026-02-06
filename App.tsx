
import React, { useState, useCallback } from 'react';
import { analyzeSentiment } from './services/geminiService';
import { SentimentResult } from './types';
import { AnalysisDashboard } from './components/AnalysisDashboard';

const App: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeSentiment(text);
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPaste = (sample: string) => {
    setText(sample);
  };

  const SAMPLES = [
    "This new software update is absolutely amazing! I'm so happy with the performance improvements. However, the UI takes a bit getting used to.",
    "I was quite disappointed with the service today. The staff was rude and the wait time was unbearable. Never coming back!",
    "The product arrived on time. It works as described. Nothing fancy, just functional."
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Sentix
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-indigo-600 transition-colors">Documentation</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">API Keys</a>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 pt-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Understand the <span className="text-indigo-600">Pulse</span> of Your Text
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Harness advanced neural analysis to decode sentiment, detect sarcasm, and uncover 
            the hidden emotional architecture of your content.
          </p>
        </header>

        {/* Input Section */}
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 mb-12">
          <div className="mb-6">
            <label htmlFor="input-text" className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
              Text Input
            </label>
            <textarea
              id="input-text"
              className="w-full h-48 p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-700 placeholder:text-slate-400 text-lg leading-relaxed"
              placeholder="Type or paste your text here (single sentences or paragraphs)..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase flex items-center h-full mr-2">Try:</span>
              {SAMPLES.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPaste(sample)}
                  className="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-indigo-600 rounded-full transition-all border border-transparent hover:border-indigo-100"
                >
                  Sample {idx + 1}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              className={`
                group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white shadow-lg shadow-indigo-200/50 transition-all active:scale-95
                ${loading || !text.trim() ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
              `}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing Pulse...</span>
                </>
              ) : (
                <>
                  <span>Analyze Sentiment</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Area */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        )}

        {loading && !result && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-medium">Extracting emotional markers...</p>
          </div>
        )}

        {result && <AnalysisDashboard data={result} />}
      </main>
      
      {/* Footer */}
      <footer className="mt-20 py-10 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p>© 2024 Sentix Analysis Engine. Built with Gemini 3 Flash.</p>
      </footer>
    </div>
  );
};

export default App;
