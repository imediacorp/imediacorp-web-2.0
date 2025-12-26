/**
 * Broker Integration Component
 * UI for connecting to and executing trades through broker APIs
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  brokerService, 
  SUPPORTED_BROKERS, 
  PORTFOLIO_TRACKERS,
  type TradeOrder,
  type BrokerIntegration 
} from '@/lib/integrations/broker';
import type { PortfolioAction } from './PortfolioActions';

interface BrokerIntegrationProps {
  /** Action to execute (from PortfolioActions) */
  action?: PortfolioAction;
  /** Selected ticker for trade */
  ticker?: string;
  /** On trade executed callback */
  onTradeExecuted?: (result: { success: boolean; orderId?: string; error?: string }) => void;
}

export function BrokerIntegration({ action, ticker, onTradeExecuted }: BrokerIntegrationProps) {
  const [connectedBrokers, setConnectedBrokers] = useState<string[]>([]);
  const [selectedBroker, setSelectedBroker] = useState<string>('');
  const [connecting, setConnecting] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [credentials, setCredentials] = useState<Record<string, string>>({});

  useEffect(() => {
    setConnectedBrokers(brokerService.getConnectedBrokers());
  }, []);

  const handleConnect = async (brokerId: string) => {
    setConnecting(true);
    try {
      const success = await brokerService.connect(brokerId, credentials);
      if (success) {
        setConnectedBrokers(brokerService.getConnectedBrokers());
        setSelectedBroker(brokerId);
        setCredentials({});
      }
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = (brokerId: string) => {
    brokerService.disconnect(brokerId);
    setConnectedBrokers(brokerService.getConnectedBrokers());
    if (selectedBroker === brokerId) {
      setSelectedBroker('');
    }
  };

  const handleExecuteTrade = async () => {
    if (!selectedBroker || !action || !ticker) return;

    setExecuting(true);
    try {
      const order: TradeOrder = {
        ticker: ticker,
        action: action.type === 'buy' || action.type === 'increase' ? 'buy' : 'sell',
        orderType: 'market', // Default to market order
        quantity: 1, // Default quantity, would be configurable in production
      };

      const result = await brokerService.executeTrade(selectedBroker, order);
      if (onTradeExecuted) {
        onTradeExecuted(result);
      }
    } catch (error) {
      if (onTradeExecuted) {
        onTradeExecuted({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    } finally {
      setExecuting(false);
    }
  };

  const allIntegrations = [...SUPPORTED_BROKERS, ...PORTFOLIO_TRACKERS];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Broker Integrations</h3>
        
        {/* Connected Brokers */}
        {connectedBrokers.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Connected:</p>
            <div className="flex flex-wrap gap-2">
              {connectedBrokers.map((brokerId) => {
                const broker = allIntegrations.find(b => b.id === brokerId);
                return (
                  <div
                    key={brokerId}
                    className="flex items-center space-x-2 px-3 py-1 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <span className="text-sm font-medium text-green-800">{broker?.name}</span>
                    <button
                      onClick={() => handleDisconnect(brokerId)}
                      className="text-green-600 hover:text-green-800"
                      aria-label="Disconnect"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Brokers */}
        <div className="space-y-2">
          <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Available Integrations:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            {allIntegrations.map((broker) => {
              const isConnected = connectedBrokers.includes(broker.id);
              return (
                <div
                  key={broker.id}
                  className={`p-3 border rounded-lg ${
                    isConnected
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{broker.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {broker.supportedActions.join(', ')}
                      </p>
                    </div>
                    {isConnected ? (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                        Connected
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          if (broker.authRequired) {
                            // In production, this would open OAuth flow or credential modal
                            const apiKey = prompt(`Enter API key for ${broker.name}:`);
                            if (apiKey) {
                              setCredentials({ apiKey });
                              handleConnect(broker.id);
                            }
                          } else {
                            handleConnect(broker.id);
                          }
                        }}
                        disabled={connecting}
                        className="text-xs px-2 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trade Execution - Mobile responsive */}
      {action && ticker && connectedBrokers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3">Execute Trade</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Select Broker
              </label>
              <select
                value={selectedBroker}
                onChange={(e) => setSelectedBroker(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">Choose a broker...</option>
                {connectedBrokers.map((brokerId) => {
                  const broker = allIntegrations.find(b => b.id === brokerId);
                  const canExecute = broker?.supportedActions.includes(action.type === 'buy' ? 'buy' : 'sell');
                  if (!canExecute) return null;
                  return (
                    <option key={brokerId} value={brokerId}>
                      {broker?.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <button
              onClick={handleExecuteTrade}
              disabled={!selectedBroker || executing}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {executing ? 'Executing...' : `${action.type.toUpperCase()} ${ticker}`}
            </button>
            <p className="text-xs text-gray-500">
              ⚠️ This is a simulation. In production, this would execute real trades.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

