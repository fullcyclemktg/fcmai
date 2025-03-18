'use client';

import ChatInterface from './ChatInterface';

export default function AIChatbot() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">AI Marketing Assistant</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition-colors flex items-center">
          Start New Chat
        </button>
      </div>

      <div className="h-[calc(100vh-16rem)]">
        <ChatInterface />
      </div>
    </div>
  );
} 