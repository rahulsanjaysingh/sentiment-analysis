
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';
import { SentimentResult, SentimentType } from '../types';

interface Props {
  data: SentimentResult;
}

const getSentimentColor = (sentiment: string) => {
  const s = sentiment.toLowerCase();
  if (s.includes('pos')) return '#10b981'; // Emerald 500
  if (s.includes('neg')) return '#ef4444'; // Red 500
  if (s.includes('neu')) return '#64748b'; // Slate 500
  return '#f59e0b'; // Amber 500 (Mixed)
};

export const AnalysisDashboard: React.FC<Props> = ({ data }) => {
  const chartData = [
    { name: 'Sentiment Score', value: data.sentiment_score * 100 },
    { name: 'Confidence', value: data.confidence_score },
  ];

  const pieData = data.sentence_analysis.reduce((acc: any[], curr) => {
    const existing = acc.find(item => item.name === curr.sentiment);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: curr.sentiment, value: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <span className="text-slate-500 text-sm font-medium">Overall Sentiment</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl font-bold`} style={{ color: getSentimentColor(data.overall_sentiment) }}>
              {data.overall_sentiment}
            </span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <span className="text-slate-500 text-sm font-medium">Sentiment Score</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">{data.sentiment_score.toFixed(2)}</span>
            <span className="text-xs text-slate-400">/ 1.0</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <span className="text-slate-500 text-sm font-medium">Confidence</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">{data.confidence_score}%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <span className="text-slate-500 text-sm font-medium">Sarcasm Detected</span>
          <div className="mt-1">
            {data.sarcasm_detected ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                Yes (High Probability)
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                No
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Sentiment Metrics</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? getSentimentColor(data.overall_sentiment) : '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Tone Distribution</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center mb-4">
              <span className="text-4xl capitalize font-light text-indigo-600 block">{data.emotional_tone}</span>
              <span className="text-slate-400 text-xs uppercase tracking-widest mt-2 block">Dominant Tone</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {data.key_emotional_words.map((word, i) => (
                <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm border border-indigo-100">
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sentence Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900">Sentence Analysis</h3>
          <p className="text-sm text-slate-500">Individual breakdown of each segment in your text.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/2">Sentence</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sentiment</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tone</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.sentence_analysis.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-700 leading-relaxed italic">"{item.sentence}"</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" 
                          style={{ backgroundColor: `${getSentimentColor(item.sentiment)}20`, color: getSentimentColor(item.sentiment) }}>
                      {item.sentiment}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.emotional_tone}</td>
                  <td className="px-6 py-4 text-sm text-right font-mono text-slate-500">
                    {item.sentiment_score > 0 ? '+' : ''}{item.sentiment_score.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
