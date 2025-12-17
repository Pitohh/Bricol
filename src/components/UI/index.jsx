export function LoadingSpinner({ message }) {
  return <div className="text-center py-8"><div className="text-gray-600">{message}</div></div>;
}

export function StatusBadge({ status }) {
  const styles = {
    termine: 'bg-green-100 text-green-800',
    en_cours: 'bg-orange-100 text-orange-800',
    en_attente_boss: 'bg-yellow-100 text-yellow-800',
    a_faire: 'bg-gray-100 text-gray-800',
  };
  const labels = {
    termine: 'Terminé',
    en_cours: 'En cours',
    en_attente_boss: 'En attente',
    a_faire: 'À faire',
  };
  return <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>{labels[status]}</span>;
}

export function ProgressBar({ value }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div className="bg-bricol-green h-2 rounded-full transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}
