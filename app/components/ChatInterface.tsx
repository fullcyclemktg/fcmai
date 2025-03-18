'use client';

import { useState } from 'react';
import { MessageSquare, Search, FileText, MoreHorizontal, Mic, ExternalLink } from 'lucide-react';
import BusinessProfileBot from './BusinessProfileBot';

export default function ChatInterface() {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle submission
    setInputValue('');
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex-none p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium text-gray-800">AI Marketing Assistant</h2>
          <a href="#" className="text-indigo-600 text-sm font-medium flex items-center hover:text-indigo-800">
            View history
            <ExternalLink size={14} className="ml-1" />
          </a>
        </div>
        <p className="text-gray-500 text-sm">Get real-time strategy and execution guidance</p>
      </div>

      {/* Chat Area */}
      <div className="flex-grow overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          <BusinessProfileBot />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-none p-6 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about marketing strategy..."
              className="w-full p-4 pr-40 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 bg-white text-sm"
            />
            <div className="absolute right-3 flex items-center space-x-2">
              <button type="button" className="p-2 text-gray-500 hover:text-indigo-600 transition-colors">
                <Search size={18} />
              </button>
              
              <button type="button" className="p-2 text-gray-500 hover:text-indigo-600 transition-colors">
                <FileText size={18} />
              </button>

              <button type="button" className="p-2 text-gray-500 hover:text-indigo-600 transition-colors">
                <MoreHorizontal size={18} />
              </button>

              <button type="button" className="p-2 text-gray-500 hover:text-indigo-600 transition-colors">
                <Mic size={18} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 