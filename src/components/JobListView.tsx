import React, { useState } from 'react';
import { 
  JobPosition, 
  JobStatus 
} from '../types';
import { 
  Search, 
  Filter, 
  Sliders, 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Database, 
  ChevronRight, 
  BarChart3, 
  ArrowRight,
  SlidersHorizontal,
  History,
  Plus,
  Play
} from 'lucide-react';

interface JobListViewProps {
  jobs: JobPosition[];
  onStartConfig: (job: JobPosition) => void;
  onViewResults: (job: JobPosition) => void;
  onViewHistory: (jobId?: string) => void;
  onOpenJobHistory?: (job: JobPosition) => void;
  onQuickRunScreening: (job: JobPosition) => void;
  onAddNewJob?: () => void;
}

export const JobListView: React.FC<JobListViewProps> = ({
  jobs,
  onStartConfig,
  onViewResults,
  onViewHistory,
  onOpenJobHistory,
  onQuickRunScreening,
  onAddNewJob,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | JobStatus>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  // Filter counts
  const totalCount = jobs.length;
  const configuringCount = jobs.filter(j => j.status === 'configuring').length;
  const screeningCount = jobs.filter(j => j.status === 'screening').length;
  const completedCount = jobs.filter(j => j.status === 'completed').length;

  // Departments
  const departments = ['all', ...Array.from(new Set(jobs.map(j => j.department)))];

  // Filtered jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      selectedStatusFilter === 'all' ? true : job.status === selectedStatusFilter;

    const matchesDept = 
      selectedDepartment === 'all' ? true : job.department === selectedDepartment;

    return matchesSearch && matchesStatus && matchesDept;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 max-w-7xl mx-auto w-full space-y-2.5">
      {/* 紧凑单行导航指标条 (统一克制低饱和度风格) */}
      <div 
        id="job-nav-metrics-bar"
        className="bg-white rounded-lg px-3.5 py-2 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-2.5 text-xs"
      >
        {/* Left: concise metric indicators */}
        <div className="flex flex-wrap items-center gap-2.5 text-slate-600">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
            <span>职位初筛概况</span>
          </div>
          <span className="text-slate-200">|</span>
          <div className="flex items-center gap-2">
            <span>总岗位 <strong className="text-slate-900 font-mono">{totalCount}</strong></span>
            <span className="text-slate-200">•</span>
            <span>已配置画像 <strong className="text-slate-800 font-mono">{configuringCount}</strong></span>
            <span className="text-slate-200">•</span>
            <span>初筛中 <strong className="text-slate-800 font-mono">{screeningCount}</strong></span>
            <span className="text-slate-200">•</span>
            <span>已出报告 <strong className="text-slate-800 font-mono">{completedCount}</strong></span>
          </div>
        </div>

        {/* Right: operational throughput info */}
        <div className="flex items-center gap-2.5 text-[11px] text-slate-500">
          <div className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
            <span className="text-slate-400">今日拉取:</span>
            <strong className="text-slate-700 font-mono">42</strong> 份
          </div>
          <div className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
            <span className="text-slate-400">建议初推:</span>
            <strong className="text-slate-700 font-mono">18</strong> 份
          </div>
          <div className="flex items-center gap-1 text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Moka 数据通道正常</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar - Compressed */}
      <div className="bg-white rounded-lg px-3.5 py-2 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Status Category Tabs - Clean Slate Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-0.5 md:pb-0">
          <button
            onClick={() => setSelectedStatusFilter('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all shrink-0 ${
              selectedStatusFilter === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            全部 ({totalCount})
          </button>
          <button
            onClick={() => setSelectedStatusFilter('configuring')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all shrink-0 flex items-center gap-1 ${
              selectedStatusFilter === 'configuring'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-3 h-3" />
            已配置画像 ({configuringCount})
          </button>
          <button
            onClick={() => setSelectedStatusFilter('screening')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all shrink-0 flex items-center gap-1 ${
              selectedStatusFilter === 'screening'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Loader2 className={`w-3 h-3 ${screeningCount > 0 ? 'animate-spin text-amber-500' : ''}`} />
            初筛中 ({screeningCount})
          </button>
          <button
            onClick={() => setSelectedStatusFilter('completed')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all shrink-0 flex items-center gap-1 ${
              selectedStatusFilter === 'completed'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            已出结果 ({completedCount})
          </button>
        </div>

        {/* Right: Department Select & Search Input */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium shrink-0">
            <Filter className="w-3 h-3 text-slate-400" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              <option value="all">全部部门 ({totalCount})</option>
              {departments.filter(d => d !== 'all').map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="relative w-44 lg:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索职位名、编号..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 text-xs border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all placeholder:text-slate-400 text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Jobs List / Compact Table View */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        {/* Table Header */}
        <div className="bg-slate-50/90 px-3.5 py-2 border-b border-slate-200 grid grid-cols-12 gap-2 text-xs font-semibold text-slate-600">
          <div className="col-span-12 md:col-span-4">职位名称 / 编码 / 部门</div>
          <div className="col-span-6 md:col-span-3 hidden md:block">初筛数据源与硬规则门槛</div>
          <div className="col-span-6 md:col-span-2 hidden md:block">筛选状态与评估概况</div>
          <div className="col-span-12 md:col-span-3 text-right">操作</div>
        </div>

        {/* Table Body */}
        {filteredJobs.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
            <div className="text-xs font-medium text-slate-700">未找到符合条件的岗位</div>
            <button
              onClick={() => { setSearchQuery(''); setSelectedStatusFilter('all'); setSelectedDepartment('all'); }}
              className="px-2.5 py-1 text-xs text-slate-700 hover:text-slate-900 font-medium"
            >
              重置筛选
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredJobs.map((job) => {
              const isScreening = job.status === 'screening';
              const isCompleted = job.status === 'completed';

              return (
                <div
                  key={job.id}
                  className={`px-3.5 py-2.5 grid grid-cols-12 gap-2 items-center transition-colors hover:bg-slate-50/70 ${
                    isScreening ? 'bg-amber-50/15' : ''
                  }`}
                >
                  {/* Column 1: Job Title, Code, Department, Recruiter */}
                  <div className="col-span-12 md:col-span-4 space-y-0.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-mono px-1 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                        {job.code}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {job.title}
                      </span>
                      {job.urgency === 'high' ? (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                          急聘 HC:{job.headCount}
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded text-[10px] text-slate-500 bg-slate-100">
                          HC:{job.headCount}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>{job.department}</span>
                      <span className="text-slate-300">•</span>
                      <span>负责: {job.recruiter}</span>
                      {job.lastRunAt && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-400">上次: {job.lastRunAt.slice(5)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Column 2: Data Source & Hard Rules */}
                  <div className="col-span-6 md:col-span-3 hidden md:block space-y-0.5 text-xs">
                    <div className="flex items-center gap-1 text-slate-700 font-medium truncate">
                      <Database className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {job.config.source === 'both' ? 'Moka实时 + 人才库' : job.config.source === 'moka_live' ? 'Moka 实时投递' : '历史人才库'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate" title={`门槛: ${job.config.hardRules.minDegree} / ${job.config.hardRules.minYears}年+`}>
                      {job.config.hardRules.minDegree}及以上 · {job.config.hardRules.minYears}年+
                      {job.config.vetoRules.length > 0 && ` · ${job.config.vetoRules.length}项否决`}
                    </div>
                  </div>

                  {/* Column 3: Status & Screening Progress */}
                  <div className="col-span-6 md:col-span-2 hidden md:block space-y-0.5">
                    {isScreening ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-amber-800 font-medium flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
                            初筛中 ({job.screeningProgress?.percent || 60}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                          <div 
                            className="bg-amber-500 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${job.screeningProgress?.percent || 60}%` }}
                          />
                        </div>
                      </div>
                    ) : isCompleted && job.stats ? (
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                            已就绪
                          </span>
                          <span className="text-xs font-semibold text-slate-800">
                            推 {job.stats.passed} 人
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          初筛 {job.stats.total} 份 · 均分 {job.stats.avgScore}
                        </div>
                      </div>
                    ) : job.status === 'configuring' ? (
                      <div className="space-y-0.5">
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200 inline-block">
                          画像已就绪
                        </span>
                        <div className="text-[11px] text-slate-500">
                          门槛已设定，待筛选
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200 inline-block">
                          待配置画像
                        </span>
                        <div className="text-[11px] text-slate-400">
                          待输入JD与隐性标准
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Column 4: Actions (清晰显式按键: 配置画像、历史批次、报告/初筛) */}
                  <div className="col-span-12 md:col-span-3 flex items-center justify-end gap-1.5">
                    {/* 配置画像按钮 (满足用户要求：在职位列表有一开始就配置JD和隐性标准的按钮) */}
                    <button
                      onClick={() => onStartConfig(job)}
                      className="px-2 py-1 rounded text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1 shadow-2xs shrink-0"
                      title="输入与维护岗位JD、内部隐性标准与四维权重"
                    >
                      <SlidersHorizontal className="w-3 h-3 text-slate-500" />
                      <span>配置画像</span>
                    </button>

                    {/* 岗位历史批次按钮 (满足用户要求：by岗位查看历史发起筛选的结果，入口清晰不乱) */}
                    <button
                      onClick={() => {
                        if (onOpenJobHistory) {
                          onOpenJobHistory(job);
                        } else {
                          onViewHistory(job.id);
                        }
                      }}
                      className="px-2 py-1 rounded text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1 shadow-2xs shrink-0"
                      title="按该岗位查看历次初筛批次、回溯推荐结果与历史画像"
                    >
                      <History className="w-3 h-3 text-slate-500" />
                      <span>历史批次</span>
                    </button>

                    {/* 状态主操作 */}
                    {isScreening ? (
                      <button
                        disabled
                        className="px-2.5 py-1 rounded text-xs font-medium bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed flex items-center gap-1 shrink-0"
                      >
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>评估中</span>
                      </button>
                    ) : isCompleted ? (
                      <button
                        onClick={() => onViewResults(job)}
                        className="px-2.5 py-1 rounded text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-2xs transition-colors flex items-center gap-1 shrink-0"
                      >
                        <BarChart3 className="w-3 h-3" />
                        <span>报告</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onStartConfig(job)}
                        className="px-2.5 py-1 rounded text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-colors flex items-center gap-1 shrink-0"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>初筛</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
