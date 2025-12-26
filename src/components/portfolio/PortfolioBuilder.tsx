/**
 * Portfolio Builder Component
 * Allows users to create portfolios from Berkshire holdings, start fresh, or import data
 */

'use client';

import React, { useState, useCallback, useRef } from 'react';
import { portfolioApi } from '@/lib/api/portfolio';
import type { Holding } from '@/types/portfolio';

interface PortfolioBuilderProps {
  onPortfolioCreated?: (data: { holdings: Holding[]; portfolioId?: string }) => void;
  onCancel?: () => void;
}

interface HoldingsListProps {
  holdings: Holding[];
  onRemove: (ticker: string) => void;
  onUpdateWeight: (ticker: string, weight: number | undefined) => void;
  onError: (error: string | null) => void;
}

type CreationMode = 'berkshire' | 'empty' | 'import' | null;

function HoldingsList({ holdings, onRemove, onUpdateWeight, onError }: HoldingsListProps) {
  const [editingTicker, setEditingTicker] = useState<string | null>(null);
  const [weightValue, setWeightValue] = useState<string>('');

  const handleStartEdit = (holding: Holding) => {
    setEditingTicker(holding.ticker);
    setWeightValue(holding.weight ? (holding.weight * 100).toFixed(2) : '');
  };

  const handleWeightUpdate = (ticker: string) => {
    const newWeight = weightValue ? parseFloat(weightValue) / 100 : undefined;
    if (newWeight !== undefined && (newWeight < 0 || newWeight > 1)) {
      onError('Weight must be between 0 and 100%');
      return;
    }
    onUpdateWeight(ticker, newWeight);
    setEditingTicker(null);
    setWeightValue('');
  };

  const handleCancelEdit = (holding: Holding) => {
    setEditingTicker(null);
    setWeightValue(holding.weight ? (holding.weight * 100).toFixed(2) : '');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Holdings ({holdings.length})
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {holdings.map((holding) => (
          <div
            key={holding.ticker}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{holding.ticker}</div>
              <div className="text-sm text-gray-600">{holding.company_name}</div>
              {holding.sector && (
                <div className="text-xs text-gray-500">Sector: {holding.sector}</div>
              )}
              {holding.current_price && (
                <div className="text-xs text-gray-500">
                  Price: ${holding.current_price.toFixed(2)}
                </div>
              )}
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-gray-500">Weight:</span>
                {editingTicker === holding.ticker ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={weightValue}
                      onChange={(e) => setWeightValue(e.target.value)}
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleWeightUpdate(holding.ticker);
                        }
                      }}
                      autoFocus
                    />
                    <span className="text-xs">%</span>
                    <button
                      onClick={() => handleWeightUpdate(holding.ticker)}
                      className="px-2 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => handleCancelEdit(holding)}
                      className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartEdit(holding)}
                    className="text-xs text-primary-600 hover:text-primary-700 underline"
                  >
                    {holding.weight ? `${(holding.weight * 100).toFixed(1)}%` : 'Set weight'}
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={() => onRemove(holding.ticker)}
              className="ml-4 px-3 py-1 text-red-600 hover:bg-red-50 rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      {holdings.some((h) => h.weight) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Total Weight:{' '}
            <span className="font-semibold">
              {(holdings.reduce((sum, h) => sum + (h.weight || 0), 0) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function PortfolioBuilder({ onPortfolioCreated, onCancel }: PortfolioBuilderProps) {
  const [mode, setMode] = useState<CreationMode>(null);
  const [portfolioName, setPortfolioName] = useState('');
  const [portfolioDescription, setPortfolioDescription] = useState('');
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTicker, setNewTicker] = useState('');
  const [newWeight, setNewWeight] = useState('');
  const [importData, setImportData] = useState('');
  const [importFormat, setImportFormat] = useState<'csv' | 'json'>('csv');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleModeSelect = useCallback(async (selectedMode: CreationMode) => {
    setMode(selectedMode);
    setError(null);
    setHoldings([]);

    if (selectedMode === 'berkshire') {
      // Load Berkshire holdings
      setLoading(true);
      try {
        const bhHoldings = await portfolioApi.getBerkshireHoldings();
        setHoldings(bhHoldings);
      } catch (err) {
        setError('Failed to load Berkshire holdings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const handleAddTicker = useCallback(async () => {
    if (!newTicker.trim()) {
      setError('Please enter a ticker symbol');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create a temporary portfolio ID for adding holdings
      const tempPortfolioId = 'temp';
      const holding = await portfolioApi.addHolding(tempPortfolioId, {
        ticker: newTicker.trim().toUpperCase(),
        weight: newWeight ? parseFloat(newWeight) : undefined,
      });

      setHoldings((prev) => [...prev, holding]);
      setNewTicker('');
      setNewWeight('');
    } catch (err: any) {
      setError(err?.message || 'Failed to add holding');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [newTicker, newWeight]);

  const handleRemoveHolding = useCallback((ticker: string) => {
    setHoldings((prev) => prev.filter((h) => h.ticker !== ticker));
  }, []);

  const handleImport = useCallback(async () => {
    if (!importData.trim()) {
      setError('Please provide import data');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const importedHoldings = await portfolioApi.importPortfolio(importFormat, importData);
      setHoldings(importedHoldings);
      setImportData('');
    } catch (err: any) {
      setError(err?.message || 'Failed to import portfolio');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [importData, importFormat]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setImportData(content);
        // Auto-detect format from file extension
        if (file.name.endsWith('.json')) {
          setImportFormat('json');
        } else {
          setImportFormat('csv');
        }
      }
    };
    reader.readAsText(file);
  }, []);

  const handleCreatePortfolio = useCallback(async () => {
    if (!portfolioName.trim()) {
      setError('Please enter a portfolio name');
      return;
    }

    if (holdings.length === 0) {
      setError('Please add at least one holding');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const portfolio = await portfolioApi.createPortfolio({
        name: portfolioName,
        description: portfolioDescription || undefined,
        base_type: mode || 'empty',
        holdings: holdings,
      });

      if (onPortfolioCreated) {
        onPortfolioCreated({
          holdings: portfolio.holdings || holdings,
          portfolioId: portfolio.id || portfolio.portfolio_id,
        });
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to create portfolio');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [portfolioName, portfolioDescription, mode, holdings, onPortfolioCreated]);

  if (mode === null) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Portfolio</h2>
          <p className="text-gray-600">Choose how you'd like to start building your portfolio</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleModeSelect('berkshire')}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
          >
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start with Berkshire Holdings</h3>
            <p className="text-sm text-gray-600">
              Use Berkshire Hathaway's portfolio as a starting point and customize it
            </p>
          </button>

          <button
            onClick={() => handleModeSelect('empty')}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
          >
            <div className="text-3xl mb-3">✨</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Fresh</h3>
            <p className="text-sm text-gray-600">
              Build your portfolio from scratch by selecting individual tickers
            </p>
          </button>

          <button
            onClick={() => handleModeSelect('import')}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
          >
            <div className="text-3xl mb-3">📥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Import Data</h3>
            <p className="text-sm text-gray-600">
              Import your portfolio from CSV or JSON files
            </p>
          </button>
        </div>

        {onCancel && (
          <div className="text-center">
            <button
              onClick={onCancel}
              className="text-gray-600 hover:text-gray-900 underline"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  }

  // Main portfolio builder view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Build Your Portfolio</h2>
          <p className="text-gray-600">
            {mode === 'berkshire' ? 'Starting with Berkshire Hathaway holdings' :
             mode === 'empty' ? 'Building from scratch' :
             mode === 'import' ? 'Importing from file' : ''}
          </p>
        </div>
        <button
          onClick={() => {
            setMode(null);
            setHoldings([]);
            setError(null);
          }}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Portfolio Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Details</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="portfolio-name" className="block text-sm font-medium text-gray-700 mb-1">
              Portfolio Name *
            </label>
            <input
              id="portfolio-name"
              type="text"
              value={portfolioName}
              onChange={(e) => setPortfolioName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              placeholder="My Investment Portfolio"
            />
          </div>
          <div>
            <label htmlFor="portfolio-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              id="portfolio-description"
              value={portfolioDescription}
              onChange={(e) => setPortfolioDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              rows={2}
              placeholder="Describe your investment strategy..."
            />
          </div>
        </div>
      </div>

      {/* Import Section */}
      {mode === 'import' && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Portfolio</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Import Format
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="csv"
                    checked={importFormat === 'csv'}
                    onChange={(e) => setImportFormat(e.target.value as 'csv' | 'json')}
                    className="mr-2"
                  />
                  CSV
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="json"
                    checked={importFormat === 'json'}
                    onChange={(e) => setImportFormat(e.target.value as 'csv' | 'json')}
                    className="mr-2"
                  />
                  JSON
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
              <p className="mt-2 text-xs text-gray-500">
                CSV format: ticker,company_name,weight,sector (header row optional)<br />
                JSON format: [&#123;"ticker": "...", "company_name": "...", "weight": 0.1, "sector": "..."&#125;, ...]
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or Paste Data
              </label>
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                rows={6}
                placeholder={importFormat === 'csv' 
                  ? 'ticker,company_name,weight,sector\nAAPL,Apple Inc.,0.5,Technology'
                  : '[{"ticker": "AAPL", "company_name": "Apple Inc.", "weight": 0.5, "sector": "Technology"}]'
                }
              />
            </div>

            <button
              onClick={handleImport}
              disabled={loading || !importData.trim()}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Importing...' : 'Import Portfolio'}
            </button>
          </div>
        </div>
      )}

      {/* Add Ticker Section (for empty mode) */}
      {mode === 'empty' && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Holdings</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
              placeholder="Ticker (e.g., AAPL)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddTicker();
                }
              }}
            />
            <input
              type="number"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="Weight (0-1)"
              min="0"
              max="1"
              step="0.01"
              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={handleAddTicker}
              disabled={loading || !newTicker.trim()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Holdings List */}
      {holdings.length > 0 && (
        <HoldingsList
          holdings={holdings}
          onRemove={handleRemoveHolding}
          onUpdateWeight={(ticker, weight) => {
            setHoldings((prev) =>
              prev.map((h) => (h.ticker === ticker ? { ...h, weight } : h))
            );
          }}
          onError={setError}
        />
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleCreatePortfolio}
          disabled={loading || !portfolioName.trim() || holdings.length === 0}
          className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {loading ? 'Creating...' : 'Create Portfolio'}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

