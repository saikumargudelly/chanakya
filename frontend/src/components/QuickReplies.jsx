import React from 'react';

export default function QuickReplies({ replies, onReply }) {
  return (
    <div className="flex gap-2 mt-2">
      {replies.map((r, i) => (
        <button
          key={i}
          className="px-3 py-1 rounded-full bg-blue-200 hover:bg-blue-400 text-blue-900 font-medium shadow transition"
          onClick={() => onReply(r)}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
