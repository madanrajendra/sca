import React from 'react';
import { Outlet } from 'react-router-dom';
import { RoleSwitcherBar } from './RoleSwitcherBar';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen bg-[#050505] flex flex-col font-sans text-neutral-100 selection:bg-[#e50914] selection:text-white">
      {/* Role Switcher Bar */}
      <RoleSwitcherBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Responsive Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Topbar />

          <main className="flex-1 max-w-7xl w-full mx-auto">
            {children ? children : <Outlet />}
          </main>
        </div>
      </div>
    </div>
  );
};
