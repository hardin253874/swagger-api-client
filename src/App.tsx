import React from 'react';
import './index.css';
import { ApiTestPage } from './pages/ApiTestPage';
import config from './config';

function App() {
  return (
    <div className="min-h-screen bg-[#0e0e0e]">
      <header className="bg-gray-900 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-white">
              Swagger API Client
            </h1>
            <div className="text-sm text-gray-400">
              <span className="text-green-400">✅ API: {config.apiHost}</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ApiTestPage />
      </main>
    </div>
  );
}

export default App;