import React from 'react';
import { recentActivitiesData } from '../../data/adminDashboardData';
import {
  UserCheck,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  UploadCloud,
  History,
} from 'lucide-react';

const iconMap = {
  UserCheck,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  UploadCloud,
};

/**
 * RecentActivityFeed Component
 * Displays simulated system events clearly labeled as demonstration activity.
 */
const RecentActivityFeed = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-blue-700" />
          <h2 className="text-sm font-bold text-[#102D52]">
            Recent System Activity
          </h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 font-bold">
          SIMULATED STREAM
        </span>
      </div>

      <div className="space-y-4">
        {recentActivitiesData.map((act) => {
          const Icon = iconMap[act.iconName] || History;

          return (
            <div key={act.id} className="flex items-start space-x-3 text-xs">
              <div className="p-2 rounded-lg bg-blue-50 text-[#102D52] shrink-0 mt-0.5 border border-blue-100">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-slate-800 truncate">
                    {act.title}
                  </span>
                  <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                    {act.timestamp}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                  {act.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 text-center">
        Simulated activity feed for Smart India Hackathon prototype demonstration.
      </div>
    </div>
  );
};

export default RecentActivityFeed;
