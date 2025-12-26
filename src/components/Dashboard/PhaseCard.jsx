import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { PhaseDetail } from './PhaseDetail';

export function PhaseCard({ phase }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'termine': return 'bg-green-100 text-green-800 border-green-200';
      case 'en_cours': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'en_attente_boss': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'termine': return <CheckCircle className="w-4 h-4" />;
      case 'en_cours': return <Clock className="w-4 h-4" />;
      case 'en_attente_boss': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'termine': return 'Terminée';
      case 'en_cours': return 'En cours';
      case 'en_attente_boss': return 'En attente validation';
      case 'a_faire': return 'À faire';
      default: return status;
    }
  };

  const getProgressColor = (progression) => {
    if (progression >= 100) return 'bg-green-600';
    if (progression >= 70) return 'bg-orange-500';
    if (progression >= 40) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {phase.phase_name}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(phase.status)}`}>
                {getStatusIcon(phase.status)}
                <span>{getStatusLabel(phase.status)}</span>
              </span>
            </div>
            
            {phase.description && (
              <p className="text-sm text-gray-600 mb-3">
                {phase.description}
              </p>
            )}

            {/* Progression Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progression</span>
                <span className="font-semibold text-gray-900">{phase.progression}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(phase.progression)}`}
                  style={{ width: `${phase.progression}%` }}
                />
              </div>
            </div>

            {/* Budget Info */}
            <div className="mt-3 flex items-center space-x-4 text-sm">
              <div>
                <span className="text-gray-600">Budget prévu : </span>
                <span className="font-semibold text-gray-900">
                  {(phase.estimated_cost || 0).toLocaleString('fr-FR')} XOF
                </span>
              </div>
              {phase.actual_cost > 0 && (
                <div>
                  <span className="text-gray-600">Dépensé : </span>
                  <span className="font-semibold text-gray-900">
                    {phase.actual_cost.toLocaleString('fr-FR')} XOF
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Expand Icon */}
          <div className="ml-4">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50">
          <PhaseDetail phase={phase} />
        </div>
      )}
    </div>
  );
}
