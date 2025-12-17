import { createContext, useState, useContext, useEffect } from 'react';
import { phasesApi } from '../utils/api';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = async () => {
    try {
      const phases = await phasesApi.getAll();
      setTasks(phases);
    } catch (error) {
      console.error('Error:', error);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const validateTechnically = async (taskId) => {
    await phasesApi.validate(taskId);
    await loadTasks();
  };

  const approveFinal = async (taskId) => {
    await phasesApi.approve(taskId);
    await loadTasks();
  };

  return (
    <TaskContext.Provider value={{ tasks, isLoading, validateTechnically, approveFinal, refreshTasks: loadTasks }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);
