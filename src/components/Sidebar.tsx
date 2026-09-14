import React from 'react';
import { 
  Bot, 
  Briefcase, 
  History, 
  Database, 
  Send, 
  CheckCircle2, 
  ChevronRight,
  Sliders,
  X
} from 'lucide-react';

interface SidebarProps {
  currentTab: 'jobs' | 'config_wizard' | 'history' | 'results' | 'candidate_detail';
  setCurrentTab: (tab: 'jobs' | 'history') => void;
  selectedJobTitle?: string;
  activeScreeningCount: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  selectedJobTitle,
  activeScreeningCount,
  isOpen = false,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Container: Unified clean B-end light theme */}
      <aside className="relative w-80 bg-white text-slate-800 flex flex-col h-screen shrink-0 select-none border-r border-slate-200 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
        
        {/* Brand Header (CSS selector 1 target) */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>AI 简历初筛工作台</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono font-medium border border-slate-200">
                  v2.4
                </span>
              </div>
              <div className="text-[11px] text-slate-500">HR 业务协同 · 智能初筛系统</div>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="收起入口菜单"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Main Navigation Menu (CSS selector 2 target) */}
        <nav className="flex-1 px-3 py-3.5 space-y-1 overflow-y-auto bg-white">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 tracking-wider">
            核心工作模块
          </div>

          <button
            onClick={() => {
              setCurrentTab('jobs');
              onClose?.();
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'jobs' || currentTab === 'config_wizard' || currentTab === 'results' || currentTab === 'candidate_detail'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>职位初筛列表与看板</span>
            </div>
            {activeScreeningCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                {activeScreeningCount} 初筛中
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setCurrentTab('history');
              onClose?.();
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'history'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <History className="w-4 h-4" />
              <span>历史初筛批次与回溯</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Current Active Context */}
          {selectedJobTitle && (
            <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div className="text-[11px] text-slate-500 font-medium mb-1">
                当前聚焦职位
              </div>
              <div className="font-semibold text-slate-900 line-clamp-1">
                {selectedJobTitle}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>画像与四维初筛模式激活</span>
              </div>
            </div>
          )}

          <div className="pt-4 px-3 pb-2 text-[11px] font-semibold text-slate-400 tracking-wider">
            集成数据通道
          </div>

          {/* Moka Integration Card */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <Database className="w-3.5 h-3.5 text-slate-600" />
                <span>Moka ATS 实时通道</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                已连通
              </span>
            </div>
            <div className="text-[11px] text-slate-500 leading-relaxed">
              实时自动同步候选人投递与历史人才库沉淀简历。
            </div>
          </div>

          {/* Internal IM Push Card */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <Send className="w-3.5 h-3.5 text-slate-600" />
                <span>企业内部 IM 协作群</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200">
                飞书/企微就绪
              </span>
            </div>
            <div className="text-[11px] text-slate-500 leading-relaxed">
              高匹配候选人自动推送初筛卡片，支持 HR 一键初审。
            </div>
          </div>
        </nav>

        {/* Footer / Current Operator (CSS selector 3 target) */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-300">
              林
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800">林晓涵</div>
              <div className="text-[11px] text-slate-500">招聘顾问 · HRG</div>
            </div>
          </div>
          <div className="text-[11px] text-slate-600 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>在线</span>
          </div>
        </div>
      </aside>
    </div>
  );
};
