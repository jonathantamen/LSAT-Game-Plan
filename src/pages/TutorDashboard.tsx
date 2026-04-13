import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { Task } from '../types';
import { Plus, Trash2, Edit2, GripVertical, BookOpen, Layout, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

export function TutorDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', category: '', linkUrl: '', linkText: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      setTasks(tasksData);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    try {
      if (editingTask) {
        await updateDoc(doc(db, 'tasks', editingTask.id), {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          linkUrl: formData.linkUrl,
          linkText: formData.linkText
        });
        toast.success('Task updated');
      } else {
        await addDoc(collection(db, 'tasks'), {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          linkUrl: formData.linkUrl,
          linkText: formData.linkText,
          order: tasks.length,
          createdAt: serverTimestamp(),
        });
        toast.success('Task added to guide');
      }
      setFormData({ title: '', description: '', category: '' });
      setIsAdding(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Failed to save task');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this task from the global guide?')) return;
    try {
      await deleteDoc(doc(db, 'tasks', id));
      toast.success('Task removed');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({ 
      title: task.title, 
      description: task.description || '', 
      category: task.category || '',
      linkUrl: task.linkUrl || '',
      linkText: task.linkText || ''
    });
    setIsAdding(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">LSAT Guide Manager</h2>
          <p className="text-slate-500 mt-1">Curate the master study plan for all students.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/student"
            className="bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <Eye className="h-5 w-5" />
            View as Student
          </Link>
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingTask(null);
              setFormData({ title: '', description: '', category: '', linkUrl: '', linkText: '' });
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Lesson
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Title</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Section / Category</label>
                  <input
                    type="text"
                    placeholder="e.g., Logical Reasoning"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Content / Reading Material</label>
                <textarea
                  placeholder="Add paragraphs of text for the student to read..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[150px]"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">External Link URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://lawhub.lsac.org/..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.linkUrl}
                    onChange={e => setFormData({ ...formData, linkUrl: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Link Button Text</label>
                  <input
                    type="text"
                    placeholder="e.g., Go to LawHub"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.linkText}
                    onChange={e => setFormData({ ...formData, linkText: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  {editingTask ? 'Update Lesson' : 'Add to Guide'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <Layout className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900">Your guide is empty</h3>
            <p className="text-slate-500 mt-2">Start adding lessons and tasks for your students.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4 group hover:border-blue-300 transition-all"
            >
              <div className="text-slate-300 cursor-move">
                <GripVertical className="h-5 w-5" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900">{task.title}</h4>
                  {task.category && (
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                      {task.category}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 line-clamp-1">{task.description}</p>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(task)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
