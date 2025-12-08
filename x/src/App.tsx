import { useState } from 'react';
import { ProfessionSelect } from './components/ProfessionSelect';
import { ChatInterface } from './components/ChatInterface';
import { FeedbackResults } from './components/FeedbackResults';

type Page = 'select' | 'chat' | 'results';

export interface Feedback {
  overall: string;
  score: number;
  strengths: string[];
  improvements: string[];
  questionsFeedback: Array<{
    question: string;
    answer: string;
    feedback: string;
    score: number;
  }>;
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('select');
  const [selectedProfession, setSelectedProfession] = useState<string>('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const handleProfessionSelect = (profession: string) => {
    setSelectedProfession(profession);
    setCurrentPage('chat');
  };

  const handleChatComplete = (feedbackData: Feedback) => {
    setFeedback(feedbackData);
    setCurrentPage('results');
  };

  const handleRestart = () => {
    setCurrentPage('select');
    setSelectedProfession('');
    setFeedback(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {currentPage === 'select' && (
        <ProfessionSelect onSelect={handleProfessionSelect} />
      )}
      {currentPage === 'chat' && (
        <ChatInterface 
          profession={selectedProfession} 
          onComplete={handleChatComplete}
        />
      )}
      {currentPage === 'results' && feedback && (
        <FeedbackResults 
          feedback={feedback} 
          profession={selectedProfession}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;
