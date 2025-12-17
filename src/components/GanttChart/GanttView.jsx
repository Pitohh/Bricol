import { useTasks } from '../../contexts/TaskContext';
import { LoadingSpinner } from '../UI';

export function GanttView() {
  const { tasks, isLoading } = useTasks();
  if (isLoading) return <LoadingSpinner message="Chargement..." />;

  const getColor = (status) => {
    const colors = { termine: 'bg-green-500', en_cours: 'bg-orange-500', en_attente_boss: 'bg-yellow-500', a_faire: 'bg-gray-300' };
    return colors[status] || 'bg-gray-300';
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">📊 Planning Gantt</h2>
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{task.phase_name}</span>
                <span>{task.progression}%</span>
              </div>
              <div className="h-8 bg-gray-100 rounded overflow-hidden">
                <div className={`h-full ${getColor(task.status)} flex items-center justify-center text-white text-xs font-medium`} style={{ width: `${task.progression}%` }}>
                  {task.progression > 10 && `${task.progression}%`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
