import { CheckCircle, Clock, AlertCircle, Circle } from 'lucide-react';

const STATUS_CONFIG = {
  termine: {
    label: 'Terminé',
    className: 'badge-termine',
    icon: CheckCircle
  },
  en_cours: {
    label: 'En cours',
    className: 'badge-en-cours',
    icon: Clock
  },
  en_attente_boss: {
    label: 'En attente Boss',
    className: 'badge-en-attente',
    icon: AlertCircle
  },
  a_faire: {
    label: 'À faire',
    className: 'badge-a-faire',
    icon: Circle
  },
  probleme: {
    label: 'Problème',
    className: 'badge-probleme',
    icon: AlertCircle
  }
};

export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.a_faire;
  const Icon = config.icon;

  return (
    <span className={config.className}>
      <Icon className="w-4 h-4 mr-1" />
      {config.label}
    </span>
  );
}
