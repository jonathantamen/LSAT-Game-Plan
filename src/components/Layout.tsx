import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { LogOut, BookOpen, User as UserIcon, FileText } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, profile, logout, signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

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
                <span className="text-xl font-bold tracking-tight text-slate-900">LSAT Master</span>
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link to="/about" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
                  About
                </Link>
              </nav>
            </div>
            
            {user ? (
              <div className="flex items-center gap-4">
                {profile?.role === 'admin' && (
                  <Link 
                    to="/tutor" 
                    className="text-sm font-bold text-blue-600 hover:text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-50 transition-all"
                  >
                    Admin Panel
                  </Link>
                )}
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-sm font-medium text-slate-600">
                  <UserIcon className="h-4 w-4" />
                  <span>{profile?.role === 'admin' ? 'Tutor' : 'Student'}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={async () => {
                    try {
                      await signIn();
                      navigate('/student');
                    } catch (error) {
                      console.error('Sign in failed:', error);
                    }
                  }}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Log In
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {children}
      </main>

      <footer className="py-6 text-center text-sm text-slate-500 border-t border-slate-100">
        <p>© by Jonathan Tamen</p>
      </footer>
    </div>
  );
}
