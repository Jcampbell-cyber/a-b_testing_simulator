import { BookOpen } from 'lucide-react';
import { ReactNode } from 'react';

interface InfoSectionProps {
  title: string;
  content: ReactNode;
}

export function InfoSection({ title, content }: InfoSectionProps) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      <div className="text-gray-300">
        {content}
      </div>
    </div>
  );
}
