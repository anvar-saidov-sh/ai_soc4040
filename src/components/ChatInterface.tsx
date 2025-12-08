import { useState, useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import type { Feedback } from '../App';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  profession: string;
  onComplete: (feedback: Feedback) => void;
}

// Mock функция для получения вопросов от ИИ (замените на ваш API)
const fetchNextQuestion = async (profession: string, questionNumber: number): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const questions: Record<string, string[]> = {
    frontend: [
      'Расскажите о себе и своем опыте во frontend-разработке.',
      'Объясните разницу между var, let и const в JavaScript.',
      'Что такое Virtual DOM и как он работает в React?',
      'Как бы вы оптимизировали производительность React-приложения?',
      'Расскажите о CSS methodologies, которые вы использовали.',
      'Что такое замыкания в JavaScript?',
      'Как работает асинхронность в JavaScript?',
      'Расскажите о хуках в React и их применении.',
      'Что такое TypeScript и какие преимущества он дает?',
      'Как бы вы реализовали state management в большом приложении?'
    ],
    backend: [
      'Расскажите о своем опыте в backend-разработке.',
      'Объясните разницу между SQL и NoSQL базами данных.',
      'Что такое RESTful API и его принципы?',
      'Как обеспечить безопасность API?',
      'Расскажите о масштабировании backend-систем.',
      'Что такое индексы в базах данных?',
      'Как работает кэширование?',
      'Объясните паттерн MVC.',
      'Что такое микросервисная архитектура?',
      'Как бы вы оптимизировали запросы к базе данных?'
    ],
    default: [
      'Расскажите о себе и вашем опыте.',
      'Почему вы выбрали эту профессию?',
      'Какие ваши сильные стороны?',
      'Расскажите о сложном проекте, над которым работали.',
      'Как вы справляетесь со стрессом?',
      'Где вы видите себя через 5 лет?',
      'Расскажите о вашем самом большом профессиональном достижении.',
      'Как вы работаете в команде?',
      'Что мотивирует вас в работе?',
      'Какие у вас есть вопросы к нам?'
    ]
  };

  const professionQuestions = questions[profession] || questions.default;
  return professionQuestions[questionNumber % professionQuestions.length];
};

// Mock функция для отправки ответов и получения фидбека (замените на ваш API)
const submitAnswersForFeedback = async (messages: Message[]): Promise<Feedback> => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  const userMessages = messages.filter(m => m.type === 'user');
  const aiMessages = messages.filter(m => m.type === 'ai');

  return {
    overall: 'Вы показали хороший уровень подготовки! Ваши ответы были структурированными и демонстрировали понимание основных концепций. Рекомендую больше внимания уделить практическим примерам.',
    score: 75,
    strengths: [
      'Четкие и структурированные ответы',
      'Хорошее понимание теоретических концепций',
      'Уверенная манера изложения'
    ],
    improvements: [
      'Добавляйте больше конкретных примеров из практики',
      'Развивайте ответы более детально',
      'Используйте технические термины более точно'
    ],
    questionsFeedback: aiMessages.slice(1).map((aiMsg, idx) => ({
      question: aiMsg.content,
      answer: userMessages[idx]?.content || 'Нет ответа',
      feedback: idx % 2 === 0 
        ? 'Хороший ответ, демонстрирует понимание темы.' 
        : 'Ответ можно было бы дополнить практическими примерами.',
      score: 70 + Math.random() * 25
    }))
  };
};

export function ChatInterface({ profession, onComplete }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const maxQuestions = 10;

  useEffect(() => {
    // Приветственное сообщение
    const welcomeMessage: Message = {
      id: '0',
      type: 'ai',
      content: `Привет! Я буду вашим интервьюером. Я задам вам ${maxQuestions} вопросов по направлению "${profession}". Отвечайте подробно и честно. Готовы начать?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);

    // Первый вопрос
    setTimeout(() => {
      loadNextQuestion();
    }, 1500);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadNextQuestion = async () => {
    setIsLoading(true);
    const question = await fetchNextQuestion(profession, questionCount);
    
    const aiMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: question,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    setQuestionCount(prev => prev + 1);
    setIsLoading(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    if (questionCount >= maxQuestions) {
      // Завершение интервью
      setIsCompleting(true);
      const finalMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Спасибо за ваши ответы! Анализирую результаты...',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, finalMessage]);

      const allMessages = [...messages, userMessage];
      const feedback = await submitAnswersForFeedback(allMessages);
      onComplete(feedback);
    } else {
      // Следующий вопрос
      setTimeout(() => {
        loadNextQuestion();
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-xl">Интервью: {profession}</h2>
            <p className="text-sm text-gray-600">
              Вопрос {Math.min(questionCount, maxQuestions)} из {maxQuestions}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(questionCount / maxQuestions) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-600">
              {Math.round((questionCount / maxQuestions) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>ИИ думает...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      {!isCompleting && (
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto flex gap-4">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Введите ваш ответ..."
              className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              disabled={isLoading || isCompleting}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || isCompleting}
              className="bg-blue-600 text-white px-6 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
