import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { Task } from '../types';
import { CheckCircle2, Circle, BookOpen, Trophy, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';

export function StudentDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Listen to global tasks
    const tasksQuery = query(collection(db, 'tasks'), orderBy('order', 'asc'));
    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      setTasks(tasksData);
    });

    // Listen to user's personal progress
    const progressRef = collection(db, 'users', user.uid, 'progress');
    const unsubscribeProgress = onSnapshot(progressRef, (snapshot) => {
      const completedIds = new Set(snapshot.docs.map(doc => doc.id));
      setCompletedTaskIds(completedIds);
      setLoading(false);
    });

    return () => {
      unsubscribeTasks();
      unsubscribeProgress();
    };
  }, [user]);

  const toggleTask = async (taskId: string) => {
    if (!user) return;
    const isCompleted = completedTaskIds.has(taskId);
    const progressDocRef = doc(db, 'users', user.uid, 'progress', taskId);

    try {
      if (isCompleted) {
        await deleteDoc(progressDocRef);
        toast.success('Task marked as incomplete');
      } else {
        await setDoc(progressDocRef, {
          userId: user.uid,
          taskId: taskId,
          completedAt: serverTimestamp(),
        });
        toast.success('Task completed! Keep it up!');
      }
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Failed to update progress');
    }
  };

  const progress = tasks.length > 0 ? Math.round((completedTaskIds.size / tasks.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">LSAT Study Guide</h2>
            <p className="text-slate-500 font-medium">Master the LSAT one step at a time.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Your Progress</div>
              <div className="text-4xl font-black text-blue-600">{progress}%</div>
            </div>
            <div className="w-32 h-3 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-blue-600"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-xl">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Total Lessons</div>
            <div className="text-xl font-bold text-slate-900">{tasks.length}</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
          <div className="bg-green-50 p-2 rounded-xl">
            <Trophy className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Completed</div>
            <div className="text-xl font-bold text-slate-900">{completedTaskIds.size}</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
          <div className="bg-orange-50 p-2 rounded-xl">
            <Clock className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Remaining</div>
            <div className="text-xl font-bold text-slate-900">{tasks.length - completedTaskIds.size}</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900">No lessons available yet</h3>
            <p className="text-slate-500 mt-2">Check back soon for study materials.</p>
          </div>
        ) : (
          tasks.map((task, index) => {
            const isCompleted = completedTaskIds.has(task.id);
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={cn(
                  "group bg-white p-5 rounded-2xl border transition-all flex items-start gap-4",
                  isCompleted ? "border-green-100 bg-green-50/30" : "border-slate-200 hover:border-blue-300 hover:shadow-md"
                )}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className="mt-1 flex-shrink-0 transition-all hover:scale-110"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500 fill-green-50" />
                  ) : (
                    <Circle className="h-6 w-6 text-slate-300 group-hover:text-blue-400" />
                  )}
                </button>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={cn(
                      "text-lg font-bold transition-all",
                      isCompleted ? "text-slate-400 line-through" : "text-slate-900"
                    )}>
                      {task.title}
                    </h4>
                    {task.category && (
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                        isCompleted ? "bg-slate-100 text-slate-400" : "bg-blue-50 text-blue-600"
                      )}>
                        {task.category}
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className={cn(
                      "text-sm mt-1 leading-relaxed",
                      isCompleted ? "text-slate-300" : "text-slate-500"
                    )}>
                      {task.description}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
