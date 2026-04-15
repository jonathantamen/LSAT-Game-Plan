import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, onSnapshot, orderBy, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { Task } from '../types';
import { CheckCircle2, Circle, BookOpen, Trophy, Clock, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function StudentDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    // Listen to global tasks
    const tasksQuery = query(collection(db, 'tasks'), orderBy('order', 'asc'));
    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      setTasks(tasksData);
      if (!user) setLoading(false);
    });

    let unsubscribeProgress: () => void;
    if (user) {
      // Listen to user's personal progress
      const progressRef = collection(db, 'users', user.uid, 'progress');
      unsubscribeProgress = onSnapshot(progressRef, (snapshot) => {
        const completedIds = new Set(snapshot.docs.map(doc => doc.id));
        setCompletedTaskIds(completedIds);
        setLoading(false);
      });
    } else {
      setCompletedTaskIds(new Set());
    }

    return () => {
      unsubscribeTasks();
      if (unsubscribeProgress) unsubscribeProgress();
    };
  }, [user]);

  const toggleTask = async (taskId: string) => {
    if (!user) {
      toast.error('Log in to save your progress!');
      return;
    }
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

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(tasks.map(t => t.category || 'Uncategorized'))).filter(Boolean)];
  }, [tasks]);
  
  const filteredTasks = useMemo(() => {
    return selectedCategory === 'All'
      ? tasks
      : tasks.filter(t => (t.category || 'Uncategorized') === selectedCategory);
  }, [tasks, selectedCategory]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
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

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar / Vertical Tabs */}
        <div className="w-full md:w-48 flex-shrink-0 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-3">Sections</div>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between",
                selectedCategory === category 
                  ? "bg-slate-100 text-black" 
                  : "bg-white text-slate-500 hover:bg-slate-50 hover:text-black"
              )}
            >
              <span className="truncate">{category}</span>
              {category !== 'All' && (
                <span className={cn(
                  "text-[10px] py-0.5 px-2 rounded-full",
                  selectedCategory === category ? "bg-slate-200 text-black" : "bg-slate-100 text-slate-400"
                )}>
                  {tasks.filter(t => (t.category || 'Uncategorized') === category).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-grow space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900">No lessons in this section</h3>
              <p className="text-slate-500 mt-2">Check back soon for study materials.</p>
            </div>
          ) : (
            filteredTasks.map((task, index) => {
              const isCompleted = completedTaskIds.has(task.id);
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={cn(
                    "group bg-white p-5 rounded-2xl border transition-all",
                    isCompleted ? "border-green-100 bg-green-50/10" : "border-slate-200 hover:border-blue-300 hover:shadow-sm"
                  )}
                >
                  <div className="flex flex-col space-y-4">
                    <div>
                      <h4 className={cn(
                        "text-xl font-bold transition-all",
                        isCompleted ? "text-slate-400" : "text-black"
                      )}>
                        {task.title}
                      </h4>
                      {selectedCategory === 'All' && task.category && (
                        <span className={cn(
                          "inline-block mt-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                          isCompleted ? "bg-slate-100 text-slate-400" : "bg-blue-50 text-blue-600"
                        )}>
                          {task.category}
                        </span>
                      )}
                    </div>
                    
                    {task.description && (
                      <div className={cn(
                        "prose prose-slate prose-blue max-w-none prose-p:leading-relaxed",
                        isCompleted ? "opacity-60" : ""
                      )}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {task.description}
                        </ReactMarkdown>
                      </div>
                    )}

                    {task.linkUrl && (
                      <div className="pt-2">
                        <a 
                          href={task.linkUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={cn(
                            "inline-flex items-center gap-2 px-5 py-2.5 text-sm rounded-lg font-semibold transition-all",
                            isCompleted 
                              ? "bg-slate-100 text-slate-500 hover:bg-slate-200" 
                              : "bg-slate-900 text-white hover:bg-blue-600 hover:shadow-sm"
                          )}
                        >
                          {task.linkText || 'Open Link'}
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    )}

                    <div className="pt-4 mt-2 border-t border-slate-100 flex items-center gap-3">
                      <button
                        onClick={() => toggleTask(task.id)}
                        aria-label={isCompleted ? "Mark lesson as incomplete" : "Mark lesson as complete"}
                        title={isCompleted ? "Mark lesson as incomplete" : "Mark lesson as complete"}
                        className="flex-shrink-0 transition-all hover:scale-110 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-blue-500 rounded-full"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-7 w-7 text-green-500 fill-green-50" />
                        ) : (
                          <Circle className="h-7 w-7 text-slate-300 group-hover:text-blue-400" />
                        )}
                      </button>
                      <span className="text-sm font-medium text-slate-500">
                        {isCompleted ? "Completed" : "Mark as complete"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
