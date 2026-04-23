import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, ArrowRight, BookOpen, CheckCircle2, Clock, Target, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export function Home() {
  const navigate = useNavigate();
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
            Jonathan's <span className="text-blue-600">LSAT Study Plan</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            My personal, task-based approach to mastering the LSAT. Follow along to track your progress and conquer every section.
          </p>
        </div>

        <div className="flex justify-center pt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/student')}
            className="flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all"
          >
            View Study Plan
            <ArrowRight className="h-6 w-6" />
          </motion.button>
        </div>

        <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-slate-200">
          <div className="flex gap-4">
            <div className="flex-shrink-0 bg-blue-50 p-2 rounded-lg h-fit">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">My Mission</h4>
              <p className="text-sm text-slate-500">To empower students by teaching them how to study for the LSAT efficiently, by focusing on logical skills to maximize score growth while minimizing wasted effort.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 bg-blue-50 p-2 rounded-lg h-fit">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">The Approach</h4>
              <p className="text-sm text-slate-500">I want you to focus on high-level logic and a problem-solving framework that works across all question types and sections.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 bg-blue-50 p-2 rounded-lg h-fit">
              <Award className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Your Success</h4>
              <p className="text-sm text-slate-500">I want to help you reach <i>mastery</i> of the LSAT as <i>efficiently</i> as possible.</p>
            </div>
          </div>
        </div>

        <div className="pt-16 w-full text-left">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 md:p-12 w-full">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-8 text-center">How can I help?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-blue-50 rounded-xl p-8 border border-blue-100 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-slate-900 mb-4 whitespace-nowrap">1. Regular Tutoring</h3>
                <p className="text-slate-600 mb-6">If you would like to schedule a regular tutoring session with me, please use this link to schedule time in my Google calendar.</p>
                <a href="https://calendar.app.google/pWNGSULiryw7kTiG8" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 font-bold hover:text-blue-700">
                  Schedule a Session <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
              <div className="bg-indigo-50 rounded-xl p-8 border border-indigo-100 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-slate-900 mb-4 whitespace-nowrap">2. Study Advice</h3>
                <p className="text-slate-600 mb-6">If you would like to read more about my LSAT study experience and the advice I would give to future test takers, please follow here to view my 10-Step LSAT method and more.</p>
                <Link to="/student" className="inline-flex items-center text-indigo-600 font-bold hover:text-indigo-700">
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
