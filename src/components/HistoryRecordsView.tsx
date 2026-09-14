import React, { useState } from 'react';
import { ScreeningHistoryRecord, JobPosition } from '../types';
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  Database, 
  BarChart3, 
  RotateCcw, 
  Eye, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Sliders,
  Sparkles,
  FileCheck,
  ChevronRight
} from 'lucide-react';

interface HistoryRecordsViewProps {
  historyRecords: ScreeningHistoryRecord[];
  jobs: JobPosition[];
  onViewBatchResults: (jobId: string) => void;
  onReuseConfig: (jobId: string) => void;
  onBackToJobs: () => void;
}

export const HistoryRecordsView: React.FC<HistoryRecordsViewProps> = ({
  historyRecords,
  jobs,
  onViewBatchResults,
  onReuseConfig,
  onBackToJobs,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string>('all');

  const filteredRecords = historyRecords.filter(rec => {
    const matchSearch =
      rec.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.batchNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchJob = selectedJobId === 'all' ? true : rec.jobId === selectedJobId;

    return matchSearch && matchJob;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 flex flex-col h-screen">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500">AI 智筛审计追踪</div>
              <h1 className="text-lg font-bold text-slate-900">
                历史筛选记录与版本回溯 (Audit Trail)
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToJobs}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              返回职位看板
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-6 pb-20">
        {/* Intro Card */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-blue-300 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>多批次数据流转与决策溯源</span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl">
              记录每次从 Moka 实时拉取与历史人才库重排的完整批次快照，包含当次硬规则、画像模型、四维加权权重与候选人去向，确保每一步初筛均可溯源与复盘。
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs text-slate-400">已存档筛选批次</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
              {historyRecords.length} <span className="text-xs text-slate-300 font-normal">个历史批次</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>岗位筛选:</span>
            </div>
            <select
              value={selectedJobId}
              onChange={e => setSelectedJobId(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50 text-slate-700 font-medium"
            >
              <option value="all">全部关联岗位 ({jobs.length})</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="按批次号 (如 BATCH-...)、岗位名搜索..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8.5 pr-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Records Table / Cards */}
        <div className="space-y-4">
          {filteredRecords.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 space-y-2">
              <div className="text-sm font-medium text-slate-700">暂无符合条件的批次记录</div>
              <div className="text-xs text-slate-400">请清除搜索词或重新选择职位</div>
            </div>
          ) : (
            filteredRecords.map(record => {
              const passRate = Math.round((record.passedCount / record.totalScreened) * 100);

              return (
                <div
                  key={record.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {record.batchNo}
                        </span>
                        <h3 className="text-base font-bold text-slate-900">
                          {record.jobTitle}
                        </h3>
                        <span className="text-xs text-slate-500">
                          {record.department}
                        </span>
                        {record.status === 'completed' ? (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            已归档完成
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                            筛选中
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          触发时间: {record.triggerTime}
                        </span>
                        <span>•</span>
                        <span>操作人: {record.operator}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Database className="w-3 h-3" />
                          拉取来源: {record.source}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onViewBatchResults(record.jobId)}
                        className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>查看初筛结果榜</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onReuseConfig(record.jobId)}
                        className="px-3 py-2 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1"
                        title="复用当次画像与权重配置"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                        <span>复用配置</span>
                      </button>
                    </div>
                  </div>

                  {/* Batch Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                      <div className="text-slate-500">累计筛选简历</div>
                      <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
                        {record.totalScreened} 份
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200/80">
                      <div className="text-emerald-700 font-medium">初筛建议通过 (入榜)</div>
                      <div className="text-base font-bold text-emerald-800 font-mono mt-0.5">
                        {record.passedCount} 份 ({passRate}%)
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-200/80">
                      <div className="text-rose-700 font-medium">硬规则拦截淘汰</div>
                      <div className="text-base font-bold text-rose-800 font-mono mt-0.5">
                        {record.rejectedCount} 份
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-200/80">
                      <div className="text-indigo-700 font-medium">入榜平均分</div>
                      <div className="text-base font-bold text-indigo-800 font-mono mt-0.5">
                        {record.avgScore} 分
                      </div>
                    </div>
                  </div>

                  {/* Configuration Snapshot Info */}
                  <div className="flex flex-wrap items-center justify-between text-xs pt-1 border-t border-slate-100 text-slate-600 gap-2">
                    <div>
                      <span className="text-slate-400">当时硬规则快照：</span>
                      <span className="font-mono text-slate-700">{record.hardRuleSummary}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">权重快照：</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[11px]">
                        技能{record.weights.skills}% / 经验{record.weights.experience}% / 稳定{record.weights.stability}% / 学历{record.weights.education}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
