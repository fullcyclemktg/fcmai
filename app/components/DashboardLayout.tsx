'use client';

import { useState } from 'react';
import { 
  Bell, 
  MessageSquare, 
  Settings, 
  Users, 
  BarChart2, 
  Award, 
  Zap, 
  Coffee, 
  Layout, 
  Mail, 
  FileText, 
  Search,
  LayoutDashboard,
  Building2
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const SidebarItem = ({ icon, label, active, href }: { icon: React.ReactNode; label: string; active: boolean; href: string }) => (
  <Link 
    href={href}
    className={`flex items-center space-x-3 px-4 py-3 cursor-pointer transition-colors ${
      active ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </Link>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || '/dashboard';
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const getActiveTab = (path: string) => {
    if (path === '/dashboard') return 'dashboard';
    if (path.startsWith('/dashboard/leads')) return 'leads';
    if (path.startsWith('/dashboard/content')) return 'content';
    if (path.startsWith('/dashboard/email')) return 'email';
    if (path.startsWith('/dashboard/playbooks')) return 'playbooks';
    if (path.startsWith('/dashboard/analytics')) return 'analytics';
    if (path.startsWith('/dashboard/assistant')) return 'assistant';
    if (path.startsWith('/dashboard/resources')) return 'resources';
    if (path.startsWith('/dashboard/settings')) return 'settings';
    return 'dashboard';
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-800 text-white">
        <div className="p-4 flex items-center space-x-2">
          <Zap size={24} className="text-white" />
          <span className="text-xl font-bold">Full Cycle</span>
        </div>
        
        <div className="mt-8">
          <SidebarItem
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Dashboard"
            href="/dashboard"
            active={pathname === '/dashboard'}
          />
          <SidebarItem
            icon={<Building2 className="w-5 h-5" />}
            label="My Company"
            href="/dashboard/company"
            active={pathname === '/dashboard/company'}
          />
          <SidebarItem
            icon={<Users className="w-5 h-5" />}
            label="Lead Generation"
            href="/dashboard/leads"
            active={pathname === '/dashboard/leads'}
          />
          <SidebarItem icon={<FileText />} label="Content Creation" active={getActiveTab(pathname) === 'content'} href="/dashboard/content" />
          <SidebarItem icon={<Mail />} label="Email Automation" active={getActiveTab(pathname) === 'email'} href="/dashboard/email" />
          <SidebarItem icon={<Award />} label="Marketing Playbooks" active={getActiveTab(pathname) === 'playbooks'} href="/dashboard/playbooks" />
          <SidebarItem icon={<BarChart2 />} label="Analytics" active={getActiveTab(pathname) === 'analytics'} href="/dashboard/analytics" />
          <SidebarItem icon={<MessageSquare />} label="AI Assistant" active={getActiveTab(pathname) === 'assistant'} href="/dashboard/assistant" />
          
          <div className="mt-8 border-t border-indigo-700 pt-4">
            <SidebarItem icon={<Coffee />} label="Resources" active={getActiveTab(pathname) === 'resources'} href="/dashboard/resources" />
            <SidebarItem icon={<Settings />} label="Settings" active={getActiveTab(pathname) === 'settings'} href="/dashboard/settings" />
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Top Navigation */}
        <div className="bg-white p-4 shadow-sm border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">Welcome back!</h1>
            <div className="ml-4 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Pro Plan
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              U
            </div>
          </div>
        </div>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
      
      {/* AI Assistant Floating Button */}
      <div className="fixed bottom-6 right-6">
        <Link href="/dashboard/assistant">
          <button className="h-14 w-14 bg-indigo-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-indigo-700 transition-colors">
            <MessageSquare size={24} />
          </button>
        </Link>
      </div>
    </div>
  );
} 