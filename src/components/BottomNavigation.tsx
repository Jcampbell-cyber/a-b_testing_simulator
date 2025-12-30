import { Home, TrendingUp, Eye, Shield, GitMerge, Scale, Clock, MessageSquare } from 'lucide-react';

interface BottomNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function BottomNavigation({ currentPage, onNavigate }: BottomNavigationProps) {
  if (currentPage === 'landing') {
    return null;
  }

  const navItems = [
    { id: 'landing', icon: Home, label: 'Home' },
    { id: 'nhst', icon: TrendingUp, label: 'NHST' },
    { id: 'peeking', icon: Eye, label: 'Peeking' },
    { id: 'guardrails', icon: Shield, label: 'Guards' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-40 pb-safe">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive
                  ? 'text-[#0017D2] bg-gray-700/50'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
