/**
 * Ask CHADD Component
 * Context-aware chat interface for asking CHADD diagnostic questions
 * Integrated into portfolio analysis workflow
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { portfolioApi } from '@/lib/api/portfolio';
import { investmentPhilosophyApi } from '@/lib/api/investment-philosophy';
import type { AskCHADDRequest, HoldingAnalysis, TopRecommendationsResponse, Holding } from '@/types/portfolio';
import type { InvestmentPhilosophy } from '@/types/investment-philosophy';

interface Message {
  id: string;
  role: 'user' | 'chadd';
  content: string;
  timestamp: Date;
}

interface AskCHADDProps {
  /** Currently selected holding for analysis */
  selectedHolding?: HoldingAnalysis | null;
  /** Current portfolio recommendations */
  recommendations?: TopRecommendationsResponse | null;
  /** Current holdings list */
  holdings?: Holding[];
  /** Current timeframe */
  timeframe?: string;
  /** Compact mode for sidebar/floating display */
  compact?: boolean;
  /** Show suggested questions based on context */
  showSuggestions?: boolean;
  /** Callback when CHADD provides advice (for action recommendations) */
  onAdviceUpdate?: (advice: string) => void;
}

export function AskCHADD({
  selectedHolding,
  recommendations,
  holdings,
  timeframe,
  compact = false,
  showSuggestions = true,
  onAdviceUpdate,
}: AskCHADDProps = {}) {
  // Load conversation history from localStorage
  const loadHistory = (): Message[] => {
    try {
      const saved = localStorage.getItem('askCHADD_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert timestamp strings back to Date objects
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      }
    } catch (e) {
      console.warn('Failed to load conversation history:', e);
    }
    return [
      {
        id: '1',
        role: 'chadd',
        content: getContextualGreeting(selectedHolding, recommendations),
        timestamp: new Date(),
      },
    ];
  };

  const [messages, setMessages] = useState<Message[]>(loadHistory);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [investmentPhilosophy, setInvestmentPhilosophy] = useState<InvestmentPhilosophy | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load investment philosophy profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await investmentPhilosophyApi.getActiveProfile();
        setInvestmentPhilosophy(profile);
      } catch (error) {
        console.warn('[AskCHADD] Failed to load investment philosophy profile:', error);
        // Continue without profile - not critical
      }
    };
    loadProfile();
  }, []);
  
  // Save conversation history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('askCHADD_history', JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save conversation history:', e);
    }
  }, [messages]);
  
  // Update greeting when context changes (only if it's just the greeting)
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'chadd') {
      const newGreeting = getContextualGreeting(selectedHolding, recommendations);
      setMessages([{
        id: '1',
        role: 'chadd',
        content: newGreeting,
        timestamp: new Date(),
      }]);
    }
  }, [selectedHolding, recommendations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getSuggestedQuestions = (): string[] => {
    const suggestions: string[] = [];
    
    // Personalize suggestions based on investment philosophy
    const style = investmentPhilosophy?.investmentStyle || 'balanced';
    const riskCategory = investmentPhilosophy?.riskCategory || 'moderate';
    
      if (selectedHolding) {
        if (style === 'value') {
          suggestions.push(
            `Is ${selectedHolding.ticker} undervalued according to CHaDD™ analysis?`,
            `What's the long-term stability (S) score for ${selectedHolding.company_name}?`
          );
        } else if (style === 'growth') {
          suggestions.push(
            `What's the growth potential (Q) for ${selectedHolding.ticker}?`,
            `How does ${selectedHolding.company_name}'s coherence score indicate growth?`
          );
        } else if (style === 'speculative') {
          suggestions.push(
            `What's the short-term diagnostic (D) signal for ${selectedHolding.ticker}?`,
            `Is ${selectedHolding.ticker} a high-risk, high-reward opportunity?`
          );
        }
        
        suggestions.push(
          `What does CHaDD™ analysis reveal about ${selectedHolding.ticker}?`,
          `Should I buy ${selectedHolding.ticker} based on CHaDD™ diagnostics?`
        );
      }
    
    if (recommendations) {
      const longTerm = recommendations.recommendations?.long_term?.[0];
      const shortTerm = recommendations.recommendations?.short_term?.[0];
      
      if (longTerm && (style === 'value' || style === 'balanced' || investmentPhilosophy?.investmentHorizon === 'long_term')) {
        suggestions.push(
          `Why does CHaDD™ recommend ${longTerm.ticker} for long-term holding?`,
          `What makes ${longTerm.company_name} resilient according to CHaDD™?`
        );
      }
      
      if (shortTerm && (style === 'momentum' || style === 'speculative' || investmentPhilosophy?.investmentHorizon === 'short_term')) {
        suggestions.push(
          `What CHaDD™ metrics support ${shortTerm.ticker} as a short-term opportunity?`
        );
      }
      
      if (recommendations.total_holdings_analyzed > 0) {
        suggestions.push(
          `How should I diversify my portfolio based on CHaDD™ analysis?`,
          `What's the overall diagnostic health of my portfolio?`
        );
      }
    }
    
      // General suggestions (personalized by philosophy)
      if (suggestions.length < 4) {
        if (style === 'value') {
          suggestions.push(
            'How does CHaDD™ identify undervalued opportunities?',
            'What stability metrics should value investors focus on?'
          );
        } else if (style === 'growth') {
          suggestions.push(
            'How does CHaDD™ assess growth potential?',
            'What coherence metrics indicate strong growth?'
          );
        } else {
          suggestions.push(
            'How does CHaDD™ assess portfolio resilience?',
            'What do S/Q/U/D metrics mean in CHaDD™ analysis?'
          );
        }
        
        suggestions.push(
          'How can I interpret CHaDD™ diagnostic scores?',
          'What makes a holding resilient according to CHaDD™?'
        );
      }
    
    return suggestions.slice(0, 4);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    // Auto-submit after a brief delay for better UX
    setTimeout(() => {
      handleSubmit(new Event('submit') as any, suggestion);
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent, questionOverride?: string) => {
    e.preventDefault();
    const question = questionOverride || input.trim();
    if (!question || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Build context-aware request
      const context: Record<string, unknown> = {};
      
      if (selectedHolding) {
        context.selectedHolding = {
          ticker: selectedHolding.ticker,
          company_name: selectedHolding.company_name,
          resilience_score: selectedHolding.resilience_score,
          squd: selectedHolding.squd,
          investment_signal: selectedHolding.investment_signal,
        };
      }
      
      if (recommendations) {
        context.portfolio = {
          total_holdings: recommendations.total_holdings_analyzed,
          timeframe: recommendations.timeframe,
          long_term_count: recommendations.recommendations?.long_term?.length || 0,
          short_term_count: recommendations.recommendations?.short_term?.length || 0,
        };
      }
      
      if (holdings && holdings.length > 0) {
        context.holdings = holdings.map(h => ({
          ticker: h.ticker,
          company_name: h.company_name,
          weight: h.weight,
          sector: h.sector,
        }));
      }
      
      if (timeframe) {
        context.timeframe = timeframe;
      }

      // Include investment philosophy profile if available
      if (investmentPhilosophy) {
        context.investmentPhilosophy = {
          investmentStyle: investmentPhilosophy.investmentStyle,
          riskTolerance: investmentPhilosophy.riskTolerance,
          riskCategory: investmentPhilosophy.riskCategory,
          investmentHorizon: investmentPhilosophy.investmentHorizon,
          preferences: investmentPhilosophy.preferences,
          chaddPreferences: investmentPhilosophy.chaddPreferences,
        };
      }

      const request: AskCHADDRequest = {
        question: question,
        context: Object.keys(context).length > 0 ? context : undefined,
        ticker: selectedHolding?.ticker,
      };

      console.log('[AskCHADD] Sending context-aware request:', request);
      const response = await portfolioApi.askCHADD(request);
      console.log('[AskCHADD] Received response:', response);

      const chaddMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'chadd',
        content: response.answer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, chaddMessage]);
      
      // Notify parent component of new advice for action recommendations
      if (onAdviceUpdate) {
        onAdviceUpdate(response.answer);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'chadd',
        content: `I'm sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  function getContextualGreeting(
    holding: HoldingAnalysis | null | undefined,
    recs: TopRecommendationsResponse | null | undefined
  ): string {
    const philosophyNote = investmentPhilosophy
      ? ` I see you're a ${investmentPhilosophy.investmentStyle} investor with ${investmentPhilosophy.riskCategory} risk tolerance.`
      : '';
    
    if (holding) {
      return `I see you're analyzing ${holding.company_name} (${holding.ticker}).${philosophyNote} I'm here to help with portfolio diagnostics and CHaDD™ analysis tailored to your investment style. What would you like to know about this holding or your portfolio?`;
    }
    
    if (recs && recs.total_holdings_analyzed > 0) {
      return `I see you've analyzed ${recs.total_holdings_analyzed} holdings.${philosophyNote} I'm here to help with portfolio diagnostics and CHaDD™ analysis. What would you like to know?`;
    }
    
    return `Hello!${philosophyNote} I'm here to help you with portfolio diagnostics and CHaDD™ analysis. What would you like to know?`;
  }

  const clearHistory = () => {
    if (confirm('Clear conversation history?')) {
      setMessages([
        {
          id: '1',
          role: 'chadd',
          content: getContextualGreeting(selectedHolding, recommendations),
          timestamp: new Date(),
        },
      ]);
      localStorage.removeItem('askCHADD_history');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white text-xl font-bold">
              CH
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ask CHaDD™</h3>
              <p className="text-sm text-gray-600">Diagnostic insights powered by CHaDD™</p>
            </div>
          </div>
          {messages.length > 1 && (
            <button
              onClick={clearHistory}
              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
              title="Clear conversation history"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Messages - Mobile responsive */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 sm:px-4 sm:py-3 ${
                message.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900 border border-gray-200'
              }`}
            >
              <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{message.content}</p>
              <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-primary-100' : 'text-gray-500'}`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-3 border border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span className="text-sm text-gray-600">CHADD is analyzing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {showSuggestions && !compact && getSuggestedQuestions().length > 0 && (
        <div className="px-6 py-3 border-t border-gray-200 bg-blue-50">
          <p className="text-xs font-medium text-gray-700 mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {getSuggestedQuestions().map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs px-3 py-1 bg-white border border-gray-300 rounded-full hover:bg-primary-50 hover:border-primary-300 transition-colors text-gray-700"
                disabled={loading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input - Mobile responsive */}
      <form onSubmit={handleSubmit} className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              selectedHolding
                ? `Ask about ${selectedHolding.ticker}...`
                : "Ask CHADD about portfolio diagnostics..."
            }
            className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 sm:px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation text-sm sm:text-base"
          >
            Ask
          </button>
        </div>
        {!compact && (
          <p className="mt-2 text-xs text-gray-500 hidden sm:block">
            {selectedHolding
              ? `Ask about ${selectedHolding.ticker}, portfolio diagnostics, or CHADD analysis`
              : 'Examples: "What does CHADD analysis reveal about Apple?", "How do I interpret S/Q/U/D metrics?", "What makes a holding resilient?"'}
          </p>
        )}
      </form>
    </div>
  );
}

