import React from 'react';
import { 
  Bell, 
  Sparkles, 
  RefreshCw, 
  ChevronRight,
  Menu,
  Briefcase,
  History
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  selectedJobTitle?: string;
  onRefreshMock?: () => void;
  onOpenImSimulation?: () => void;
  onToggleSidebar?: () => void;
  onSelectTab?: (tab: 'jobs' | 'history') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  selectedJobTitle,
  onRefreshMock,
  onOpenImSimulation,
  onToggleSidebar,
  onSelectTab,
}) => {
  return (
    <header className="h-13 border-b border-slate-200 bg-white px-4 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-2xs">
      {/* Left: Sidebar Entrance Toggle & Navigation Tabs */}
      <div className="flex items-center gap-2.5">
        {/* Sidebar entrance trigger */}
        <button
          onClick={onToggleSidebar}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-slate-700 hover:bg-slate-100 border border-slate-200 text-xs font-medium transition-colors"
          title="点击展开系统入口菜单"
        >
          <Menu className="w-3.5 h-3.5 text-slate-600" />
          <span className="font-semibold text-slate-800">系统入口</span>
        </button>

        <div className="h-3.5 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* Top Tab Bar: Clean Slate Aesthetic */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-md">
          <button
            onClick={() => onSelectTab?.('jobs')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              currentTab === 'jobs' || currentTab === 'config_wizard' || currentTab === 'results' || currentTab === 'candidate_detail'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>职位初筛列表</span>
          </button>
          <button
            onClick={() => onSelectTab?.('history')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              currentTab === 'history'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>历史初筛记录</span>
          </button>
        </div>

        {selectedJobTitle && currentTab !== 'jobs' && (
          <div className="hidden lg:flex items-center gap-1 text-xs text-slate-500">
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-700 font-medium truncate max-w-xs bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              {selectedJobTitle}
            </span>
          </div>
        )}
      </div>

      {/* Right Actions & Status Badges */}
      <div className="flex items-center gap-2.5">
        {/* Moka Sync */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Moka 通道正常 (今日拉取 42 份)</span>
        </div>

        {/* AI Engine status */}
        <div className="hidden xl:flex items-center gap-1 px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
          <Sparkles className="w-3 h-3 text-slate-500" />
          <span>智筛已就绪</span>
        </div>

        {/* IM Notification Button */}
        <button
          onClick={onOpenImSimulation}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors border border-slate-200"
          title="查看推送至内部 IM 群（飞书/企微）的初筛卡片"
        >
          <Bell className="w-3.5 h-3.5 text-slate-600" />
          <span>IM 筛选通知</span>
        </button>

        {/* Reset Mock button */}
        {onRefreshMock && (
          <button
            onClick={onRefreshMock}
            className="flex items-center p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors text-xs border border-transparent hover:border-slate-200"
            title="重置测试数据"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
};
