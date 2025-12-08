import { Bot, User } from 'lucide-react';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAI = message.type === 'ai';

  return (
    <div className={`flex gap-4 ${isAI ? '' : 'flex-row-reverse'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        isAI ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-green-500 to-emerald-600'
      }`}>
        {isAI ? (
          <Bot className="w-5 h-5 text-white" />
        ) : (
          <User className="w-5 h-5 text-white" />
        )}
      </div>

      <div className={`flex-1 ${isAI ? '' : 'flex justify-end'}`}>
        <div className={`inline-block max-w-3xl rounded-2xl px-6 py-4 ${
          isAI 
            ? 'bg-white shadow-md border border-gray-100' 
            : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
        }`}>
          <p className="whitespace-pre-wrap">{message.content}</p>
          <span className={`text-xs mt-2 block ${
            isAI ? 'text-gray-400' : 'text-blue-100'
          }`}>
            {message.timestamp.toLocaleTimeString('ru-RU', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
