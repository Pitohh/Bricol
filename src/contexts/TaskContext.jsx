import { createContext, useState, useContext, useEffect } from 'react';
import { phasesApi } from '../utils/api';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les tâches depuis l'API
  const loadTasks = async () => {
    try {
      const phases = await phasesApi.getAll();
      setTasks(phases);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Validation technique à 85%
  const validateTechnically = async (taskId, validatedBy) => {
    try {
      await phasesApi.validate(taskId);
      await loadTasks(); // Recharger
    } catch (error) {
      console.error('Error validating:', error);
      throw error;
    }
  };

  // Approbation finale à 100%
  const approveFinal = async (taskId, approvedBy) => {
    try {
      await phasesApi.approve(taskId);
      await loadTasks(); // Recharger
    } catch (error) {
      console.error('Error approving:', error);
      throw error;
    }
  };

  // Mettre à jour le budget d'une phase
  const updatePhaseBudget = async (taskId, estimated_cost) => {
    try {
      await phasesApi.updateBudget(taskId, estimated_cost);
      await loadTasks(); // Recharger
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  };

  // Gérer les likes/dislikes (garder local pour l'instant)
  const handleReaction = (taskId, reactionType, username) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const newTask = { ...task };
          const likes = task.likes || [];
          const dislikes = task.dislikes || [];

          if (reactionType === 'like') {
            newTask.likes = [...new Set([...likes, username])];
            newTask.dislikes = dislikes.filter(u => u !== username);
          } else if (reactionType === 'dislike') {
            newTask.dislikes = [...new Set([...dislikes, username])];
            newTask.likes = likes.filter(u => u !== username);
          }

          return newTask;
        }
        return task;
      })
    );
  };

  // Calculer la progression globale
  const calculateOverallProgress = () => {
    if (tasks.length === 0) return 0;
    const total = tasks.reduce((sum, task) => sum + (task.progression || 0), 0);
    return Math.round(total / tasks.length);
  };

  // Obtenir les statistiques
  const getStats = () => {
    const budgetTotal = tasks.reduce((sum, task) => sum + (task.estimated_cost || 0), 0);
    const budgetUtilise = tasks
      .filter(t => t.status === 'termine')
      .reduce((sum, task) => sum + (task.actual_cost || task.estimated_cost || 0), 0);

    return {
      progressionGlobale: calculateOverallProgress(),
      budgetTotal,
      budgetUtilise,
      budgetRestant: budgetTotal - budgetUtilise,
      tasksTerminees: tasks.filter(t => t.status === 'termine').length,
      tasksEnCours: tasks.filter(t => t.status === 'en_cours').length,
      tasksEnAttente: tasks.filter(t => t.status === 'en_attente_boss').length,
      tasksAFaire: tasks.filter(t => t.status === 'a_faire').length,
      totalTasks: tasks.length
    };
  };

  // Obtenir les tâches en attente de validation boss
  const getTasksWaitingBossApproval = () => {
    return tasks.filter(t => t.status === 'en_attente_boss');
  };

  const value = {
    tasks,
    isLoading,
    validateTechnically,
    approveFinal,
    updatePhaseBudget,
    handleReaction,
    calculateOverallProgress,
    getStats,
    getTasksWaitingBossApproval,
    refreshTasks: loadTasks
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}

export default TaskContext;
