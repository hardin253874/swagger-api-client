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
  const [showRawJson, setShowRawJson] = useState(false);

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

  const updateRequestBody = (value: string) => {
    setRequest(prev => ({ ...prev, body: value }));
  };

  const formatJson = (data: any): string => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  const formatCleanedJson = (data: any): string => {
    try {
      // Create a deep copy of the data to avoid modifying the original
      const cleanedData = JSON.parse(JSON.stringify(data));
      
      // Clean up the data by extracting URLs from message strings
      if (cleanedData && typeof cleanedData === 'object') {
        Object.keys(cleanedData).forEach(key => {
          if (typeof cleanedData[key] === 'string') {
            const extractedUrl = extractUrlFromMessage(cleanedData[key]);
            if (extractedUrl && extractedUrl !== cleanedData[key]) {
              // Replace the message with just the clean URL
              cleanedData[key] = extractedUrl;
            }
          }
        });
      }
      
      return JSON.stringify(cleanedData, null, 2);
    } catch {
      return String(data);
    }
  };

  const extractDownloadLinks = (responseData: any) => {
    const links = [];
    
    if (responseData && typeof responseData === 'object') {
      // Extract GLB URL (remove message text and get just the URL)
      if (responseData.glbUrl) {
        const glbUrl = extractUrlFromMessage(responseData.glbUrl);
        if (glbUrl) {
          links.push({
            url: glbUrl,
            title: 'Download GLB',
            type: 'GLB',
            icon: '📦'
          });
        }
      }
      
      // Extract IFC URL (remove message text and get just the URL)
      if (responseData.ifcUrl) {
        const ifcUrl = extractUrlFromMessage(responseData.ifcUrl);
        if (ifcUrl) {
          links.push({
            url: ifcUrl,
            title: 'Download IFC',
            type: 'IFC',
            icon: '🏗️'
          });
        }
      }

      // Handle other common download URL patterns
      if (responseData.downloadUrl) {
        const downloadUrl = extractUrlFromMessage(responseData.downloadUrl);
        if (downloadUrl) {
          links.push({
            url: downloadUrl,
            title: 'Download File',
            type: 'FILE',
            icon: '📄'
          });
        }
      }

      if (responseData.modelUrl) {
        const modelUrl = extractUrlFromMessage(responseData.modelUrl);
        if (modelUrl) {
          links.push({
            url: modelUrl,
            title: 'Download Model',
            type: 'MODEL',
            icon: '🏢'
          });
        }
      }

      // Handle array of files
      if (responseData.files && Array.isArray(responseData.files)) {
        responseData.files.forEach((file: any, index: number) => {
          if (file.url) {
            const extractedUrl = extractUrlFromMessage(file.url);
            if (extractedUrl) {
              links.push({
                url: extractedUrl,
                title: file.name || `Download File ${index + 1}`,
                type: file.type || 'FILE',
                icon: '📎'
              });
            }
          }
        });
      }
    }
    
    return links;
  };

  const extractUrlFromMessage = (messageOrUrl: string): string | null => {
    if (!messageOrUrl || typeof messageOrUrl !== 'string') {
      return null;
    }

    // Check if it's already a clean URL (starts with http/https)
    if (messageOrUrl.startsWith('http://') || messageOrUrl.startsWith('https://')) {
      // If it contains message text, extract just the URL part
      const urlMatch = messageOrUrl.match(/(https?:\/\/[^\s]+)/);
      return urlMatch ? urlMatch[1] : messageOrUrl;
    }

    // Look for URLs in message text (e.g., "GLB saved successfully at https://...")
    const urlPattern = /(https?:\/\/[^\s]+)/;
    const match = messageOrUrl.match(urlPattern);
    
    return match ? match[1] : null;
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
              title="Select a predefined BIM API to auto-populate URL and Method"
            >
              <option value="">-- Select a BIM API --</option>
              {config.bimApiList.map((api) => (
                <option key={api.name} value={api.name}>
                  {api.name} ({api.method})
                </option>
              ))}
            </select>
            {selectedBimApi && (
              <div className="text-xs text-gray-400 mt-1">
                ✓ Selected: {selectedBimApi}
              </div>
            )}
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
                onChange={(e) => handleUrlChange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={config.apiHost}
              />
            </div>
            
            <div className="w-32">
              <label htmlFor="method" className="block text-sm font-medium text-gray-300 mb-1">
                Method
              </label>
              <select
                id="method"
                value={request.method}
                onChange={(e) => handleMethodChange(e.target.value as HttpMethod['value'])}
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
              {/* Status and Duration */}
              <div className="flex items-center justify-between">
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
                    ⏱️ {response.duration}ms
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>

              {/* Quick Download Links */}
              {(() => {
                const downloadLinks = extractDownloadLinks(response.data);
                if (downloadLinks.length > 0) {
                  return (
                    <div className="bg-blue-900 border border-blue-700 rounded-md p-4">
                      <h3 className="text-sm font-medium text-blue-300 mb-3 flex items-center gap-2">
                        📁 Quick Downloads
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {downloadLinks.map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors duration-200"
                          >
                            <span>{link.icon}</span>
                            {link.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Response Headers */}
              {Object.keys(response.headers).length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Response Headers
                  </label>
                  <div className="bg-gray-800 border border-gray-600 rounded-md p-3 max-h-32 overflow-auto">
                    {Object.entries(response.headers).map(([key, value]) => (
                      <div key={key} className="text-xs text-gray-400 mb-1">
                        <span className="text-blue-400">{key}:</span> {value}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Response Data - Clean Download Display */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-300">
                    Response Summary
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(formatCleanedJson(response.data))}
                      className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1 bg-gray-800 rounded border border-gray-600"
                      title="Copy raw JSON"
                    >
                      📋 Copy JSON
                    </button>
                    <button
                      onClick={() => setShowRawJson(!showRawJson)}
                      className="text-xs text-gray-400 hover:text-gray-300 px-2 py-1 bg-gray-800 rounded border border-gray-600"
                      title="Toggle raw JSON view"
                    >
                      {showRawJson ? '👁️ Hide JSON' : '🔍 Show JSON'}
                    </button>
                  </div>
                </div>
                
                {showRawJson ? (
                  <pre className="w-full p-4 bg-black border border-gray-600 rounded-md overflow-auto max-h-96 text-sm font-mono text-green-400 leading-relaxed">
                    {formatCleanedJson(response.data)}
                  </pre>
                ) : (
                  <div className="w-full p-4 bg-black border border-gray-600 rounded-md">
                    {(() => {
                      const downloadLinks = extractDownloadLinks(response.data);
                      
                      if (downloadLinks.length > 0) {
                        return (
                          <div className="space-y-3">
                            <div className="text-green-400 text-sm font-medium mb-3">
                              ✅ Files Generated Successfully
                            </div>
                            {downloadLinks.map((link, index) => (
                              <div key={index} className="bg-gray-800 rounded-md p-3 border border-gray-600">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <span className="text-lg">{link.icon}</span>
                                    <div>
                                      <div className="text-white font-medium">{link.type} File</div>
                                      <div className="text-xs text-gray-400">Ready for download</div>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <a
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors"
                                    >
                                      Download
                                    </a>
                                    <button
                                      onClick={() => navigator.clipboard.writeText(link.url)}
                                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
                                      title="Copy URL"
                                    >
                                      📋
                                    </button>
                                  </div>
                                </div>
                                <div className="mt-2 text-xs text-gray-500 font-mono break-all">
                                  {link.url}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      } else {
                        // No download links found, show summary of response
                        return (
                          <div className="space-y-2">
                            <div className="text-green-400 text-sm font-medium">
                              ✅ Request Completed Successfully
                            </div>
                            {Object.entries(response.data || {}).map(([key, value]) => (
                              <div key={key} className="flex items-start gap-3 py-2 border-b border-gray-700 last:border-b-0">
                                <span className="text-blue-400 text-sm font-medium min-w-0 flex-shrink-0 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                </span>
                                <span className="text-gray-300 text-sm break-all">
                                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                    })()}
                  </div>
                )}
              </div>

              {/* Response Size Info */}
              <div className="flex justify-between text-xs text-gray-500 border-t border-gray-700 pt-2">
                <span>
                  Response Size: {new Blob([formatCleanedJson(response.data)]).size} bytes
                </span>
                <span>
                  Type: {response.headers['content-type'] || 'JSON'}
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-900 border border-red-700 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-300 font-semibold">❌ Error</span>
                <span className="text-xs text-red-400">{new Date().toLocaleTimeString()}</span>
              </div>
              <p className="text-red-300">{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};