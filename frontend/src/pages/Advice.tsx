import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../utils/api';

interface Message {
  role: 'user' | 'ai';
  content: string;
  type?: 'recovery' | 'info';
}

const Advice: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: 'Hello! I am your Vitality AI coach. How can I help you today?',
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const apiKey = localStorage.getItem('ai_api_key');
      const response = await api.post('/get-recommendation', { query: userMsg }, {
        headers: { 'x-api-key': apiKey || '' }
      });
      setMessages(prev => [...prev, { role: 'ai', content: response.data.recommendation }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I couldn't connect to the AI service. Please check your API key." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-[80vh] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-on-surface mb-1">Your Daily Insights</h1>
        <p className="text-on-surface-variant">Here is what I noticed about your recent activity.</p>
      </div>

      <div className="flex-grow space-y-8 pb-32">
        {messages.map((msg, idx) => (
          <div key={idx} className="flex gap-4 group">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${
              msg.role === 'ai' ? 'bg-primary-container' : 'bg-surface-variant'
            }`}>
              <span className={`material-symbols-outlined text-sm ${msg.role === 'ai' ? 'text-on-primary fill' : 'text-on-surface'}`}>
                {msg.role === 'ai' ? 'psychology' : 'person'}
              </span>
            </div>
            <div className="bg-surface rounded-2xl rounded-tl-none p-5 shadow-premium border border-surface-container-high max-w-[85%] space-y-4">
              <div className="text-on-surface leading-relaxed space-y-3 prose prose-emerald dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
              
              {msg.type === 'info' && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-surface-variant">
                  <span className="material-symbols-outlined text-secondary text-base fill">favorite</span>
                  <span className="text-xs font-bold tracking-wider text-secondary uppercase">RHR: 64 BPM (+4 from baseline)</span>
                </div>
              )}

              {msg.type === 'recovery' && (
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center justify-between hover:border-primary-container transition-all cursor-pointer group/card shadow-sm hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-secondary-container">self_improvement</span>
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">Restorative Yoga</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">20 mins • Low Impact</p>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center group-hover/card:bg-primary-container group-hover/card:text-on-primary transition-colors text-on-surface">
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-24 md:bottom-10 left-0 w-full px-4">
        <div className="max-w-3xl mx-auto bg-surface-container-low rounded-2xl p-2 flex items-center gap-2 border border-transparent focus-within:border-primary-container transition-all shadow-lg backdrop-blur-md bg-opacity-90">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={loading ? "Thinking..." : "Ask about your metrics or get alternative suggestions..."}
            disabled={loading}
            className="flex-grow bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-outline p-4"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="p-4 rounded-xl bg-primary-container text-on-primary hover:opacity-90 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="material-symbols-outlined fill">send</span>
            )}
          </button>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-tighter text-outline text-center mt-4 flex items-center justify-center gap-1 opacity-70">
          <span className="material-symbols-outlined text-xs">info</span>
          This is not medical advice. Consult a healthcare professional for specific concerns.
        </p>
      </div>
    </div>
  );
};

export default Advice;
