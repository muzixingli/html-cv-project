import React from 'react';
import { Candidate, JobPosition } from '../types';
import { 
  X, 
  Send, 
  CheckCircle2, 
  XCircle, 
  Bot, 
  ExternalLink, 
  MessageSquare,
  Sparkles,
  Layers
} from 'lucide-react';

interface ImNotificationModalProps {
  candidates: Candidate[];
  job: JobPosition;
  onClose: () => void;
  onSelectCandidate: (candidate: Candidate) => void;
  onPushToMoka: (candidateId: string) => void;
}

export const ImNotificationModal: React.FC<ImNotificationModalProps> = ({
  candidates,
  job,
  onClose,
  onSelectCandidate,
  onPushToMoka,
}) => {
  const topCandidates = candidates.filter(c => c.jobId === job.id).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-100 rounded-2xl max-w-lg w-full border border-slate-300 shadow-2xl overflow-hidden flex flex-col">
        {/* IM Window Header */}
        <div className="bg-slate-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>AI 智筛助手 · 招聘协同群</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                  机器人
                </span>
              </div>
              <div className="text-[10px] text-slate-400">企业微信 / 飞书 协同通道</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* IM Message Feed */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Timestamp */}
          <div className="text-center text-[10px] text-slate-400 font-mono">
            今天 10:30 · 自动推送
          </div>

          {/* Bot Push Card */}
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-xs">
              AI
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm p-4 border border-slate-200 shadow-sm space-y-3 flex-1 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>【新批次简历初筛就绪提醒】</span>
                </div>
                <span className="text-[10px] text-slate-400">来自 AI 智筛助手</span>
              </div>

              <div className="text-slate-600 leading-relaxed">
                HR 您好！已基于 <strong>{job.title}</strong> 的立体画像与四维权重，完成对 Moka 投递简历的智能初筛与推荐排序，筛选出以下高匹配候选人，可在 IM 内快速预览：
              </div>

              {/* Candidate Quick Cards inside IM */}
              <div className="space-y-2.5">
                {topCandidates.map(cand => (
                  <div
                    key={cand.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{cand.name}</span>
                        <span className="text-[11px] text-slate-500">
                          {cand.currentCompany} · {cand.workYears}年
                        </span>
                      </div>
                      <span className="font-mono font-bold text-emerald-600 text-sm">
                        {cand.totalScore}分
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 line-clamp-1">
                      {cand.highlights[0] || cand.aiSummary}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <button
                        onClick={() => {
                          onClose();
                          onSelectCandidate(cand);
                        }}
                        className="text-[11px] text-blue-600 font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>查看四维评分依据与简历</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>

                      {cand.status === 'pushed_to_moka' ? (
                        <span className="text-[10px] text-emerald-600 font-medium">✓ 已推 Moka</span>
                      ) : (
                        <button
                          onClick={() => onPushToMoka(cand.id)}
                          className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold"
                        >
                          推入 Moka
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[10px] text-slate-400 text-center pt-1">
                点击卡片可查看完整归因证据链并回传 Moka 招聘流转系统
              </div>
            </div>
          </div>
        </div>

        {/* IM Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>企业 IM 机器人推送状态：正常实时同步</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-300"
          >
            关闭预览
          </button>
        </div>
      </div>
    </div>
  );
};
