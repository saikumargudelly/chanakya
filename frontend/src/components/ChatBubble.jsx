import React from 'react';

export default function ChatBubble({ sender, text, pillar, isTyping }) {
  const isAI = sender === 'ai';
  const pillarIcons = {
    'Positive Emotion': '😊',
    'Engagement': '🧠',
    'Relationships': '❤️',
    'Meaning': '🌟',
    'Accomplishment': '🏆',
  };
  return (
    <div className={`flex items-end gap-2 my-2 ${isAI ? 'justify-start' : 'justify-end'}`}>
      {isAI && (
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center shadow-lg animate-pulse">
            🤖
          </div>
          {pillar && <span className="text-xs mt-1">{pillarIcons[pillar]}</span>}
        </div>
      )}
      <div className={`rounded-2xl px-4 py-2 shadow-md max-w-[70%] ${isAI
        ? 'bg-gradient-to-br from-blue-100 to-blue-300 text-blue-900'
        : 'bg-gradient-to-br from-green-200 to-green-400 text-green-900'}`}>
        {isTyping ? <span className="animate-pulse">...</span> : text}
      </div>
    </div>
  );
}
