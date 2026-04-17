import React from 'react';
import { BookOpen, User, Target, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function About() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 fade-in">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full mb-6">
          <User className="h-10 w-10 text-blue-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          About the Creator
        </h1>
        <p className="mt-4 text-xl text-slate-500 max-w-2xl mx-auto">
          Meet Jonathan Tamen, creator of the high-efficiency LSAT Master method.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 mb-12 transform transition-all hover:shadow-2xl">
        <div className="md:flex items-center gap-4">
          <div className="md:flex-shrink-0 md:w-80 p-8">
            <img 
              src="/profile.jpg" 
              alt="Jonathan Tamen" 
              className="rounded-2xl shadow-lg w-full h-auto object-cover aspect-square border-4 border-slate-50"
            />
          </div>
          <div className="p-8 md:py-12 md:pr-12 flex flex-col justify-center">
            <div className="uppercase tracking-wide text-sm text-blue-600 font-bold mb-2">
              Founder & Creator
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Jonathan Tamen</h2>
            <p className="text-slate-600 leading-relaxed mb-6 text-lg">
              After my first month of intensive studying, I scored in the 15th percentile. This means for that LSAT practice test, 85% of all test-takers performed better than me. On my official test, one year later, I scored in the 95th percentile.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6 text-lg">
              In approximately 13 months of studying, I made perhaps one of the greatest jumps in LSAT scores, and <strong>anyone can achieve similar growth with proper studying.</strong> I created this tutoring platform because I wanted to share my experience and hopefully help the next person (since I am already going to law school, you are no longer my competition and I will happily help you).
            </p>
            <p className="text-slate-600 leading-relaxed mb-6 text-lg">
              I spent a great deal of time using different study platforms, books, and strategies during my 13 months of studying. Now, that doesn’t mean I was studying intensely for all 13 months, but it does mean I have learned the LSAT approach of many different instructors and sources. Do not make this same mistake.
            </p>
            <p className="text-slate-600 leading-relaxed text-lg">
              Stick to as simple as possible of a study plan, like the one I explain in this site. With my 10-Step LSAT Studying, I made the greatest improvements, beyond any help from the diverse instructor sources I used in between.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-slate-50 rounded-xl p-8 border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
            <Target className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">My Mission</h3>
          <p className="text-slate-500 leading-relaxed">To empower students by teaching them how to study efficiently, focusing on high-impact logic strategies that maximize score growth while minimizing wasted effort.</p>
        </div>
        
        <div className="bg-slate-50 rounded-xl p-8 border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
            <BookOpen className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">The Approach</h3>
          <p className="text-slate-500 leading-relaxed">Focus on high-yield logical patterns and efficient problem-solving frameworks that build true mastery without the burnout.</p>
        </div>
        
        <div className="bg-slate-50 rounded-xl p-8 border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
            <Award className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Your Success</h3>
          <p className="text-slate-500 leading-relaxed">I measure success by your score growth and time saved. Every tool here is optimized to help you master the LSAT efficiently.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 mb-16 p-8 md:p-12">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-8 text-center">How can I help?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-blue-50 rounded-xl p-8 border border-blue-100 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-slate-900 mb-4 whitespace-nowrap">1. Regular Tutoring</h3>
            <p className="text-slate-600 mb-6">If you would like to schedule a regular tutoring session with me, please use this link.</p>
            <a href="https://calendar.app.google/pWNGSULiryw7kTiG8" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 font-bold hover:text-blue-700">
              Schedule a Session <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
          <div className="bg-indigo-50 rounded-xl p-8 border border-indigo-100 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-slate-900 mb-4 whitespace-nowrap">2. Study Advice</h3>
            <p className="text-slate-600 mb-6">If you would like to read more about my LSAT study experience and the advice I would give to future test takers, please follow here.</p>
            <Link to="/student" className="inline-flex items-center text-indigo-600 font-bold hover:text-indigo-700">
              Read More <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center bg-blue-50 rounded-3xl p-12 border border-blue-100">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Ready to start your journey?</h3>
        <Link to="/" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all hover:scale-105 shadow-lg hover:shadow-blue-200">
          Return to Dashboard
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
