import { Briefcase, Code, Palette, TrendingUp, Cpu, Users } from 'lucide-react';

interface ProfessionSelectProps {
  onSelect: (profession: string) => void;
}

const professions = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    description: 'React, TypeScript, CSS',
    icon: Code,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    description: 'Node.js, Python, Databases',
    icon: Cpu,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'fullstack',
    title: 'Fullstack Developer',
    description: 'Full web development stack',
    icon: Briefcase,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'designer',
    title: 'UI/UX Designer',
    description: 'Figma, Design systems',
    icon: Palette,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'product',
    title: 'Product Manager',
    description: 'Strategy, Roadmaps, Analytics',
    icon: TrendingUp,
    color: 'from-indigo-500 to-blue-500'
  },
  {
    id: 'hr',
    title: 'HR Manager',
    description: 'Recruitment, Team building',
    icon: Users,
    color: 'from-pink-500 to-rose-500'
  }
];

export function ProfessionSelect({ onSelect }: ProfessionSelectProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl mb-4">
            Подготовка к собеседованию
          </h1>
          <p className="text-gray-600 text-xl">
            Выберите направление и начните тренировку с ИИ-интервьюером
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professions.map((profession) => {
            const Icon = profession.icon;
            return (
              <button
                key={profession.id}
                onClick={() => onSelect(profession.id)}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${profession.color} rounded-t-2xl`} />
                
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${profession.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl mb-2">
                  {profession.title}
                </h3>
                <p className="text-gray-600">
                  {profession.description}
                </p>

                <div className="mt-6 flex items-center text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
                  <span>Начать интервью</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-12 text-center text-gray-500">
          <p>💡 Совет: Отвечайте развернуто и структурированно для лучшей оценки</p>
        </div>
      </div>
    </div>
  );
}
