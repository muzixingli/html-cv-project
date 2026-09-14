import React from 'react';
import { ScreeningHistoryRecord, JobPosition } from '../types';
import { 
  X, 
  History, 
  Clock, 
  Database, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Sliders, 
  RotateCcw,
  Sparkles,
  BarChart3,
  User
} from 'lucide-react';

interface JobHistoryModalProps {
  job: JobPosition;
  historyRecords: ScreeningHistoryRecord[];
  onClose: () => void;
  onViewBatchResults: (jobId: string, batchNo: string) => void;
  onReuseConfig: (jobId: string) => void;
}

export const JobHistoryModal: React.FC<JobHistoryModalProps> = ({
  job,
  historyRecords,
  onClose,
  onViewBatchResults,
  onReuseConfig,
}) => {
  // Filter history records strictly by this job
  const jobRecords = historyRecords.filter(r => r.jobId === job.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <History className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">
                  {job.title} · 历史筛选批次回溯
                </h2>
                <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  {job.code}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                该岗位历史评估批次记录与推荐结果快照
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {jobRecords.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold text-slate-700">该岗位暂无历史筛选批次</div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="text-xs text-slate-500 flex items-center justify-between px-1">
                <span>共 <strong className="text-slate-800 font-mono">{jobRecords.length}</strong> 次筛选记录</span>
              </div>

              {jobRecords.map((record, index) => {
                const passRate = Math.round((record.passedCount / record.totalScreened) * 100);

                return (
                  <div
                    key={record.id}
                    className={`rounded-lg border p-3.5 transition-all shadow-2xs ${
                      index === 0
                        ? 'border-blue-200 bg-blue-50/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold font-mono text-slate-900">
                            {record.batchNo}
                          </span>
                          {index === 0 && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">
                              最新批次
                            </span>
                          )}
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {record.triggerTime}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-600 flex items-center gap-1">
                            <Database className="w-3 h-3 text-slate-400" />
                            {record.source}
                          </span>
                        </div>

                        {/* Snapshot statistics */}
                        <div className="flex flex-wrap items-center gap-3 text-xs pt-1 text-slate-600">
                          <span>
                            初筛总量: <strong className="font-mono text-slate-900">{record.totalScreened}</strong> 份
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            建议推进: <strong className="font-mono">{record.passedCount}</strong> 人 ({passRate}%)
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="text-slate-500">
                            规则拦截: <strong className="font-mono">{record.rejectedCount}</strong> 份
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="font-mono text-indigo-700">
                            均分: <strong>{record.avgScore}</strong>
                          </span>
                        </div>

                        {/* Hard rule and weights summary */}
                        <div className="text-[11px] text-slate-500 pt-1 flex flex-wrap items-center gap-2">
                          <span className="bg-slate-100 px-1.5 py-0.2 rounded text-slate-700 font-mono">
                            门槛: {record.hardRuleSummary}
                          </span>
                          <span className="bg-slate-100 px-1.5 py-0.2 rounded text-slate-700 font-mono">
                            权重: 技{record.weights.skills}% / 经{record.weights.experience}% / 稳{record.weights.stability}% / 学{record.weights.education}%
                          </span>
                          <span className="text-slate-400">
                            操作人: {record.operator}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                        <button
                          onClick={() => {
                            onClose();
                            onViewBatchResults(record.jobId, record.batchNo);
                          }}
                          className="px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-2xs transition-colors flex items-center gap-1"
                        >
                          <BarChart3 className="w-3 h-3" />
                          <span>查看此批次结果</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => {
                            onClose();
                            onReuseConfig(record.jobId);
                          }}
                          className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
                          title="复用此批次画像与权重"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI 模型会学习往期各批次最终在 Moka 录用的人才特征，持续自适应校准画像</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
