import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { SubTaskList } from '../SubTasks/SubTaskList';

export function PhaseDetail({ phase }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-3 pt-3 border-t border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
        <span>Voir les sous-tâches</span>
      </button>

      {isExpanded && (
        <div className="mt-4 pl-4 animate-slide-in">
          <SubTaskList phase={phase} />
        </div>
      )}
    </div>
  );
}
