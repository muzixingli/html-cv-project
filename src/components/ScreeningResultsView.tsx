import React, { useState } from 'react';
import { 
  JobPosition, 
  Candidate 
} from '../types';
import { 
  ArrowLeft, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  ChevronRight, 
  Sparkles, 
  Sliders, 
  AlertCircle,
  RotateCcw,
  X
} from 'lucide-react';

interface ScreeningResultsViewProps {
  job: JobPosition;
  candidates: Candidate[];
  onBackToJobs: () => void;
  onSelectCandidate: (candidate: Candidate) => void;
  onQuickPushToMoka: (candidateId: string) => void;
  onOpenRejectFeedbackModal: (candidate: Candidate) => void;
  onOpenConfig?: (job: JobPosition) => void;
  onOpenHistory?: (job: JobPosition) => void;
}

export const ScreeningResultsView: React.FC<ScreeningResultsViewProps> = ({
  job,
  candidates,
  onBackToJobs,
  onSelectCandidate,
  onQuickPushToMoka,
  onOpenRejectFeedbackModal,
  onOpenConfig,
  onOpenHistory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'pushed_to_moka' | 'rejected'>('all');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'high' | 'mid' | 'low'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'moka_live' | 'talent_pool'>('all');
  const [showAlertBanner, setShowAlertBanner] = useState(true);

  // Filter for candidates belonging to this job
  const jobCandidates = candidates.filter(c => c.jobId === job.id);

  // Stats calculation
  const totalScreened = job.stats?.total || 189;
  const liveCount = 89;
  const talentCount = 100;

  // Filter logic
  const filteredList = jobCandidates
    .filter(cand => {
      const matchSearch =
        cand.name.includes(searchQuery) ||
        cand.currentCompany.includes(searchQuery) ||
        cand.school.includes(searchQuery) ||
        cand.currentTitle.includes(searchQuery);

      const matchStatus =
        statusFilter === 'all' ? true : cand.status === statusFilter;

      const matchScore =
        scoreFilter === 'all'
          ? true
          : scoreFilter === 'high'
          ? cand.totalScore >= 75
          : scoreFilter === 'mid'
          ? cand.totalScore >= 60 && cand.totalScore < 75
          : cand.totalScore < 60;

      const matchSource =
        sourceFilter === 'all'
          ? true
          : sourceFilter === 'moka_live'
          ? cand.sourceType === 'moka_live'
          : cand.sourceType === 'talent_pool';

      return matchSearch && matchStatus && matchScore && matchSource;
    })
    .sort((a, b) => b.totalScore - a.totalScore);

  const getScoreSquareColor = (score: number) => {
    if (score >= 75) return 'bg-emerald-600 text-white';
    if (score >= 60) return 'bg-amber-500 text-white';
    return 'bg-slate-500 text-white';
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 flex flex-col h-screen">
      {/* 顶部标题栏 (对应截图7风格: < 筛选结果 - 职位 - 编号) */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBackToJobs}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="返回职位列表"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>筛选结果 - {job.title} - {job.code}</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {onOpenConfig && (
              <button
                onClick={() => onOpenConfig(job)}
                className="px-2.5 py-1 rounded text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1 shadow-2xs"
              >
                <Sliders className="w-3 h-3 text-slate-500" />
                <span>配置岗位画像</span>
              </button>
            )}
            <button
              onClick={onBackToJobs}
              className="px-3 py-1 rounded text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              返回职位列表
            </button>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 space-y-2.5 pb-20">
        {/* 单行精简统计概览 (对应截图7) */}
        <div className="bg-white rounded-lg px-3.5 py-2 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-3 text-slate-600">
            <span>共 <strong className="text-slate-900 font-mono">{totalScreened}</strong> 份简历参与评分</span>
            <span className="text-slate-300">•</span>
            <span>已投递: <strong className="text-slate-800 font-mono">{liveCount}</strong></span>
            <span className="text-slate-300">•</span>
            <span>人才库匹配: <strong className="text-slate-800 font-mono">{talentCount}</strong></span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenConfig && (
              <button
                onClick={() => onOpenConfig(job)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                <Sliders className="w-3 h-3" />
                <span>调整画像与权重</span>
              </button>
            )}
          </div>
        </div>

        {/* 提示新增简历横幅 (对应截图7黄色提示，可关闭) */}
        {showAlertBanner && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-2 flex items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-amber-400 text-white flex items-center justify-center font-bold text-[10px]">!</span>
              <span>自上次筛选后，已有 <strong>8</strong> 份新简历投递，当前结果未包含这些候选人。</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowAlertBanner(false)}
                className="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-200/70 hover:bg-amber-200 text-amber-900 transition-colors"
              >
                仅评分新增简历
              </button>
              <button
                onClick={() => setShowAlertBanner(false)}
                className="text-amber-600 hover:text-amber-800 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 紧凑搜索与筛选工具栏 */}
        <div className="bg-white rounded-lg px-3.5 py-2 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
          {/* 状态与维度筛选 */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* 搜索框 */}
            <div className="relative w-48">
              <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索候选人姓名/公司..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-7 pr-2.5 py-1 border border-slate-200 rounded bg-slate-50 focus:bg-white"
              />
            </div>

            {/* 分数段筛选 */}
            <select
              value={scoreFilter}
              onChange={e => setScoreFilter(e.target.value as any)}
              className="text-xs border border-slate-200 rounded px-2 py-1 bg-slate-50 text-slate-700"
            >
              <option value="all">分数: 全部</option>
              <option value="high">75 及以上 (高潜)</option>
              <option value="mid">60 - 74 分 (基本符合)</option>
              <option value="low">60 以下 (谨慎)</option>
            </select>

            {/* 简历来源筛选 */}
            <select
              value={sourceFilter}
              onChange={e => setSourceFilter(e.target.value as any)}
              className="text-xs border border-slate-200 rounded px-2 py-1 bg-slate-50 text-slate-700"
            >
              <option value="all">来源: 全部</option>
              <option value="moka_live">已投递简历</option>
              <option value="talent_pool">人才库匹配</option>
            </select>

            {/* 处理状态筛选 */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="text-xs border border-slate-200 rounded px-2 py-1 bg-slate-50 text-slate-700"
            >
              <option value="all">处理状态: 全部</option>
              <option value="pending">待处理</option>
              <option value="pushed_to_moka">已推至 Moka</option>
              <option value="rejected">已淘汰</option>
            </select>
          </div>

          <div className="text-[11px] text-slate-400">
            Moka 简历阶段 · 同步任务即时更新
          </div>
        </div>

        {/* 候选人列表 (每张卡片紧凑单页设计，对应截图7 + 截图1四维分值) */}
        <div className="space-y-2">
          {filteredList.length === 0 ? (
            <div className="bg-white rounded-lg p-10 text-center border border-slate-200 text-xs text-slate-400">
              暂无符合筛选条件的候选人
            </div>
          ) : (
            filteredList.map((cand, index) => {
              const isPushed = cand.status === 'pushed_to_moka';
              const isRejected = cand.status === 'rejected';

              return (
                <div
                  key={cand.id}
                  className={`bg-white rounded-lg border px-4 py-2.5 transition-all shadow-2xs hover:shadow-xs ${
                    isPushed
                      ? 'border-emerald-200 bg-emerald-50/15'
                      : isRejected
                      ? 'border-slate-200 bg-slate-50/70 opacity-75'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* 左侧主要信息块 (对应截图7五行信息) */}
                    <div className="flex-1 min-w-0 space-y-1">
                      {/* 第一行: 姓名、来源标签、阶段 */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {cand.name}
                        </span>

                        {cand.sourceType === 'talent_pool' ? (
                          <span className="px-1.5 py-0.2 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            人才库匹配
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            已投递
                          </span>
                        )}

                        <span className="text-xs text-slate-500">
                          • 初筛
                        </span>

                        {/* 达标/警告标签 */}
                        {cand.scores.education.score < 60 ? (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            ① 学历需确认
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                            硬规则通过
                          </span>
                        )}

                        {isPushed && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            ✓ 已推至 Moka
                          </span>
                        )}
                        {isRejected && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-rose-100 text-rose-800">
                            ✕ 已淘汰
                          </span>
                        )}
                      </div>

                      {/* 第二行: 当前公司 | 职位 | 工作年限 | 城市 */}
                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
                        <span className="font-medium text-slate-800">{cand.currentCompany}</span>
                        <span className="text-slate-300">|</span>
                        <span>{cand.currentTitle}</span>
                        <span className="text-slate-300">|</span>
                        <span>工作 {cand.workYears} 年</span>
                        <span className="text-slate-300">|</span>
                        <span>📍 {cand.city}</span>
                      </div>

                      {/* 第三行: 毕业院校 | 专业 | 学历 */}
                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                        <span>{cand.school} {cand.is985211 ? '(985/211)' : ''}</span>
                        <span className="text-slate-300">|</span>
                        <span>{cand.major}</span>
                        <span className="text-slate-300">|</span>
                        <span>{cand.degree}</span>
                      </div>

                      {/* 第四行: 技能与画像标签 */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        {cand.matchTags.map(tag => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200 font-mono"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* 第五行: AI 简要总结评价 (单行呈现) */}
                      <div className="text-[11px] text-slate-600 flex items-center gap-1.5 pt-0.5">
                        <span className="px-1 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-[10px] shrink-0">
                          AI 评价
                        </span>
                        <span className="truncate">{cand.aiSummary}</span>
                      </div>
                    </div>

                    {/* 右侧：截图1同款四维分数矩阵 + 操作按钮 */}
                    <div className="flex items-center gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                      {/* 截图1同款分数小组件：左边2x2维度分数，右边总分方块 */}
                      <div className="flex items-center gap-2.5 bg-slate-50/80 px-2.5 py-1.5 rounded-lg border border-slate-200">
                        {/* 2x2 维度矩阵 */}
                        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px] font-mono">
                          <div className="text-slate-500">
                            技能 <span className="font-bold text-slate-800">{cand.scores.skills.score}</span>
                          </div>
                          <div className="text-slate-500">
                            经验 <span className="font-bold text-slate-800">{cand.scores.experience.score}</span>
                          </div>
                          <div className="text-slate-500">
                            教育 <span className="font-bold text-slate-800">{cand.scores.education.score}</span>
                          </div>
                          <div className="text-slate-500">
                            稳定 <span className="font-bold text-slate-800">{cand.scores.stability.score}</span>
                          </div>
                        </div>

                        {/* 总分方块 (截图1同款) */}
                        <div
                          className={`w-10 h-10 rounded-md flex items-center justify-center font-mono font-bold text-base shadow-2xs ${getScoreSquareColor(
                            cand.totalScore
                          )}`}
                          title={`综合总分: ${cand.totalScore}分`}
                        >
                          {cand.totalScore}
                        </div>
                      </div>

                      {/* 操作按钮区 (保留查看详情) */}
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          onClick={() => onSelectCandidate(cand)}
                          className="px-3 py-1 rounded text-slate-700 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition-colors font-medium shadow-2xs"
                        >
                          查看详情
                        </button>
                      </div>
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

