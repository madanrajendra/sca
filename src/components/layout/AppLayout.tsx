import React from 'react';
import { Outlet } from 'react-router-dom';
import { RoleSwitcherBar } from './RoleSwitcherBar';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Interactive Demo Switcher Header */}
      <RoleSwitcherBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Responsive Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Topbar />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
