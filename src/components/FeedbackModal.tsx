import React, { useState } from 'react';
import { Candidate, CandidateFeedback } from '../types';
import { FEEDBACK_REASONS_MAP } from '../mockData';
import { 
  X, 
  AlertCircle, 
  Check, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  ShieldAlert,
  Send
} from 'lucide-react';

interface FeedbackModalProps {
  candidate: Candidate;
  onClose: () => void;
  onSubmitFeedback: (candidateId: string, feedback: CandidateFeedback) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  candidate,
  onClose,
  onSubmitFeedback,
}) => {
  const primaryCategories = Object.keys(FEEDBACK_REASONS_MAP);
  const [selectedPrimary, setSelectedPrimary] = useState<string>(primaryCategories[0]);
  const [selectedSecondary, setSelectedSecondary] = useState<string>(
    FEEDBACK_REASONS_MAP[primaryCategories[0]][0] || ''
  );
  const [customNotes, setCustomNotes] = useState<string>('');
  const [aiAccuracy, setAiAccuracy] = useState<'accurate' | 'too_high' | 'too_low'>('accurate');

  const handlePrimaryChange = (primary: string) => {
    setSelectedPrimary(primary);
    const subList = FEEDBACK_REASONS_MAP[primary] || [];
    setSelectedSecondary(subList[0] || '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const feedbackData: CandidateFeedback = {
      primaryReason: selectedPrimary,
      secondaryReason: selectedSecondary,
      notes: customNotes.trim(),
      aiAccuracy,
      feedbackTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    onSubmitFeedback(candidate.id, feedbackData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                不推进决策反馈 · {candidate.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                反馈将沉淀至内部人才库并反哺 AI 初筛画像模型
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* 1. Level-1 Primary Reason (一级标签) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>一级原因分类 (单选)</span>
              <span className="text-[11px] text-rose-600 font-normal">* 必选</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {primaryCategories.map(cat => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => handlePrimaryChange(cat)}
                  className={`p-2.5 rounded-lg text-xs font-medium text-left transition-all border ${
                    selectedPrimary === cat
                      ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold ring-2 ring-rose-500/10'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Level-2 Secondary Reason (二级标签) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>二级细分标签 (单选/多选推荐)</span>
              <span className="text-[11px] text-slate-400 font-normal">根据一级分类联动</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {(FEEDBACK_REASONS_MAP[selectedPrimary] || []).map(sub => (
                <button
                  type="button"
                  key={sub}
                  onClick={() => setSelectedSecondary(sub)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    selectedSecondary === sub
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Free-form manual text (手动填写原因) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>其他具体补充说明 (可打字输入)</span>
              <span className="text-[11px] text-slate-400 font-normal">选填</span>
            </label>
            <textarea
              rows={3}
              value={customNotes}
              onChange={e => setCustomNotes(e.target.value)}
              placeholder="请输入您在复核简历或电话摸底时的具体观察，例如：期望薪资偏高且不接受期权、当前项目复杂度偏低等..."
              className="w-full text-xs p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed"
            />
          </div>

          {/* 4. AI Accuracy Feedback (反馈是否准确) */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-800">
              您认为 AI 本次初筛打分与总结是否准确？
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="accuracy"
                  checked={aiAccuracy === 'accurate'}
                  onChange={() => setAiAccuracy('accurate')}
                  className="text-blue-600"
                />
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                  基本准确
                </span>
              </label>

              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="accuracy"
                  checked={aiAccuracy === 'too_high'}
                  onChange={() => setAiAccuracy('too_high')}
                  className="text-blue-600"
                />
                <span className="flex items-center gap-1">
                  <ThumbsDown className="w-3.5 h-3.5 text-amber-600" />
                  打分虚高
                </span>
              </label>

              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="accuracy"
                  checked={aiAccuracy === 'too_low'}
                  onChange={() => setAiAccuracy('too_low')}
                  className="text-blue-600"
                />
                <span className="flex items-center gap-1">
                  <ThumbsDown className="w-3.5 h-3.5 text-rose-600" />
                  误杀偏低
                </span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>确认提交反馈并淘汰</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
