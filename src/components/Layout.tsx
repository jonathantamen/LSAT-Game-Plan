import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-black flex flex-col">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">Jonathan's LSAT Study Plan</span>
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link to="/about" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
                  About Me
                </Link>
                <Link to="/student" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
                  Study Plan
                </Link>
                <Link to="/manage-plan" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
                  Admin Login
                </Link>
              </nav>
            </div>

          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {children}
      </main>

      <footer className="py-6 text-center text-sm text-slate-500 border-t border-slate-100">
        <p>Copyright © 2026 by Jonathan Tamen </p>
      </footer>
    </div>
  );
}
