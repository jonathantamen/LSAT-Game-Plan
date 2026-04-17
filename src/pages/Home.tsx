import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { GraduationCap, Users, ArrowRight, BookOpen, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export function Home() {
  const { user, profile, signIn, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;


  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full text-center space-y-8"
      >
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold tracking-wide uppercase">
            <BookOpen className="h-4 w-4" />
            <span>Master Your Learning</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
            The Ultimate <span className="text-blue-600">LSAT Study Guide</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A comprehensive, task-based approach to mastering the LSAT. Log in to track your progress and conquer every section.
          </p>
        </div>

        <div className="flex justify-center pt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/student')}
            className="flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all"
          >
            View Study Guide
            <ArrowRight className="h-6 w-6" />
          </motion.button>
        </div>

        <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-slate-200">
          <div className="flex gap-4">
            <div className="flex-shrink-0 bg-blue-50 p-2 rounded-lg h-fit">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Task-Based Learning</h4>
              <p className="text-sm text-slate-500">Break down complex subjects into manageable daily tasks.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 bg-blue-50 p-2 rounded-lg h-fit">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Real-Time Tracking</h4>
              <p className="text-sm text-slate-500">Tutors see progress as it happens, allowing for timely feedback.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 bg-blue-50 p-2 rounded-lg h-fit">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Custom Curriculum</h4>
              <p className="text-sm text-slate-500">Tailor every study plan to the unique needs of each student.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
