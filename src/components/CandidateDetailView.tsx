import React, { useState } from 'react';
import { 
  Candidate, 
  JobPosition 
} from '../types';
import { 
  ArrowLeft, 
  Send, 
  FileText, 
  Check, 
  Sparkles,
  AlertCircle,
  HelpCircle,
  Copy,
  X,
  ExternalLink
} from 'lucide-react';

interface CandidateDetailViewProps {
  candidate: Candidate;
  job: JobPosition;
  onBack: () => void;
  onPushToMoka: (candidateId: string) => void;
  onOpenRejectModal: (candidate: Candidate) => void;
  onUpdateAiAccuracyFeedback: (candidateId: string, accuracy: 'accurate' | 'too_high' | 'too_low') => void;
}

export const CandidateDetailView: React.FC<CandidateDetailViewProps> = ({
  candidate,
  job,
  onBack,
  onPushToMoka,
  onOpenRejectModal,
  onUpdateAiAccuracyFeedback,
}) => {
  const [showFullResumeModal, setShowFullResumeModal] = useState(false);
  const [pushedSuccess, setPushedSuccess] = useState(candidate.status === 'pushed_to_moka');
  const [copiedResume, setCopiedResume] = useState(false);

  const handlePush = () => {
    onPushToMoka(candidate.id);
    setPushedSuccess(true);
  };

  const handleCopyResume = () => {
    navigator.clipboard.writeText(candidate.originalResumeText || '');
    setCopiedResume(true);
    setTimeout(() => setCopiedResume(false), 2000);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* 顶部轻量导航与操作栏 */}
      <div className="bg-white border-b border-slate-200 px-5 py-2.5 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1 text-xs font-medium"
              title="返回候选人列表"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>返回列表</span>
            </button>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-900 text-sm">{candidate.name}</span>
              <span className="text-slate-500 font-medium">（{job.title}）</span>
              <span className="text-slate-400 font-mono text-[11px]">初筛排名 #{candidate.rrfRank}</span>
              {candidate.status === 'pushed_to_moka' && (
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <Check className="w-3 h-3" /> 已推进
                </span>
              )}
              {candidate.status === 'rejected' && (
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-300">
                  已淘汰
                </span>
              )}
            </div>
          </div>

          {/* 右侧：更醒目美观、与全站白蓝风格统一的“查看简历原文”按钮 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFullResumeModal(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/90 transition-all flex items-center gap-1.5 shadow-2xs group"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600 group-hover:scale-105 transition-transform" />
              <span>查看简历原文</span>
              <ExternalLink className="w-3 h-3 text-blue-400" />
            </button>
          </div>
        </div>
      </div>

      {/* 核心无须滚动主体 */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-5 py-3 overflow-hidden flex flex-col min-h-0">
        {/* 候选人基础信息条 (简洁利落单行) */}
        <div className="bg-white rounded-lg px-4 py-2 border border-slate-200 shadow-2xs mb-2.5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={candidate.avatar}
              alt={candidate.name}
              className="w-8 h-8 rounded object-cover border border-slate-200 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span className="text-sm font-bold text-slate-900">{candidate.name}</span>
                <span className="text-slate-500">
                  {candidate.gender} · {candidate.age}岁 · 工作{candidate.workYears}年
                </span>
                <span className="px-1.5 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 border border-slate-200">
                  {candidate.degree} · {candidate.school}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 border border-slate-200">
                  {candidate.major}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-600 mt-0.5 truncate">
                <span className="font-medium text-slate-800">{candidate.currentCompany} · {candidate.currentTitle}</span>
                <span className="text-slate-300">•</span>
                <span>{candidate.city}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-mono">{candidate.phone}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {candidate.matchTags.map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50/70 text-blue-700 border border-blue-200/70"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 左右分栏：颜色层次清晰，大标题与模块差异醒目 */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
          {/* 左侧 (7列)：四维分值与依据 + 关键工作履历 */}
          <div className="lg:col-span-7 flex flex-col gap-2.5 min-h-0">
            {/* 四维评估依据卡片 */}
            <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs space-y-2.5 shrink-0">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-lg flex flex-col items-center justify-center font-mono font-bold shadow-2xs ${
                    candidate.totalScore >= 75
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 text-white'
                  }`}>
                    <span className="text-lg leading-none font-extrabold">{candidate.totalScore}</span>
                    <span className="text-[9px] text-white/80 mt-0.5">综合分</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>初筛综合评估结果</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-600">
                        RRF 排名 #{candidate.rrfRank}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {candidate.totalScore >= 75 
                        ? '高度匹配核心岗位画像要求，各维度表现均衡，建议优先安排初试' 
                        : '基本符合岗位底线要求，部分深度维度存在差距，建议综合权衡'}
                    </div>
                  </div>
                </div>

                {/* 4 维分值徽标 (带轻微色彩识别) */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs font-mono">
                  <div className="flex items-center justify-between gap-2 bg-blue-50/70 px-2 py-0.5 rounded border border-blue-200/70">
                    <span className="text-blue-700 font-sans text-[11px]">专业技能:</span>
                    <strong className="text-blue-900 font-bold">{candidate.scores.skills.score}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-indigo-50/70 px-2 py-0.5 rounded border border-indigo-200/70">
                    <span className="text-indigo-700 font-sans text-[11px]">项目经验:</span>
                    <strong className="text-indigo-900 font-bold">{candidate.scores.experience.score}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-teal-50/70 px-2 py-0.5 rounded border border-teal-200/70">
                    <span className="text-teal-700 font-sans text-[11px]">职业稳定:</span>
                    <strong className="text-teal-900 font-bold">{candidate.scores.stability.score}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    <span className="text-slate-600 font-sans text-[11px]">学历背景:</span>
                    <strong className="text-slate-900 font-bold">{candidate.scores.education.score}</strong>
                  </div>
                </div>
              </div>

              {/* 四维详细评析 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-blue-50/30 border border-blue-100 space-y-0.5">
                  <div className="flex items-center justify-between font-semibold text-blue-900">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      专业技能
                    </span>
                    <span className="font-mono font-bold text-blue-700">{candidate.scores.skills.score}分</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                    {candidate.scores.skills.rationale}
                  </p>
                </div>

                <div className="p-2 rounded-lg bg-indigo-50/30 border border-indigo-100 space-y-0.5">
                  <div className="flex items-center justify-between font-semibold text-indigo-900">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                      项目经验
                    </span>
                    <span className="font-mono font-bold text-indigo-700">{candidate.scores.experience.score}分</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                    {candidate.scores.experience.rationale}
                  </p>
                </div>

                <div className="p-2 rounded-lg bg-teal-50/30 border border-teal-100 space-y-0.5">
                  <div className="flex items-center justify-between font-semibold text-teal-900">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                      职业稳定性
                    </span>
                    <span className="font-mono font-bold text-teal-700">{candidate.scores.stability.score}分</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                    {candidate.scores.stability.rationale}
                  </p>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 space-y-0.5">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                      学历背景
                    </span>
                    <span className="font-mono font-bold text-slate-900">{candidate.scores.education.score}分</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                    {candidate.scores.education.rationale}
                  </p>
                </div>
              </div>
            </div>

            {/* 工作履历摘要 */}
            <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-2xs flex-1 overflow-hidden flex flex-col">
              <div className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1.5 mb-2 flex items-center justify-between">
                <span>关键工作履历</span>
                <span className="text-[11px] font-normal text-slate-400">已自动提取核心项目与职责</span>
              </div>
              <div className="space-y-2 text-xs overflow-y-auto flex-1 pr-1">
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between font-semibold text-slate-900 text-[11px]">
                    <span className="text-blue-900 font-bold">{candidate.currentCompany} · {candidate.currentTitle}</span>
                    <span className="text-slate-400 font-mono font-normal">2021.06 - 至今</span>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    <div>• 主导核心微服务高并发架构研发与性能调优，支撑大促业务流量。</div>
                    <div>• 熟练掌握 Spring Cloud、Redis 缓存架构、MySQL 读写分离分库分表。</div>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between font-semibold text-slate-900 text-[11px]">
                    <span>前司互联网科技 · 后端研发工程师</span>
                    <span className="text-slate-400 font-mono font-normal">2019.07 - 2021.05</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    <div>• 参与分布式消息队列消费与结算链路设计，完成核心模块高质量交付。</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧 (5列)：【核心亮点 / 潜在差距 / 建议追问】色彩层次分明、视觉差异显著 */}
          <div className="lg:col-span-5 flex flex-col gap-2.5 min-h-0">
            {/* 亮点、差距、追问主体卡片 */}
            <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-2xs space-y-3 flex-1 overflow-y-auto">
              {/* 模块 1：核心亮点（翡翠绿色系，优势清晰突出） */}
              <div className="rounded-lg p-2.5 bg-emerald-50/50 border border-emerald-200/70 space-y-1.5">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-1">
                  <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>一、核心匹配亮点</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700">
                    优势项
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  {candidate.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-emerald-950 text-[11px] leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5"></span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 模块 2：潜在差距 / 风险（温暖琥珀色系，警示直观明了） */}
              <div className="rounded-lg p-2.5 bg-amber-50/50 border border-amber-200/70 space-y-1.5">
                <div className="flex items-center justify-between border-b border-amber-100 pb-1">
                  <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>二、潜在差距 / 关注点</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-700">
                    待核实
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  {candidate.gapsOrRisks.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-amber-950 text-[11px] leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5"></span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 模块 3：建议追问要点（群青蓝色系，提问标签极其抓眼，方便直接面试） */}
              <div className="rounded-lg p-2.5 bg-blue-50/50 border border-blue-200/70 space-y-1.5">
                <div className="flex items-center justify-between border-b border-blue-100 pb-1">
                  <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                    <span>三、面试建议追问要点</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700">
                    初试准备
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  {candidate.interviewAdvice.map((item, idx) => (
                    <div key={idx} className="p-2 rounded bg-white/90 border border-blue-100 shadow-2xs text-[11px] text-slate-800 leading-relaxed flex items-start gap-1.5">
                      <span className="bg-blue-600 text-white font-mono font-bold text-[10px] px-1.5 py-0.5 rounded shrink-0">
                        Q{idx + 1}
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 底部操作卡片 */}
            <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-2xs shrink-0 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>AI 评估准确度：</span>
                <div className="flex items-center gap-1 font-medium">
                  <button
                    onClick={() => onUpdateAiAccuracyFeedback(candidate.id, 'accurate')}
                    className={`px-2 py-0.5 rounded text-[11px] transition-all ${
                      candidate.feedback?.aiAccuracy === 'accurate'
                        ? 'bg-blue-600 text-white font-bold shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    准确
                  </button>
                  <button
                    onClick={() => onUpdateAiAccuracyFeedback(candidate.id, 'too_high')}
                    className={`px-2 py-0.5 rounded text-[11px] transition-all ${
                      candidate.feedback?.aiAccuracy === 'too_high'
                        ? 'bg-blue-600 text-white font-bold shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    偏高
                  </button>
                  <button
                    onClick={() => onUpdateAiAccuracyFeedback(candidate.id, 'too_low')}
                    className={`px-2 py-0.5 rounded text-[11px] transition-all ${
                      candidate.feedback?.aiAccuracy === 'too_low'
                        ? 'bg-blue-600 text-white font-bold shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    偏低
                  </button>
                </div>
              </div>

              {/* 淘汰 / 推进按钮 */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <button
                  onClick={() => onOpenRejectModal(candidate)}
                  className="flex-1 py-1.5 rounded text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
                >
                  淘汰 / 不推进
                </button>

                <button
                  onClick={handlePush}
                  disabled={pushedSuccess}
                  className={`flex-1 py-1.5 rounded text-xs font-semibold text-white transition-all flex items-center justify-center gap-1 ${
                    pushedSuccess
                      ? 'bg-slate-700 cursor-default'
                      : 'bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-2xs'
                  }`}
                >
                  {pushedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>已推进至 Moka</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>推进下一轮面试</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 优雅纸张质感、美观统一的“简历原文”预览模态弹窗 */}
      {showFullResumeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* 模态框顶部 */}
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>简历原文 · {candidate.name}</span>
                    <span className="text-xs font-normal text-slate-500">（{candidate.currentCompany} · {candidate.currentTitle}）</span>
                  </h3>
                  <div className="text-[11px] text-slate-400 mt-0.2">
                    应聘岗位：{job.title} · 初筛综合得分：{candidate.totalScore}分
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyResume}
                  className="px-2.5 py-1 text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors flex items-center gap-1"
                >
                  {copiedResume ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-medium">已复制全文</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>复制全文</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowFullResumeModal(false)}
                  className="w-7 h-7 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors"
                  title="关闭"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 简历原文正文：高对比度、清晰排版与适度呼吸感 */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/40">
              <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-2xs font-sans text-xs sm:text-[13px] text-slate-800 leading-relaxed space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span>电话: <strong className="font-mono text-slate-800">{candidate.phone}</strong></span>
                    <span>学历: <strong className="text-slate-800">{candidate.school} ({candidate.degree})</strong></span>
                    <span>经验: <strong className="text-slate-800">{candidate.workYears}年</strong></span>
                  </div>
                  <span className="text-[11px] text-slate-400">原始文本解析格式</span>
                </div>
                
                <pre className="font-sans whitespace-pre-wrap leading-relaxed text-slate-800 selection:bg-blue-100">
                  {candidate.originalResumeText}
                </pre>
              </div>
            </div>

            {/* 模态框底部操作 */}
            <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span>共解析文本约 {candidate.originalResumeText?.length || 0} 字</span>
              <button
                onClick={() => setShowFullResumeModal(false)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs transition-colors"
              >
                完成浏览并返回
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

