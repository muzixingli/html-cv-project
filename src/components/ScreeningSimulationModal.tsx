import React, { useState, useEffect } from 'react';
import { 
  JobPosition 
} from '../types';
import { 
  Loader2, 
  CheckCircle2, 
  ArrowRight,
  Database,
  Search,
  BarChart2
} from 'lucide-react';

interface ScreeningSimulationModalProps {
  job: JobPosition;
  onFinish: () => void;
  onRunInBackground: () => void;
}

export const ScreeningSimulationModal: React.FC<ScreeningSimulationModalProps> = ({
  job,
  onFinish,
  onRunInBackground,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const totalSimulated = job.config.estimatedRemainCount || 186;

  const PIPELINE_STEPS = [
    {
      id: 'fetch_rules',
      title: '简历拉取与硬规则过滤',
      desc: '拉取有效简历，执行学历/年限与一票否决门槛拦截',
      icon: Database,
    },
    {
      id: 'profile_match',
      title: '岗位画像与履历深度对齐',
      desc: '比对专业技能、架构落地成果与履历稳定性',
      icon: Search,
    },
    {
      id: 'scoring',
      title: '四维量化评分与初筛推荐排序',
      desc: '加权计算四维分值，输出综合得分与面试追问建议',
      icon: BarChart2,
    },
  ];

  // Progression timer
  useEffect(() => {
    const timer = setInterval(() => {
      setProcessedCount(prev => {
        const next = prev + Math.floor(Math.random() * 30) + 20;
        if (next >= totalSimulated) {
          clearInterval(timer);
          return totalSimulated;
        }
        return next;
      });
    }, 350);

    return () => clearInterval(timer);
  }, [totalSimulated]);

  // Step advancement
  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < PIPELINE_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 800);

    return () => clearInterval(stepTimer);
  }, [PIPELINE_STEPS.length]);

  const isComplete = processedCount >= totalSimulated && currentStepIndex === PIPELINE_STEPS.length - 1;
  const progressPercent = Math.min(100, Math.round((processedCount / totalSimulated) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden flex flex-col">
        {/* Modal Top Header - 极简干净 */}
        <div className="p-5 border-b border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-blue-600 flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>初筛评估进行中</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-medium">
              {job.code}
            </span>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">
              正在初筛：{job.title}
            </h2>
            <div className="text-xs text-slate-500 mt-0.5">
              处理进度：{processedCount} / {totalSimulated} 份简历 ({progressPercent}%)
            </div>
          </div>

          {/* 进度条 */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Modal Body: 精简 3 个核心阶段 */}
        <div className="p-4 space-y-2 max-h-[280px] overflow-y-auto">
          {PIPELINE_STEPS.map((step, idx) => {
            const isPast = idx < currentStepIndex || isComplete;
            const isCurrent = idx === currentStepIndex && !isComplete;
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className={`px-3 py-2.5 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-blue-50/50 border-blue-200'
                    : isPast
                    ? 'bg-slate-50/70 border-slate-200'
                    : 'bg-white border-slate-100 opacity-50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-1.5 rounded shrink-0 ${
                    isCurrent
                      ? 'bg-blue-600 text-white'
                      : isPast
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isCurrent ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : isPast ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Icon className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-800">
                      {step.title}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {step.desc}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {isCurrent && (
                    <span className="text-[10px] font-medium text-blue-600">
                      处理中
                    </span>
                  )}
                  {isPast && (
                    <span className="text-[10px] font-medium text-emerald-600">
                      已完成
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onRunInBackground}
            className="px-3 py-1.5 rounded text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            后台运行
          </button>

          <button
            onClick={onFinish}
            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>{isComplete ? '查看初筛结果' : '跳过等待查看'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
