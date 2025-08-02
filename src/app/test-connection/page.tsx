'use client';

import { useState, useEffect } from 'react';

export default function TestConnection() {
  const [apiStatus, setApiStatus] = useState<'loading' | 'success' | 'error'>('loading');
  interface TestResult {
    name: string;
    status: string;
    statusCode?: number;
    data?: any;
    error?: string;
  }
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  useEffect(() => {
    testConnections();
  }, []);

  const testConnections = async () => {
    const tests = [
      { name: 'Basic API Test', url: '/api/test' },
      { name: 'Registration API', url: '/api/auth/register', method: 'POST', body: { test: true } },
      { name: 'Database Connection', url: '/api/test', method: 'POST', body: { testDb: true } }
    ];

    const results: TestResult[] = [];

    for (const test of tests) {
      try {
        const options: RequestInit = {
          method: test.method || 'GET',
          headers: { 'Content-Type': 'application/json' }
        };

        if (test.body) {
          options.body = JSON.stringify(test.body);
        }

        const response = await fetch(test.url, options);
        const data = await response.json();

        results.push({
          name: test.name,
          status: response.ok ? 'success' : 'error',
          statusCode: response.status,
          data: data
        });
      } catch (error) {
        results.push({
          name: test.name,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    setTestResults(results);
    setApiStatus(results.every(r => r.status === 'success') ? 'success' : 'error');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Server Status</h2>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            apiStatus === 'loading' ? 'bg-yellow-100 text-yellow-800' :
            apiStatus === 'success' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {apiStatus === 'loading' && '🔄 Testing...'}
            {apiStatus === 'success' && '✅ All tests passed'}
            {apiStatus === 'error' && '❌ Some tests failed'}
          </div>
        </div>

        <div className="space-y-4">
          {testResults.map((result, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">{result.name}</h3>
                <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
                  result.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {result.status === 'success' ? '✅ Success' : '❌ Failed'}
                </span>
              </div>
              
              {result.statusCode && (
                <p className="text-sm text-gray-600 mb-2">Status Code: {result.statusCode}</p>
              )}
              
              {result.data && (
                <div className="bg-gray-50 rounded p-3 mb-2">
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}
              
              {result.error && (
                <div className="bg-red-50 rounded p-3 text-red-700 text-sm">
                  Error: {result.error}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Troubleshooting</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Make sure the development server is running with `npm run dev`</li>
            <li>• Check that the server is running on http://localhost:3000</li>
            <li>• Verify your database connection string in .env.local</li>
            <li>• Check the browser console for additional error details</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={testConnections}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retest Connections
          </button>
        </div>
      </div>
    </div>
  );
}