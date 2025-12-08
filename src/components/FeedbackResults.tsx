import { CheckCircle, XCircle, TrendingUp, Award, RotateCcw, Download } from 'lucide-react';
import type { Feedback } from '../App';

interface FeedbackResultsProps {
  feedback: Feedback;
  profession: string;
  onRestart: () => void;
}

export function FeedbackResults({ feedback, profession, onRestart }: FeedbackResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl mb-4">
            Результаты интервью
          </h1>
          <p className="text-xl text-gray-600">
            {profession}
          </p>
        </div>

        {/* Overall Score */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl">Общая оценка</h2>
            <div className={`text-5xl ${getScoreColor(feedback.score)}`}>
              {Math.round(feedback.score)}%
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div 
              className={`h-4 rounded-full bg-gradient-to-r ${getScoreGradient(feedback.score)} transition-all duration-1000`}
              style={{ width: `${feedback.score}%` }}
            />
          </div>

          <p className="text-gray-700 leading-relaxed">
            {feedback.overall}
          </p>
        </div>

        {/* Strengths and Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl">Сильные стороны</h3>
            </div>
            <ul className="space-y-3">
              {feedback.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl">Точки роста</h3>
            </div>
            <ul className="space-y-3">
              {feedback.improvements.map((improvement, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl mb-6">Детальный разбор ответов</h3>
          <div className="space-y-6">
            {feedback.questionsFeedback.map((item, idx) => (
              <div key={idx} className="border-l-4 border-blue-500 pl-6 py-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-gray-900 pr-4">
                    Вопрос {idx + 1}: {item.question}
                  </h4>
                  <span className={`text-lg ${getScoreColor(item.score)} flex-shrink-0`}>
                    {Math.round(item.score)}%
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  <p className="text-sm text-gray-600 mb-1">Ваш ответ:</p>
                  <p className="text-gray-800">{item.answer}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 mb-1">Фидбек:</p>
                  <p className="text-gray-800">{item.feedback}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Пройти еще раз
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-gray-400 transition-all"
          >
            <Download className="w-5 h-5" />
            Сохранить результаты
          </button>
        </div>
      </div>
    </div>
  );
}
