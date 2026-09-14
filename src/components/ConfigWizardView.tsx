import React, { useState } from 'react';
import { 
  JobPosition, 
  JobConfig, 
  DimensionWeights 
} from '../types';
import { 
  ArrowLeft, 
  Sparkles, 
  Database, 
  Plus, 
  X, 
  Check, 
  CheckCircle2, 
  Lightbulb, 
  RotateCcw,
  SlidersHorizontal,
  Users,
  Briefcase
} from 'lucide-react';

interface ConfigWizardViewProps {
  job: JobPosition;
  onCancel: () => void;
  onSaveAndStartScreening: (updatedJob: JobPosition) => void;
  onSaveConfigOnly?: (updatedJob: JobPosition) => void;
}

type StepNumber = 1 | 2 | 3 | 4;

export const ConfigWizardView: React.FC<ConfigWizardViewProps> = ({
  job,
  onCancel,
  onSaveAndStartScreening,
  onSaveConfigOnly,
}) => {
  // Current active step: 1 (JD&隐性要求) -> 2 (来源与硬规则) -> 3 (岗位画像，完全对齐截图) -> 4 (权重与发起)
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);

  // Check if historical config already exists
  const hasHistoricalConfig = Boolean(
    (job.config.originalJd && job.config.originalJd.trim().length > 10) || 
    (job.config.implicitRequirements && job.config.implicitRequirements.trim().length > 5) ||
    job.status === 'completed' || 
    job.status === 'configuring'
  );

  const [dismissHistoryAlert, setDismissHistoryAlert] = useState(false);

  // Editable Profile text representation (matching user screenshot image.png)
  const defaultProfileText = `【角色定位】B 端 SaaS 产品核心研发 + 小组技术负责人，需独立扛事并能带 3-5 人。
【技能硬指标】
- 前端：精通 React 或 Vue 任一 + TypeScript；熟悉 Webpack/Vite 工程化
- 工程：有组件库/CI/CD/性能监控落地经验，能搭体系而非仅使用
- 加分：微前端、复杂数据可视化、性能优化（首屏/运行时）
【经验深度】
- 有 0-1 落地完整项目（非维护型），能在白板讲清架构决策
- 有 B 端中台/中大型产品经验，理解多角色协同
【稳定性】近 3 段工作每段 ≥ 1.5 年，平均在职 ≥ 2 年
【隐性偏好】大厂背景优先；仍能写关键代码，不是纯管理；能扛 KPI`;

  const [profileText, setProfileText] = useState<string>(
    job.config.profile?.targetRoleSummary && job.config.profile.targetRoleSummary.length > 30
      ? `【角色定位】${job.config.profile.targetRoleSummary}\n【技能硬指标】\n- 核心技术栈：${job.config.hardRules.requiredSkills.join('、')}\n- 业务体系能力：有核心微服务与高并发研发经验\n【经验深度】\n- 独立负责核心模块，具备系统架构设计与落地能力\n【稳定性】近 3 年在职稳定，无频繁跳槽\n【隐性偏好】${job.config.implicitRequirements || '大厂背景优先，能扛突击业务'}`
      : defaultProfileText
  );

  // Local draft state
  const [config, setConfig] = useState<JobConfig>({
    ...job.config,
    hardRules: { 
      ...job.config.hardRules, 
      requiredSkills: [...(job.config.hardRules?.requiredSkills || ['Java', 'Spring Cloud', 'MySQL', 'Redis', 'Kafka'])] 
    },
    vetoRules: [...(job.config.vetoRules || ['竞业协议在限期内受限', '未提供学信网真实可查学历', '近1年频繁跳槽大于等于3次'])],
    weights: { ...job.config.weights },
  });

  // UI state for inputs and actions
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newVetoInput, setNewVetoInput] = useState('');
  const [isExtractingRules, setIsExtractingRules] = useState(false);
  const [extractSuccessNotice, setExtractSuccessNotice] = useState(false);
  const [isRegeneratingProfile, setIsRegeneratingProfile] = useState(false);

  // Quick prompt chips for Step 1 (Implicit requirements)
  const quickImplicitTags = [
    '偏好大厂核心业务经历',
    '具备独立从0到1带队经验',
    '要求自驱与高抗压能力',
    '跳槽频率不超过2年1跳',
    '汇报逻辑清晰、复盘习惯好',
    '期望1个月内快速到岗'
  ];

  const handleAddImplicitTag = (tag: string) => {
    if (config.implicitRequirements.includes(tag)) return;
    const separator = config.implicitRequirements.trim() ? '\n• ' : '• ';
    setConfig(prev => ({
      ...prev,
      implicitRequirements: prev.implicitRequirements.trim() + separator + tag
    }));
  };

  // Skill tags operations in Step 2
  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    if (config.hardRules.requiredSkills.includes(newSkillInput.trim())) return;
    setConfig(prev => ({
      ...prev,
      hardRules: {
        ...prev.hardRules,
        requiredSkills: [...prev.hardRules.requiredSkills, newSkillInput.trim()],
      },
    }));
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    setConfig(prev => ({
      ...prev,
      hardRules: {
        ...prev.hardRules,
        requiredSkills: prev.hardRules.requiredSkills.filter(s => s !== skill),
      },
    }));
  };

  // Veto rules operations in Step 2
  const handleAddVeto = () => {
    if (!newVetoInput.trim()) return;
    if (config.vetoRules.includes(newVetoInput.trim())) return;
    setConfig(prev => ({
      ...prev,
      vetoRules: [...prev.vetoRules, newVetoInput.trim()],
    }));
    setNewVetoInput('');
  };

  const handleRemoveVeto = (veto: string) => {
    setConfig(prev => ({
      ...prev,
      vetoRules: prev.vetoRules.filter(v => v !== veto),
    }));
  };

  // HR decides to extract hard rules via AI (用户要求: “已基于上一步 JD 与隐性标准自动识别，这个可以呈现成一个按钮的形式吗？就是让hr决定是否要ai一键识别”)
  const handleAiExtractHardRules = () => {
    setIsExtractingRules(true);
    setTimeout(() => {
      setIsExtractingRules(false);
      setConfig(prev => ({
        ...prev,
        hardRules: {
          minDegree: '本科',
          minYears: 3,
          isFullTimeDegreeOnly: true,
          requiredSkills: ['Java', 'Spring Cloud', 'MySQL', 'Redis', '高并发架构'],
        },
        vetoRules: [
          '竞业协议在限期内受限',
          '未提供学信网真实学历认证',
          '近2年跳槽次数≥3次且无合理解释'
        ]
      }));
      setExtractSuccessNotice(true);
      setTimeout(() => setExtractSuccessNotice(false), 3000);
    }, 600);
  };

  // AI Profile Regenerate (Step 3: 重新生成)
  const handleRegenerateProfile = () => {
    setIsRegeneratingProfile(true);
    setTimeout(() => {
      setIsRegeneratingProfile(false);
      setProfileText(`【角色定位】${job.title} 核心研发骨干 + 模块负责人（基于岗位 JD 与内部团队隐性偏好提炼）
【技能硬指标】
- 核心技术栈：精通主流微服务与高并发架构（消息队列、分布式缓存与分库分表）
- 工程落地：具备高可用业务架构落地与全链路监控排障经验
- 加分项：大促重保压测实战、底层源码调优
【经验深度】
- 具备 0-1 架构或大型系统重构主导经验，技术选型权衡清晰
- 具备跨团队协同驱动能力，非被动接单
【稳定性要求】近 3 段工作平均在职 ≥ 2 年，无半年内频繁跳槽
【内部隐性偏好】大厂/一线独角兽背景优先；自驱抗压；能够承接突发业务重保`);
    }, 600);
  };

  // 手动调节权重：支持以 5% 步长手工精确调节，不强制连动抢占，HR 可手动微调与配平
  const handleWeightChange = (key: keyof DimensionWeights, value: number) => {
    const stepValue = Math.round(value / 5) * 5;
    const clamped = Math.max(0, Math.min(100, stepValue));
    setConfig(prev => ({
      ...prev,
      weights: {
        ...prev.weights,
        [key]: clamped,
      },
    }));
  };

  // 快捷微调单项权重（+5% 或 -5%）
  const adjustWeightStep = (key: keyof DimensionWeights, delta: number) => {
    const current = config.weights[key];
    const updated = Math.max(0, Math.min(100, current + delta));
    setConfig(prev => ({
      ...prev,
      weights: {
        ...prev.weights,
        [key]: updated,
      },
    }));
  };

  // 手动一键配平（将与 100% 的 5% 差额补偿到权重最高项）
  const handleManualBalance = () => {
    const weights = { ...config.weights };
    const currentSum = (Object.values(weights) as number[]).reduce((a, b) => a + b, 0);
    const diff = 100 - currentSum;
    if (diff === 0) return;

    const keys = (Object.keys(weights) as (keyof DimensionWeights)[]).sort((a, b) => weights[b] - weights[a]);
    for (const k of keys) {
      if (weights[k] + diff >= 0) {
        weights[k] += diff;
        break;
      }
    }
    setConfig(prev => ({
      ...prev,
      weights,
    }));
  };

  const setWeightPreset = (preset: 'balanced' | 'skills' | 'experience' | 'stability') => {
    const presets: Record<string, DimensionWeights> = {
      balanced: { skills: 30, experience: 30, stability: 20, education: 20 },
      skills: { skills: 45, experience: 25, stability: 15, education: 15 },
      experience: { skills: 25, experience: 45, stability: 15, education: 15 },
      stability: { skills: 25, experience: 25, stability: 35, education: 15 },
    };
    setConfig(prev => ({
      ...prev,
      weights: presets[preset],
    }));
  };

  // Dynamic estimate of candidate count
  const getEstimatedCounts = () => {
    let basePool = 380;
    if (config.source === 'moka_live') basePool = 190;
    if (config.source === 'talent_pool') basePool = 240;
    if (config.source === 'both') basePool = 430;

    if (config.timeRange === 'last_7_days') basePool = Math.round(basePool * 0.35);
    else if (config.timeRange === 'last_30_days') basePool = Math.round(basePool * 0.65);
    else if (config.timeRange === 'last_90_days') basePool = Math.round(basePool * 0.85);

    let passRate = 0.52;
    if (config.hardRules.minDegree === '硕士') passRate -= 0.15;
    if (config.hardRules.minDegree === '博士') passRate -= 0.25;
    if (config.hardRules.isFullTimeDegreeOnly) passRate -= 0.08;
    if (config.hardRules.minYears >= 5) passRate -= 0.12;
    if (config.hardRules.minYears >= 8) passRate -= 0.2;
    if (config.vetoRules.length > 2) passRate -= 0.05 * config.vetoRules.length;

    passRate = Math.max(0.2, Math.min(0.85, passRate));
    const passed = Math.round(basePool * passRate);
    const rejected = basePool - passed;

    return { total: basePool, passed, rejected, passRate: Math.round(passRate * 100) };
  };

  const estimate = getEstimatedCounts();

  // Save actions
  const handleSaveOnly = () => {
    const updatedJob: JobPosition = {
      ...job,
      status: job.status === 'completed' ? 'completed' : 'configuring',
      config: {
        ...config,
        profile: {
          ...config.profile,
          targetRoleSummary: profileText.split('\n')[0] || job.config.profile.targetRoleSummary,
        },
        estimatedTotalCount: estimate.total,
        estimatedRemainCount: estimate.passed,
      },
    };
    if (onSaveConfigOnly) {
      onSaveConfigOnly(updatedJob);
    }
  };

  const handleLaunchScreening = () => {
    const updatedJob: JobPosition = {
      ...job,
      status: 'screening',
      config: {
        ...config,
        profile: {
          ...config.profile,
          targetRoleSummary: profileText.split('\n')[0] || job.config.profile.targetRoleSummary,
        },
        estimatedTotalCount: estimate.total,
        estimatedRemainCount: estimate.passed,
      },
      screeningProgress: {
        stage: 'fetching_moka',
        stageText: '正在拉取候选人简历并执行硬规则初筛...',
        recalledCount: estimate.passed,
        scoredCount: 0,
        totalCount: estimate.passed,
        percent: 15,
      },
    };
    onSaveAndStartScreening(updatedJob);
  };

  // Stepper definition (clean, non-AI styling matching image.png)
  const steps = [
    { num: 1, label: '岗位 JD & 隐性要求' },
    { num: 2, label: '简历来源 & 硬规则' },
    { num: 3, label: '岗位画像' },
    { num: 4, label: '权重 & 发起' },
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] bg-slate-50 overflow-hidden text-slate-800">
      {/* Top Header & Simple Clear Stepper (Matching user screenshot aesthetic) */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 shrink-0">
        <div className="max-w-6xl mx-auto space-y-2.5">
          {/* Back link & Title */}
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={onCancel}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors mb-1"
              >
                <span>← 返回职位列表</span>
              </button>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>{job.title}</span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-700 font-semibold">
                  {currentStep === 1 && '岗位 JD 与隐性要求'}
                  {currentStep === 2 && '简历来源与硬规则'}
                  {currentStep === 3 && '岗位画像'}
                  {currentStep === 4 && '权重配置 & 发起筛选'}
                </span>
                <span className="text-xs font-normal text-slate-400 font-mono">({job.code})</span>
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveOnly}
                className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded hover:bg-slate-50 transition-colors"
              >
                暂存配置
              </button>
            </div>
          </div>

          {/* Stepper (Exact visual style from user screenshot image.png) */}
          <div className="flex items-center gap-2 sm:gap-3 pt-1 border-t border-slate-100">
            {steps.map((step, idx) => {
              const isCompleted = currentStep > step.num;
              const isCurrent = currentStep === step.num;

              return (
                <React.Fragment key={step.num}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(step.num as StepNumber)}
                    className="flex items-center gap-2 group cursor-pointer focus:outline-none"
                  >
                    {isCompleted ? (
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                        ✓
                      </div>
                    ) : isCurrent ? (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {step.num}
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-medium shrink-0">
                        {step.num}
                      </div>
                    )}
                    <span className={`text-xs ${
                      isCurrent 
                        ? 'font-semibold text-slate-900' 
                        : isCompleted 
                        ? 'text-slate-600 group-hover:text-slate-900' 
                        : 'text-slate-400'
                    }`}>
                      {step.label}
                    </span>
                  </button>

                  {idx < steps.length - 1 && (
                    <div className="w-8 sm:w-14 h-px bg-slate-200 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Step Body: 独立滚动区域，确保内容不挤压且底部操作条始终可见 */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3.5 min-h-0">
        <div className="max-w-6xl mx-auto space-y-3">

          {/* ========================================================================= */}
          {/* STEP 1: 岗位原始 JD 与内部隐形要求 (单独一页) */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-4">
              {/* 极简清晰历史版本提示 (用户要求: 少说几个字看得明显清楚一点) */}
              {hasHistoricalConfig && !dismissHistoryAlert && (
                <div className="flex items-center justify-between px-3 py-1.5 bg-blue-50/70 border border-blue-200/80 rounded-md text-xs text-blue-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="font-semibold">已回填历史配置</span>
                    <span className="text-blue-600 text-[11px]">(可直接编辑修改或进入下一步)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDismissHistoryAlert(true)}
                    className="text-blue-400 hover:text-blue-700"
                    title="关闭"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Two Column Layout: JD on Left, Implicit Requirements on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 1.1 公开 JD */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-900">
                      公开岗位职责与任职要求 (JD)
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setConfig({
                          ...config,
                          originalJd: `岗位职责：\n1. 负责核心微服务架构设计与高并发服务研发，保证系统高可用与稳定性；\n2. 深入理解业务链路，推动技术重构与性能调优；\n3. 指导中初级工程师代码规范与技术进阶。\n\n任职要求：\n1. 本科及以上学历，计算机或相关专业；\n2. 3年以上Java/分布式微服务研发经验，熟练掌握Spring/MySQL/Redis/Kafka；\n3. 具备亿级流量系统实战经验者优先。`
                        });
                      }}
                      className="text-[11px] text-blue-600 hover:text-blue-800"
                    >
                      填入示例
                    </button>
                  </div>

                  <textarea
                    rows={8}
                    value={config.originalJd}
                    onChange={(e) => setConfig({ ...config, originalJd: e.target.value })}
                    placeholder="在此输入或粘贴招聘平台发布的标准岗位职责与任职要求..."
                    className="w-full text-xs font-mono p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50 focus:bg-white text-slate-800 leading-relaxed resize-none"
                  />
                  <div className="text-[11px] text-slate-400 text-right">
                    字数: {config.originalJd.length}
                  </div>
                </div>

                {/* 1.2 内部隐性要求 */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>内部团队用人隐性偏好</span>
                      <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1 py-0.2 rounded">
                        内部专属
                      </span>
                    </div>
                  </div>

                  <textarea
                    rows={6}
                    value={config.implicitRequirements}
                    onChange={(e) => setConfig({ ...config, implicitRequirements: e.target.value })}
                    placeholder="在此输入用人主管内部真实偏好（如：大厂经历、独立带队能力、抗压自驱、期望跳槽频率在2年以上等）..."
                    className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 bg-amber-50/20 focus:bg-white text-slate-800 leading-relaxed resize-none"
                  />

                  {/* Quick Tags */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] text-slate-500">常用隐性要求快捷标签：</div>
                    <div className="flex flex-wrap gap-1.5">
                      {quickImplicitTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleAddImplicitTag(tag)}
                          className="px-2 py-0.5 rounded text-[11px] bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-600 border border-slate-200 transition-colors"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* ========================================================================= */}
          {/* STEP 2: 数据来源与硬规则 (带 AI 识别硬规则按钮 + 预估简历数量) */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {/* 2.1 数据来源 (简洁) */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-blue-600" />
                    <span>简历数据来源</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">投递时间:</span>
                    <select
                      value={config.timeRange}
                      onChange={(e) => setConfig({ ...config, timeRange: e.target.value as any })}
                      className="border border-slate-200 rounded px-2 py-0.5 text-xs bg-slate-50 text-slate-700"
                    >
                      <option value="last_7_days">近 7 天</option>
                      <option value="last_30_days">近 30 天</option>
                      <option value="last_90_days">近 90 天</option>
                      <option value="all">全量历史</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div
                    onClick={() => setConfig({ ...config, source: 'moka_live' })}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      config.source === 'moka_live'
                        ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900">Moka 实时投递</span>
                      <input
                        type="radio"
                        name="source"
                        checked={config.source === 'moka_live'}
                        onChange={() => setConfig({ ...config, source: 'moka_live' })}
                      />
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">评估该岗位最新待处理简历</div>
                  </div>

                  <div
                    onClick={() => setConfig({ ...config, source: 'talent_pool' })}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      config.source === 'talent_pool'
                        ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900">历史人才库召回</span>
                      <input
                        type="radio"
                        name="source"
                        checked={config.source === 'talent_pool'}
                        onChange={() => setConfig({ ...config, source: 'talent_pool' })}
                      />
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">激活过往沉淀的高潜人才库</div>
                  </div>

                  <div
                    onClick={() => setConfig({ ...config, source: 'both' })}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      config.source === 'both'
                        ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-900">双库合并初筛</span>
                        <span className="text-[9px] bg-blue-100 text-blue-700 px-1 rounded font-bold">推荐</span>
                      </div>
                      <input
                        type="radio"
                        name="source"
                        checked={config.source === 'both'}
                        onChange={() => setConfig({ ...config, source: 'both' })}
                      />
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">合并实时投递与人才库，全面覆盖</div>
                  </div>
                </div>
              </div>

              {/* 2.2 硬性规则 (让 HR 决定是否点击 AI 一键提取按钮) */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-900">
                    硬性规则门槛 (不满足直接拦截淘汰)
                  </div>

                  {/* 用户核心要求: 做成按钮形式，让 HR 自主决定是否让 AI 识别 */}
                  <div className="flex items-center gap-2">
                    {extractSuccessNotice && (
                      <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        已提取门槛规则
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={handleAiExtractHardRules}
                      disabled={isExtractingRules}
                      className="px-2.5 py-1 rounded text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className={`w-3.5 h-3.5 text-blue-600 ${isExtractingRules ? 'animate-spin' : ''}`} />
                      <span>{isExtractingRules ? '正在识别提取...' : 'AI 一键从 JD 提取硬规则'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-600">最低学历要求</label>
                    <select
                      value={config.hardRules.minDegree}
                      onChange={(e) => setConfig({
                        ...config,
                        hardRules: { ...config.hardRules, minDegree: e.target.value as any }
                      })}
                      className="w-full text-xs border border-slate-200 rounded px-2.5 py-1.5 bg-slate-50 text-slate-800"
                    >
                      <option value="不限">不限学历</option>
                      <option value="大专">大专及以上</option>
                      <option value="本科">本科及以上</option>
                      <option value="硕士">硕士及以上</option>
                      <option value="博士">博士及以上</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-600">最低工作年限</label>
                    <select
                      value={config.hardRules.minYears}
                      onChange={(e) => setConfig({
                        ...config,
                        hardRules: { ...config.hardRules, minYears: parseInt(e.target.value, 10) }
                      })}
                      className="w-full text-xs border border-slate-200 rounded px-2.5 py-1.5 bg-slate-50 text-slate-800"
                    >
                      <option value={0}>不限经验</option>
                      <option value={1}>1 年及以上</option>
                      <option value={3}>3 年及以上</option>
                      <option value={5}>5 年及以上</option>
                      <option value={8}>8 年及以上</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-600">学历性质限制</label>
                    <div className="flex items-center h-8 px-2.5 bg-slate-50 rounded border border-slate-200">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                        <input
                          type="checkbox"
                          checked={config.hardRules.isFullTimeDegreeOnly}
                          onChange={(e) => setConfig({
                            ...config,
                            hardRules: { ...config.hardRules, isFullTimeDegreeOnly: e.target.checked }
                          })}
                          className="rounded text-blue-600"
                        />
                        <span>仅限统招全日制</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 必修技能标签 */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs text-slate-600">核心必备技能标签 (回车添加)</label>
                  <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200 min-h-9">
                    {config.hardRules.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-white border border-slate-200 text-slate-800 shadow-2xs font-mono"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                      placeholder="+ 输入技能按回车"
                      className="text-xs px-2 py-0.5 bg-transparent focus:outline-none w-32"
                    />
                  </div>
                </div>

                {/* 一票否决规则 */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs text-slate-600">一票否决规则 (触发直接淘汰)</label>
                  <div className="space-y-1.5">
                    {config.vetoRules.map((veto) => (
                      <div
                        key={veto}
                        className="flex items-center justify-between px-3 py-1.5 bg-rose-50/60 border border-rose-100 rounded text-xs text-rose-900"
                      >
                        <span>• {veto}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveVeto(veto)}
                          className="text-rose-400 hover:text-rose-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newVetoInput}
                        onChange={(e) => setNewVetoInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddVeto())}
                        placeholder="输入一票否决项（如：竞业限制、学历造假），回车添加..."
                        className="flex-1 text-xs px-3 py-1.5 border border-slate-200 rounded bg-slate-50 focus:bg-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddVeto}
                        className="px-2.5 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded border border-slate-200"
                      >
                        添加
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2.3 预估简历规模测算 (白底卡片风格，与全站统一) */}
              <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <span>预估简历规模测算</span>
                    <span className="text-[11px] font-normal text-slate-400 ml-1">根据当前来源与硬规则实时测算</span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <span>预计硬规则拦截率:</span>
                    <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/60 text-xs">
                      {100 - estimate.passRate}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/80">
                    <div className="text-[11px] text-slate-500 font-medium">原始待筛简历总池</div>
                    <div className="text-base font-bold font-mono text-slate-900 mt-0.5 flex items-baseline gap-1">
                      <span>{estimate.total}</span>
                      <span className="text-xs font-normal text-slate-400">份</span>
                    </div>
                  </div>

                  <div className="bg-rose-50/40 rounded-lg p-2.5 border border-rose-100">
                    <div className="text-[11px] text-rose-700 font-medium">硬规则拦截过滤</div>
                    <div className="text-base font-bold font-mono text-rose-600 mt-0.5 flex items-baseline gap-1">
                      <span>-{estimate.rejected}</span>
                      <span className="text-xs font-normal text-slate-400">份</span>
                    </div>
                  </div>

                  <div className="bg-blue-50/60 rounded-lg p-2.5 border border-blue-200/80">
                    <div className="text-[11px] text-blue-800 font-medium">预计进入画像打分简历</div>
                    <div className="text-base font-extrabold font-mono text-blue-700 mt-0.5 flex items-baseline gap-1">
                      <span>约 {estimate.passed}</span>
                      <span className="text-xs font-normal text-blue-500">份</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* ========================================================================= */}
          {/* STEP 3: 岗位画像 (完全按用户截图 image.png 极简对齐) */}
          {/* ========================================================================= */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {/* Main 2-Column Layout matching image.png */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* Left Column (5 cols): JD 参考 + 建议在画像中补充 */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Card 1: JD 参考 */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2.5 shadow-2xs">
                    <div className="text-sm font-bold text-slate-900">
                      JD 参考
                    </div>

                    <div className="bg-slate-50/90 rounded-lg p-3 text-xs text-slate-600 font-mono leading-relaxed max-h-52 overflow-y-auto whitespace-pre-wrap border border-slate-100">
                      {config.originalJd.trim() || '(步骤 1 中输入的 JD 内容)'}
                    </div>
                  </div>

                  {/* Card 2: 建议在画像中补充 (Warm Amber box from image.png) */}
                  <div className="bg-amber-50/50 rounded-xl border border-amber-200/90 p-4 space-y-2.5">
                    <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>建议在画像中补充</span>
                    </div>

                    <ul className="text-xs text-amber-800 space-y-2 leading-relaxed">
                      <li className="flex items-start gap-1.5">
                        <span className="text-amber-500">•</span>
                        <span>
                          期望候选人入职 <strong className="font-semibold text-amber-950">3~6 个月</strong> 的关键成果（如：完成组件库 v1、首屏性能提升 30%）
                        </span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-amber-500">•</span>
                        <span>
                          明确"0-1 项目"的判定信号：架构设计文档 / 早期 commit / 团队组建
                        </span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-amber-500">•</span>
                        <span>
                          区分"主导"与"参与"：是否能讲清技术选型权衡
                        </span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-amber-500">•</span>
                        <span>
                          稳定性兜底：实习/兼职不计入平均在职年限
                        </span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-amber-500">•</span>
                        <span>
                          大厂背景用画像权重调节，不做硬过滤
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Right Column (7 cols): AI 生成的岗位画像（可编辑） */}
                <div className="lg:col-span-7">
                  <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-2xs">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div className="space-y-0.5">
                        <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <span>AI 生成的岗位画像（可编辑）</span>
                        </div>
                        <div className="text-[11px] text-blue-600 font-medium">
                          ✨ 已基于公开 JD + 内部团队隐性标准综合提炼生成
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRegenerateProfile}
                        disabled={isRegeneratingProfile}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 border border-blue-200 shadow-2xs shrink-0"
                      >
                        {isRegeneratingProfile ? '重新提炼中...' : '重新生成'}
                      </button>
                    </div>

                    {/* Clean formatted editable textarea */}
                    <textarea
                      rows={11}
                      value={profileText}
                      onChange={(e) => setProfileText(e.target.value)}
                      className="w-full text-xs font-mono p-3.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-slate-800 leading-relaxed resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* ========================================================================= */}
          {/* STEP 4: 权重配置 & 发起筛选 (最后一页) */}
          {/* ========================================================================= */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left (5 cols): Summary of Profile & Screen volume */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                    <div className="text-xs font-bold text-slate-900">
                      初筛任务设定摘要
                    </div>

                    <div className="space-y-2 text-xs text-slate-600">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">评估岗位</span>
                        <span className="font-medium text-slate-800">{job.title}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">简历来源</span>
                        <span className="font-medium text-slate-800">
                          {config.source === 'both' ? '双库合并 (投递 + 人才库)' : config.source === 'moka_live' ? 'Moka 实时投递' : '历史人才库'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">门槛要求</span>
                        <span className="font-medium text-slate-800">
                          {config.hardRules.minDegree} / {config.hardRules.minYears}年+
                          {config.hardRules.isFullTimeDegreeOnly && ' (统招全日制)'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">一票否决规则</span>
                        <span className="font-medium text-rose-600">{config.vetoRules.length} 项</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">预计进入打分简历</span>
                        <span className="font-bold text-emerald-600 text-sm font-mono">约 {estimate.passed} 份</span>
                      </div>
                    </div>
                  </div>

                  {/* Presets */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2 shadow-2xs">
                    <div className="text-xs font-bold text-slate-900">
                      权重快捷方案
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setWeightPreset('balanced')}
                        className="p-2 rounded text-xs text-left border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-colors"
                      >
                        <div className="font-semibold text-slate-800">综合均衡</div>
                        <div className="text-[10px] text-slate-500">技能30 经验30 稳定20 学历20</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setWeightPreset('skills')}
                        className="p-2 rounded text-xs text-left border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-colors"
                      >
                        <div className="font-semibold text-slate-800">侧重技术</div>
                        <div className="text-[10px] text-slate-500">技能45 经验25 稳定15 学历15</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setWeightPreset('experience')}
                        className="p-2 rounded text-xs text-left border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-colors"
                      >
                        <div className="font-semibold text-slate-800">侧重经验</div>
                        <div className="text-[10px] text-slate-500">技能25 经验45 稳定15 学历15</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setWeightPreset('stability')}
                        className="p-2 rounded text-xs text-left border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-colors"
                      >
                        <div className="font-semibold text-slate-800">侧重稳定性</div>
                        <div className="text-[10px] text-slate-500">技能25 经验25 稳定35 学历15</div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right (7 cols): Sliders with manual 5% step adjustment */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          四维评分权重配置
                        </div>
                        <div className="text-[11px] text-slate-500">
                          支持 5% 补偿步长手工调节，可随时按需自由配平
                        </div>
                      </div>
                      
                      {/* 状态徽标与手动配平按钮 */}
                      <div className="flex items-center gap-2">
                        {(() => {
                          const total = (Object.values(config.weights) as number[]).reduce((a, b) => a + b, 0);
                          const isBalanced = total === 100;
                          return (
                            <>
                              <div
                                className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                                  isBalanced
                                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                                    : 'text-amber-700 bg-amber-50 border-amber-300'
                                }`}
                              >
                                总计: {total}% {isBalanced ? '✓' : `(差 ${100 - total}%)`}
                              </div>

                              {!isBalanced && (
                                <button
                                  type="button"
                                  onClick={handleManualBalance}
                                  className="text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded transition-colors shadow-2xs"
                                  title="点击按 5% 差额自动补充至最高权重维度"
                                >
                                  手动配平到100%
                                </button>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Sliders list with 5% step buttons */}
                    <div className="space-y-4">
                      {/* 1. 专业技能 */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800">专业技能匹配度 (Skills)</span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => adjustWeightStep('skills', -5)}
                                className="w-5 h-5 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                                title="减少 5%"
                              >
                                -
                              </button>
                              <button
                                type="button"
                                onClick={() => adjustWeightStep('skills', 5)}
                                className="w-5 h-5 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                                title="增加 5%"
                              >
                                +
                              </button>
                            </div>
                            <span className="font-mono font-bold text-slate-900 w-10 text-right">{config.weights.skills}%</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={5}
                          value={config.weights.skills}
                          onChange={(e) => handleWeightChange('skills', parseInt(e.target.value, 10))}
                          className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* 2. 项目与实战经验 */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800">实战经验与架构成果 (Experience)</span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => adjustWeightStep('experience', -5)}
                                className="w-5 h-5 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                                title="减少 5%"
                              >
                                -
                              </button>
                              <button
                                type="button"
                                onClick={() => adjustWeightStep('experience', 5)}
                                className="w-5 h-5 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                                title="增加 5%"
                              >
                                +
                              </button>
                            </div>
                            <span className="font-mono font-bold text-slate-900 w-10 text-right">{config.weights.experience}%</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={5}
                          value={config.weights.experience}
                          onChange={(e) => handleWeightChange('experience', parseInt(e.target.value, 10))}
                          className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* 3. 履历稳定性 */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800">稳定性与在职连续性 (Stability)</span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => adjustWeightStep('stability', -5)}
                                className="w-5 h-5 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                                title="减少 5%"
                              >
                                -
                              </button>
                              <button
                                type="button"
                                onClick={() => adjustWeightStep('stability', 5)}
                                className="w-5 h-5 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                                title="增加 5%"
                              >
                                +
                              </button>
                            </div>
                            <span className="font-mono font-bold text-slate-900 w-10 text-right">{config.weights.stability}%</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={5}
                          value={config.weights.stability}
                          onChange={(e) => handleWeightChange('stability', parseInt(e.target.value, 10))}
                          className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* 4. 教育背景 */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800">院校专业与学术基础 (Education)</span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => adjustWeightStep('education', -5)}
                                className="w-5 h-5 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                                title="减少 5%"
                              >
                                -
                              </button>
                              <button
                                type="button"
                                onClick={() => adjustWeightStep('education', 5)}
                                className="w-5 h-5 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                                title="增加 5%"
                              >
                                +
                              </button>
                            </div>
                            <span className="font-mono font-bold text-slate-900 w-10 text-right">{config.weights.education}%</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={5}
                          value={config.weights.education}
                          onChange={(e) => handleWeightChange('education', parseInt(e.target.value, 10))}
                          className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 底部固定操作栏：无需滚动页面，直接呈现“下一步”与“上一步” */}
      <div className="bg-white border-t border-slate-200 px-6 py-2.5 shrink-0 z-20 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentStep === 1 ? (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              ← 返回职位列表
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep - 1) as StepNumber)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
            >
              ← 上一步：{steps[currentStep - 2]?.label}
            </button>
          )}
        </div>

        {/* 中间：轻量进度与实时预估提示 */}
        <div className="hidden sm:flex items-center gap-2.5 text-xs text-slate-500">
          <span className="font-medium text-slate-700">步骤 {currentStep}/4：{steps[currentStep - 1]?.label}</span>
          <span className="text-slate-300">|</span>
          <span className="text-blue-700 font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
            预计初筛简历：约 {estimate.passed} 份
          </span>
        </div>

        {/* 右侧：操作按钮 */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSaveOnly}
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            暂存配置
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep + 1) as StepNumber)}
              className="px-5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>下一步：{steps[currentStep]?.label}</span>
              <span>➜</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLaunchScreening}
              className="px-5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>🚀 立即发起初筛 (评估约 {estimate.passed} 份简历)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
