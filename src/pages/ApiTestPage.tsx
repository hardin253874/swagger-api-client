import React, { useState } from 'react';
import { ApiRequest, ApiResponse, HttpMethod, BimApiItem } from '../types';
import { apiService } from '../services';
import config from '../config';
// Import the meme image
import itWorksMeme from '../assets/it-works-meme.png';
// Import JSON templates
import carportModelJson from '../assets/request/carport_save_unenc.json';
import shedModelJson from '../assets/request/shed_save_unenc.json';

const httpMethods: HttpMethod[] = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'DELETE', label: 'DELETE' },
  { value: 'PATCH', label: 'PATCH' },
];

// JSON template mapping
const jsonTemplates: Record<string, any> = {
  'carport_save_unenc.json': carportModelJson,
  'shed_save_unenc.json': shedModelJson,
};

export const ApiTestPage: React.FC = () => {
  const [request, setRequest] = useState<ApiRequest>({
    url: '/api/values',
    method: 'GET',
    headers: {},
    body: '',
  });
  
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBimApi, setSelectedBimApi] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiService.makeRequest(request);
      setResponse(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setResponse(err);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestBody = (value: string) => {
    setRequest(prev => ({ ...prev, body: value }));
  };

  const handleBimApiSelection = (selectedName: string) => {
    setSelectedBimApi(selectedName);
    
    if (selectedName) {
      // Find the selected API from config
      const selectedApi = config.bimApiList.find(api => api.name === selectedName);
      if (selectedApi) {
        let requestBody = '';
        
        // Load JSON template for POST requests
        if (selectedApi.method === 'POST' && selectedApi.requestBody) {
          try {
            const jsonTemplate = jsonTemplates[selectedApi.requestBody];
            if (jsonTemplate) {
              // Pretty-format the JSON
              requestBody = JSON.stringify(jsonTemplate, null, 2);
            } else {
              console.warn(`JSON template not found: ${selectedApi.requestBody}`);
              requestBody = '{\n  "example": "JSON template not found"\n}';
            }
          } catch (error) {
            console.warn(`Could not load request body template: ${selectedApi.requestBody}`, error);
            requestBody = '{\n  "example": "Could not load JSON template"\n}';
          }
        }
        
        // Auto-update URL, Method, and Request Body fields
        setRequest(prev => ({
          ...prev,
          url: selectedApi.url,
          method: selectedApi.method,
          body: requestBody,
          headers: {
            ...prev.headers,
            'Content-Type': 'application/json'
          }
        }));
      }
    } else {
      // Reset to default values when no API selected
      setRequest(prev => ({
        ...prev,
        url: '/api/values',
        method: 'GET',
        body: '',
        headers: {}
      }));
    }
  };

  const handleUrlChange = (url: string) => {
    setRequest(prev => ({ ...prev, url }));
    // Clear selected BIM API if user manually edits URL
    if (selectedBimApi) {
      const selectedApi = config.bimApiList.find(api => api.name === selectedBimApi);
      if (selectedApi && url !== selectedApi.url) {
        setSelectedBimApi('');
      }
    }
  };

  const handleMethodChange = (method: HttpMethod['value']) => {
    setRequest(prev => ({ ...prev, method }));
    // Clear selected BIM API if user manually changes method
    if (selectedBimApi) {
      const selectedApi = config.bimApiList.find(api => api.name === selectedBimApi);
      if (selectedApi && method !== selectedApi.method) {
        setSelectedBimApi('');
      }
    }
  };

  const formatJson = (data: any): string => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Fun Meme Image */}
      <div className="flex justify-center">
        <img 
          src={itWorksMeme} 
          alt="It works on my machine meme" 
          className="max-w-md w-full h-auto rounded-lg shadow-lg"
        />
      </div>

      <div className="bg-gray-900 rounded-lg shadow p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">
          API Request
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* BIM API Dropdown */}
          <div>
            <label htmlFor="bimApi" className="block text-sm font-medium text-gray-300 mb-1">
              BIM API
            </label>
            <select
              id="bimApi"
              value={selectedBimApi}
              onChange={(e) => handleBimApiSelection(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Select a BIM API --</option>
              {config.bimApiList.map((api) => (
                <option key={api.name} value={api.name}>
                  {api.name} ({api.method})
                </option>
              ))}
            </select>
          </div>

          {/* URL and Method */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-1">
                URL
              </label>
              <input
                type="text"
                id="url"
                value={request.url}
                onChange={(e) => setRequest(prev => ({ ...prev, url: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="/api/endpoint"
              />
            </div>
            
            <div className="w-32">
              <label htmlFor="method" className="block text-sm font-medium text-gray-300 mb-1">
                Method
              </label>
              <select
                id="method"
                value={request.method}
                onChange={(e) => setRequest(prev => ({ ...prev, method: e.target.value as HttpMethod['value'] }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {httpMethods.map(method => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Request Body */}
          {request.method !== 'GET' && (
            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-300 mb-1">
                Request Body (JSON)
              </label>
              <textarea
                id="body"
                rows={8}
                value={request.body}
                onChange={(e) => updateRequestBody(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                placeholder='{\n  "key": "value"\n}'
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Request'}
          </button>
        </form>
      </div>

      {/* Response Section */}
      {(response || error) && (
        <div className="bg-gray-900 rounded-lg shadow p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">
            API Response
          </h2>
          
          {response && (
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  response.status >= 200 && response.status < 300
                    ? 'bg-green-900 text-green-300 border border-green-700'
                    : response.status >= 400
                    ? 'bg-red-900 text-red-300 border border-red-700'
                    : 'bg-yellow-900 text-yellow-300 border border-yellow-700'
                }`}>
                  {response.status} {response.statusText}
                </span>
                <span className="text-sm text-gray-400">
                  {response.duration}ms
                </span>
              </div>

              {/* Response Data */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Response Data
                </label>
                <pre className="w-full p-3 bg-[#0e0e0e] border border-gray-600 rounded-md overflow-auto max-h-96 text-sm font-mono text-green-400">
                  {formatJson(response.data)}
                </pre>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-900 border border-red-700 rounded-md">
              <p className="text-red-300">{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};