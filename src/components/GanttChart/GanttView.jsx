import { useMemo } from 'react';
import { useTasks } from '../../contexts/TaskContext';

export function GanttView() {
  const { tasks } = useTasks();

  const ganttData = useMemo(() => {
    const startDates = tasks
      .filter(t => t.start_date)
      .map(t => new Date(t.start_date));
    
    const endDates = tasks
      .filter(t => t.end_date)
      .map(t => new Date(t.end_date));

    const minDate = startDates.length > 0 
      ? new Date(Math.min(...startDates))
      : new Date();
    
    const maxDate = endDates.length > 0
      ? new Date(Math.max(...endDates))
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 1;

    return { minDate, maxDate, totalDays };
  }, [tasks]);

  const getTaskPosition = (task) => {
    if (!task.start_date) return { left: 0, width: 0 };

    const startDate = new Date(task.start_date);
    const endDate = task.end_date ? new Date(task.end_date) : new Date();

    const daysSinceStart = Math.floor((startDate - ganttData.minDate) / (1000 * 60 * 60 * 24));
    const duration = Math.max(1, Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)));

    const left = (daysSinceStart / ganttData.totalDays) * 100;
    const width = (duration / ganttData.totalDays) * 100;

    return { left: `${left}%`, width: `${width}%` };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'termine': return 'bg-green-500';
      case 'en_cours': return 'bg-orange-500';
      case 'en_attente_boss': return 'bg-yellow-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold font-montserrat mb-6">
        📊 Planning de Gantt - Orphelinat
      </h3>

      {/* Timeline Header */}
      <div className="mb-4 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>{ganttData.minDate.toLocaleDateString('fr-FR')}</span>
          <span>Aujourd'hui</span>
          <span>{ganttData.maxDate.toLocaleDateString('fr-FR')}</span>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="space-y-3">
        {tasks.map(task => {
          const position = getTaskPosition(task);
          const statusColor = getStatusColor(task.status);

          return (
            <div key={task.id} className="relative">
              {/* Task Name */}
              <div className="flex items-center mb-1">
                <span className="text-sm font-medium w-48 truncate">
                  {task.phase_name}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {task.progression}%
                </span>
              </div>

              {/* Timeline Bar */}
              <div className="relative h-8 bg-gray-100 rounded">
                {task.start_date && (
                  <div
                    className={`absolute top-0 h-full ${statusColor} rounded flex items-center justify-center text-white text-xs font-medium transition-all`}
                    style={position}
                  >
                    {position.width !== '0%' && (
                      <span className="px-2">{task.progression}%</span>
                    )}
                  </div>
                )}

                {/* Current Date Indicator */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500"
                  style={{
                    left: `${((new Date() - ganttData.minDate) / (1000 * 60 * 60 * 24) / ganttData.totalDays) * 100}%`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <span>Terminé</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
          <span>En cours</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
          <span>En attente</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
          <span>À faire</span>
        </div>
        <div className="flex items-center ml-auto">
          <div className="w-0.5 h-4 bg-red-500 mr-2"></div>
          <span>Aujourd'hui</span>
        </div>
      </div>
    </div>
  );
}
