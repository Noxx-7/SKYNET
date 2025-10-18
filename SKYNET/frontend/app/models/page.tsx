'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Brain, Cpu, Zap, TrendingUp, BarChart3, Home,
  Sparkles, CheckCircle, XCircle, Clock
} from 'lucide-react';

interface Model {
  id: string;
  name: string;
  provider: string;
  type: string;
  description?: string;
  status: string;
  avg_response_time?: number;
  total_requests?: number;
  success_rate?: number;
}

export default function ModelsPage() {
  const router = useRouter();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await fetch('/api/models');
      if (response.ok) {
        const data = await response.json();
        setModels(data);
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 backdrop-blur-lg bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Cpu className="w-8 h-8 text-green-500" />
              <span className="text-xl font-bold text-white">Model Management</span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/playground')}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition"
              >
                <Brain className="w-4 h-4 inline mr-2" />
                Playground
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 border border-gray-600 hover:border-gray-500 rounded-lg text-gray-300 transition"
              >
                <Home className="w-4 h-4 inline mr-2" />
                Home
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Models</h1>
          <p className="text-gray-400">Manage and monitor all your AI models</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : models.length === 0 ? (
          <div className="text-center py-12">
            <Cpu className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No models yet</h2>
            <p className="text-gray-400 mb-6">Add API keys in the playground to get started</p>
            <button
              onClick={() => router.push('/playground')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-white font-medium transition"
            >
              Go to Playground
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model) => (
              <div
                key={model.id}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-purple-500 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {model.type === 'custom' ? (
                      <Cpu className="w-8 h-8 text-purple-400" />
                    ) : (
                      <Sparkles className="w-8 h-8 text-blue-400" />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-white">{model.name}</h3>
                      <p className="text-sm text-gray-400 capitalize">{model.provider || 'Custom'}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    model.status === 'active' ? 'bg-green-900/30 text-green-400' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {model.status}
                  </div>
                </div>

                {model.description && (
                  <p className="text-sm text-gray-400 mb-4">{model.description}</p>
                )}

                {/* Stats */}
                <div className="space-y-2 border-t border-gray-700 pt-4">
                  {model.total_requests !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Total Requests</span>
                      <span className="text-white font-medium">{model.total_requests}</span>
                    </div>
                  )}
                  {model.avg_response_time !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Avg Response</span>
                      <span className="text-white font-medium">{model.avg_response_time.toFixed(2)}s</span>
                    </div>
                  )}
                  {model.success_rate !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Success Rate</span>
                      <span className="text-white font-medium">{model.success_rate.toFixed(1)}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
