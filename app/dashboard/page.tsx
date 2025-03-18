'use client';

import { useState } from 'react';
import { 
  Users, 
  Mail, 
  TrendingUp,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart2,
  Settings
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const MetricCard = ({ title, value, change, icon }: { title: string; value: string; change: string; icon: React.ReactNode }) => {
  const isPositive = !change.includes('-');
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-3xl font-semibold mt-2 text-gray-800">{value}</p>
          <p className={`text-sm mt-1 flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {change}
            <span className="text-gray-400 ml-1">vs. previous period</span>
          </p>
        </div>
        <div className="p-3 bg-indigo-50 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, children, seeAllLink, className = "" }: { title: string; children: React.ReactNode; seeAllLink?: string; className?: string }) => (
  <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 ${className}`}>
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-medium text-gray-800">{title}</h3>
      {seeAllLink && (
        <a href={seeAllLink} className="text-indigo-600 text-sm font-medium flex items-center hover:text-indigo-800">
          See all
          <ExternalLink size={14} className="ml-1" />
        </a>
      )}
    </div>
    {children}
  </div>
);

const NextStepItem = ({ title, description, status }: { title: string; description: string; status: 'completed' | 'active' | 'pending' }) => {
  const statusIcons = {
    completed: <CheckCircle size={20} className="text-green-500" />,
    active: <Clock size={20} className="text-blue-500" />,
    pending: <AlertCircle size={20} className="text-gray-300" />
  };
  
  const statusClasses = {
    completed: "line-through text-gray-400",
    active: "text-gray-800",
    pending: "text-gray-500"
  };
  
  return (
    <div className="flex items-start p-3 hover:bg-gray-50 rounded-md -mx-3 transition-colors">
      <div className="mr-3 mt-0.5">
        {statusIcons[status]}
      </div>
      <div>
        <p className={`font-medium ${statusClasses[status]}`}>{title}</p>
        <p className="text-gray-500 text-sm mt-0.5">{description}</p>
      </div>
      {status === 'active' && (
        <button className="ml-auto bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700">
          Start
        </button>
      )}
    </div>
  );
};

const RecommendationItem = ({ title, description, impact }: { title: string; description: string; impact: 'High' | 'Medium' | 'Low' }) => {
  const impactColors = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-blue-100 text-blue-800"
  };
  
  return (
    <div className="p-3 hover:bg-gray-50 rounded-md -mx-3 transition-colors">
      <div className="flex items-center justify-between">
        <p className="font-medium text-gray-800">{title}</p>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${impactColors[impact]}`}>
          {impact} Impact
        </span>
      </div>
      <p className="text-gray-500 text-sm mt-1">{description}</p>
      <button className="mt-2 text-indigo-600 text-sm font-medium hover:text-indigo-800">
        View details
      </button>
    </div>
  );
};

const CampaignItem = ({ title, type, status, performance, progress }: { title: string; type: string; status: string; performance: string; progress: number }) => {
  const statusColors = {
    Active: "bg-green-100 text-green-800",
    Paused: "bg-yellow-100 text-yellow-800",
    Draft: "bg-gray-100 text-gray-800",
    Completed: "bg-blue-100 text-blue-800"
  };
  
  return (
    <div className="p-3 hover:bg-gray-50 rounded-md -mx-3 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <p className="font-medium text-gray-800">{title}</p>
            <span className={`ml-2 text-xs font-medium px-2 py-1 rounded-full ${statusColors[status as keyof typeof statusColors]}`}>
              {status}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-0.5">{type} • {performance}</p>
        </div>
        <div className="flex space-x-2">
          <button className="text-indigo-600 hover:text-indigo-800">
            <BarChart2 size={18} />
          </button>
          <button className="text-indigo-600 hover:text-indigo-800">
            <Settings size={18} />
          </button>
        </div>
      </div>
      <div className="mt-2">
        <div className="flex justify-between items-center mb-1">
          <p className="text-gray-500 text-xs">Progress</p>
          <p className="text-gray-500 text-xs">{progress}%</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ title, description, time }: { title: string; description: string; time: string }) => (
  <div className="border-l-2 border-indigo-500 pl-4 py-1">
    <p className="font-medium text-gray-800">{title}</p>
    <p className="text-gray-600 text-sm">{description}</p>
    <p className="text-gray-400 text-xs mt-1">{time}</p>
  </div>
);

const PlaybookItem = ({ title, description, progress, status }: { title: string; description: string; progress: number; status: string }) => (
  <div className="border border-gray-200 rounded-md p-4">
    <div className="flex justify-between items-start">
      <div>
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-gray-500 text-sm mt-1">{description}</p>
      </div>
      <span className="text-sm text-gray-500">{progress}%</span>
    </div>
    <div className="mt-3">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-indigo-600 h-2 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-gray-500 text-xs mt-1">{status}</p>
    </div>
    <div className="mt-3 flex justify-end">
      <button className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700">
        Continue
      </button>
    </div>
  </div>
);

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('30d');
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Time range:</span>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md text-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="12m">Last 12 months</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard 
            title="Active Leads" 
            value="127" 
            change="+12%" 
            icon={<Users className="text-blue-500" />} 
          />
          <MetricCard 
            title="Email Open Rate" 
            value="32.4%" 
            change="+5.7%" 
            icon={<Mail className="text-green-500" />} 
          />
          <MetricCard 
            title="Conversion Rate" 
            value="8.7%" 
            change="+2.1%" 
            icon={<TrendingUp className="text-purple-500" />} 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Next Steps" seeAllLink="/tasks">
            <div className="space-y-4">
              <NextStepItem 
                title="Complete your business profile" 
                description="Add your target audience and business goals" 
                status="completed" 
              />
              <NextStepItem 
                title="Create your first lead generation campaign" 
                description="Set up your first campaign to start generating leads" 
                status="active" 
              />
              <NextStepItem 
                title="Connect your email platform" 
                description="Connect your email platform to enable automation" 
                status="pending" 
              />
              <NextStepItem 
                title="Set up your first email sequence" 
                description="Create an automated email sequence for new leads" 
                status="pending" 
              />
            </div>
          </Card>
          
          <Card title="AI Recommendations" seeAllLink="/recommendations">
            <div className="space-y-4">
              <RecommendationItem 
                title="Optimize your LinkedIn lead generation" 
                description="We noticed your LinkedIn campaigns could perform better with these adjustments" 
                impact="High" 
              />
              <RecommendationItem 
                title="Improve email subject lines" 
                description="Your email open rates could increase with these subject line formulas" 
                impact="Medium" 
              />
              <RecommendationItem 
                title="Add social proof to landing pages" 
                description="Increase conversion rates by adding testimonials to your pages" 
                impact="High" 
              />
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="Active Campaigns" seeAllLink="/campaigns" className="lg:col-span-2">
            <div className="space-y-4">
              <CampaignItem 
                title="Q1 Lead Generation" 
                type="Lead Generation" 
                status="Active" 
                performance="+12% vs target" 
                progress={75} 
              />
              <CampaignItem 
                title="Newsletter Sequence" 
                type="Email Automation" 
                status="Active" 
                performance="+5% vs target" 
                progress={62} 
              />
              <CampaignItem 
                title="Product Launch Campaign" 
                type="Multi-channel" 
                status="Draft" 
                performance="Not started" 
                progress={0} 
              />
            </div>
          </Card>
          
          <Card title="Recent Activity" seeAllLink="/activity">
            <div className="space-y-4">
              <ActivityItem 
                title="Email campaign sent" 
                description="'Q1 Special Offer' was sent to 450 contacts" 
                time="2 hours ago" 
              />
              <ActivityItem 
                title="New leads added" 
                description="24 new leads were imported from LinkedIn" 
                time="Yesterday" 
              />
              <ActivityItem 
                title="Content created" 
                description="AI generated 5 new social media posts" 
                time="2 days ago" 
              />
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Card title="Marketing Playbook Progress" seeAllLink="/playbooks">
            <div className="space-y-6">
              <PlaybookItem 
                title="LinkedIn Lead Generation" 
                description="A step-by-step system for generating leads using LinkedIn" 
                progress={75} 
                status="On track" 
              />
              <PlaybookItem 
                title="Email Nurture Sequence" 
                description="Convert leads into customers with this email sequence" 
                progress={40} 
                status="In progress" 
              />
              <PlaybookItem 
                title="Referral Campaign" 
                description="Generate high-quality leads through customer referrals" 
                progress={10} 
                status="Just started" 
              />
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 