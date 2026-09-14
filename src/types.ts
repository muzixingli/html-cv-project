export type JobStatus = 'idle' | 'configuring' | 'screening' | 'completed';

export interface HardRules {
  minDegree: '不限' | '大专' | '本科' | '硕士' | '博士';
  isFullTimeDegreeOnly: boolean;
  minYears: number;
  maxYears?: number;
  ageRange: [number, number];
  requiredSkills: string[];
}

export interface JobProfile {
  targetRoleSummary: string;
  coreDeliverables3to6Months: string[];
  keyCompetencies: string[];
  softSkills: string[];
  bonusPoints: string[];
  cultureFitNotes: string;
}

export interface DimensionWeights {
  education: number; // 学历权重 %
  skills: number;    // 技能权重 %
  stability: number; // 稳定性权重 %
  experience: number;// 经验权重 %
}

export interface JobConfig {
  source: 'moka_live' | 'talent_pool' | 'both';
  timeRange: 'last_7_days' | 'last_30_days' | 'last_90_days' | 'all';
  originalJd: string;
  implicitRequirements: string;
  hardRules: HardRules;
  vetoRules: string[];
  estimatedTotalCount: number;
  estimatedRemainCount: number;
  profile: JobProfile;
  weights: DimensionWeights;
}

export interface ScreeningProgress {
  stage: 'idle' | 'fetching_moka' | 'vector_embedding' | 'dual_retrieval' | 'rrf_reranking' | 'dimension_scoring' | 'completed';
  stageText: string;
  recalledCount: number;
  scoredCount: number;
  totalCount: number;
  percent: number;
}

export interface JobPosition {
  id: string;
  code: string;
  title: string;
  department: string;
  recruiter: string;
  headCount: number;
  urgency: 'high' | 'medium' | 'normal';
  status: JobStatus;
  screeningProgress?: ScreeningProgress;
  config: JobConfig;
  lastRunAt?: string;
  stats?: {
    total: number;
    passed: number;
    rejected: number;
    avgScore: number;
  };
}

export interface DimensionScoreDetail {
  score: number;
  weightApplied: number;
  rationale: string;
  evidenceQuotes: string[];
}

export interface CandidateFeedback {
  primaryReason: string;
  secondaryReason: string;
  notes: string;
  aiAccuracy: 'accurate' | 'too_high' | 'too_low';
  feedbackTime: string;
}

export interface Candidate {
  id: string;
  jobId: string;
  sourceType: 'moka_live' | 'talent_pool';
  name: string;
  gender: '男' | '女';
  age: number;
  avatar: string;
  phone: string;
  email: string;
  city: string;
  currentCompany: string;
  currentTitle: string;
  degree: string;
  school: string;
  is985211: boolean;
  major: string;
  workYears: number;
  
  // AI 评分与重排
  totalScore: number;
  rrfRank: number;
  vectorSimilarity: number;
  keywordMatchScore: number;
  scores: {
    education: DimensionScoreDetail;
    skills: DimensionScoreDetail;
    stability: DimensionScoreDetail;
    experience: DimensionScoreDetail;
  };
  
  aiSummary: string;
  highlights: string[];
  gapsOrRisks: string[];
  interviewAdvice: string[];
  matchTags: string[];
  originalResumeText: string;
  
  status: 'pending' | 'pushed_to_moka' | 'rejected';
  feedback?: CandidateFeedback;
}

export interface ScreeningHistoryRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  department: string;
  batchNo: string;
  triggerTime: string;
  source: 'Moka 实时投递' | '历史人才库' | '双库合并拉取';
  totalScreened: number;
  passedCount: number;
  rejectedCount: number;
  avgScore: number;
  weights: DimensionWeights;
  hardRuleSummary: string;
  operator: string;
  status: 'completed' | 'screening';
}
