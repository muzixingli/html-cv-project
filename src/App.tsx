/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  JobPosition, 
  Candidate, 
  ScreeningHistoryRecord, 
  CandidateFeedback 
} from './types';
import { 
  INITIAL_JOBS, 
  MOCK_CANDIDATES, 
  MOCK_HISTORY_RECORDS 
} from './mockData';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { JobListView } from './components/JobListView';
import { ConfigWizardView } from './components/ConfigWizardView';
import { ScreeningResultsView } from './components/ScreeningResultsView';
import { CandidateDetailView } from './components/CandidateDetailView';
import { HistoryRecordsView } from './components/HistoryRecordsView';
import { JobHistoryModal } from './components/JobHistoryModal';
import { FeedbackModal } from './components/FeedbackModal';
import { ScreeningSimulationModal } from './components/ScreeningSimulationModal';
import { ImNotificationModal } from './components/ImNotificationModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Navigation tabs:
  // - 'jobs': Screen 1
  // - 'config_wizard': Screens 2, 3, 4
  // - 'results': Screen 5
  // - 'candidate_detail': Screen 6
  // - 'history': Extra requested audit view
  const [currentTab, setCurrentTab] = useState<
    'jobs' | 'config_wizard' | 'results' | 'candidate_detail' | 'history'
  >('jobs');

  // Application Data States
  const [jobs, setJobs] = useState<JobPosition[]>(INITIAL_JOBS);
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [historyRecords, setHistoryRecords] = useState<ScreeningHistoryRecord[]>(MOCK_HISTORY_RECORDS);

  // Active Selections
  const [selectedJobId, setSelectedJobId] = useState<string>('job-01');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('cand-01');

  // Modals & Interactive Overlays
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSimulatingScreening, setIsSimulatingScreening] = useState<boolean>(false);
  const [rejectModalCandidate, setRejectModalCandidate] = useState<Candidate | null>(null);
  const [showImModal, setShowImModal] = useState<boolean>(false);
  const [historyModalJob, setHistoryModalJob] = useState<JobPosition | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Active Job & Candidate derived objects
  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0];
  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId) || candidates[0];
  const activeScreeningCount = jobs.filter(j => j.status === 'screening').length;

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Reset Mock Data
  const handleResetMock = () => {
    setJobs(INITIAL_JOBS);
    setCandidates(MOCK_CANDIDATES);
    setHistoryRecords(MOCK_HISTORY_RECORDS);
    showToast('已重置全部职位与候选人测试数据', 'info');
  };

  // 1. Navigation Actions
  const handleStartConfig = (job: JobPosition) => {
    setSelectedJobId(job.id);
    setCurrentTab('config_wizard');
  };

  const handleViewResults = (job: JobPosition) => {
    setSelectedJobId(job.id);
    setCurrentTab('results');
  };

  const handleSelectCandidate = (cand: Candidate) => {
    setSelectedCandidateId(cand.id);
    setCurrentTab('candidate_detail');
  };

  const handleViewHistory = (jobId?: string) => {
    if (jobId) {
      setSelectedJobId(jobId);
    }
    setCurrentTab('history');
  };

  // 2. Screening Actions (From Step 4 to Execution)
  const handleSaveAndStartScreening = (updatedJob: JobPosition) => {
    // Update job status to 'screening'
    setJobs(prev => prev.map(j => (j.id === updatedJob.id ? updatedJob : j)));
    setSelectedJobId(updatedJob.id);
    // Show real-time simulation modal
    setIsSimulatingScreening(true);
  };

  const handleFinishSimulation = () => {
    setIsSimulatingScreening(false);
    // Update job to completed
    const batchId = `BATCH-${new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12)}`;
    const triggerTime = new Date().toISOString().replace('T', ' ').slice(0, 19);

    setJobs(prev =>
      prev.map(j => {
        if (j.id === selectedJobId) {
          return {
            ...j,
            status: 'completed',
            lastRunAt: triggerTime,
            stats: {
              total: j.config.estimatedRemainCount || 186,
              passed: 24,
              rejected: (j.config.estimatedRemainCount || 186) - 24,
              avgScore: 78.5,
            },
          };
        }
        return j;
      })
    );

    // Append to audit history
    const newRecord: ScreeningHistoryRecord = {
      id: `hist-${Date.now()}`,
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      department: selectedJob.department,
      batchNo: batchId,
      triggerTime,
      source: selectedJob.config.source === 'both' ? '双库合并拉取' : selectedJob.config.source === 'moka_live' ? 'Moka 实时投递' : '历史人才库',
      totalScreened: selectedJob.config.estimatedRemainCount || 186,
      passedCount: 24,
      rejectedCount: (selectedJob.config.estimatedRemainCount || 186) - 24,
      avgScore: 78.5,
      weights: { ...selectedJob.config.weights },
      hardRuleSummary: `${selectedJob.config.hardRules.minDegree} | ${selectedJob.config.hardRules.minYears}年+ | ${selectedJob.config.vetoRules.length}项否决`,
      operator: '林晓涵 (当前HR)',
      status: 'completed',
    };
    setHistoryRecords(prev => [newRecord, ...prev]);

    showToast(`初筛评估完成！已生成 ${selectedJob.title} 的智能推荐榜单与量化报告`);
    setCurrentTab('results');
  };

  const handleRunInBackground = () => {
    setIsSimulatingScreening(false);
    showToast('初筛任务已转入后台分布式集群运行，可在看板实时查看召回进度', 'info');
    setCurrentTab('jobs');
  };

  // 3. Flow decisions: Push to Moka
  const handlePushToMoka = (candidateId: string) => {
    setCandidates(prev =>
      prev.map(c => (c.id === candidateId ? { ...c, status: 'pushed_to_moka' } : c))
    );
    const cand = candidates.find(c => c.id === candidateId);
    showToast(`已成功将候选人【${cand?.name || '候选人'}】推送到 Moka 招聘系统业务初面阶段！`);
  };

  // 4. Flow decisions: Reject Feedback (Screen 7)
  const handleOpenRejectModal = (candidate: Candidate) => {
    setRejectModalCandidate(candidate);
  };

  const handleSubmitRejectFeedback = (candidateId: string, feedback: CandidateFeedback) => {
    setCandidates(prev =>
      prev.map(c => (c.id === candidateId ? { ...c, status: 'rejected', feedback } : c))
    );
    setRejectModalCandidate(null);
    const cand = candidates.find(c => c.id === candidateId);
    showToast(`已归档候选人【${cand?.name || '候选人'}】的不推进多级反馈，并记录模型负样本`, 'info');
  };

  // 5. Accuracy Feedback
  const handleUpdateAiAccuracy = (
    candidateId: string,
    accuracy: 'accurate' | 'too_high' | 'too_low'
  ) => {
    setCandidates(prev =>
      prev.map(c => {
        if (c.id === candidateId) {
          return {
            ...c,
            feedback: {
              primaryReason: c.feedback?.primaryReason || '常规校准',
              secondaryReason: c.feedback?.secondaryReason || '打分校准',
              notes: c.feedback?.notes || '',
              aiAccuracy: accuracy,
              feedbackTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
            },
          };
        }
        return c;
      })
    );
    showToast(
      accuracy === 'accurate'
        ? '已收到反馈：该候选人 AI 打分准确'
        : accuracy === 'too_high'
        ? '已收到反馈：标记打分偏高，将校准权重模型'
        : '已收到反馈：标记打分偏低，将校准特征召回',
      'info'
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 text-slate-900 font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-2xl border border-slate-700 animate-in slide-in-from-top-4 duration-200">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-blue-400 shrink-0" />
          )}
          <span className="text-xs font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* Global Sidebar (Drawer / Entry Point) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentTab={currentTab}
        setCurrentTab={tab => {
          setCurrentTab(tab);
          setIsSidebarOpen(false);
        }}
        selectedJobTitle={selectedJob?.title}
        activeScreeningCount={activeScreeningCount}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Global Navbar */}
        <Navbar
          currentTab={currentTab}
          selectedJobTitle={selectedJob?.title}
          onRefreshMock={handleResetMock}
          onOpenImSimulation={() => setShowImModal(true)}
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          onSelectTab={tab => setCurrentTab(tab)}
        />

        {/* View Switcher based on currentTab */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Screen 1: Job List Dashboard */}
          {currentTab === 'jobs' && (
            <JobListView
              jobs={jobs}
              onStartConfig={handleStartConfig}
              onViewResults={handleViewResults}
              onViewHistory={jobId => {
                const j = jobs.find(x => x.id === jobId) || selectedJob;
                setHistoryModalJob(j);
              }}
              onOpenJobHistory={job => setHistoryModalJob(job)}
              onQuickRunScreening={handleSaveAndStartScreening}
            />
          )}

          {/* Screens 2, 3, 4: Configuration Wizard (Now single-page: JD + Implicit standard on left, AI generated internal blueprint/scoring criteria on right) */}
          {currentTab === 'config_wizard' && (
            <ConfigWizardView
              job={selectedJob}
              onCancel={() => setCurrentTab('jobs')}
              onSaveAndStartScreening={handleSaveAndStartScreening}
              onSaveConfigOnly={updatedJob => {
                setJobs(prev => prev.map(j => (j.id === updatedJob.id ? updatedJob : j)));
                showToast(`已保存【${updatedJob.title}】的岗位画像与打分依据`);
              }}
            />
          )}

          {/* Screen 5: Screening Results List */}
          {currentTab === 'results' && (
            <ScreeningResultsView
              job={selectedJob}
              candidates={candidates}
              onBackToJobs={() => setCurrentTab('jobs')}
              onSelectCandidate={handleSelectCandidate}
              onQuickPushToMoka={handlePushToMoka}
              onOpenRejectFeedbackModal={handleOpenRejectModal}
              onOpenConfig={handleStartConfig}
              onOpenHistory={job => setHistoryModalJob(job)}
            />
          )}

          {/* Screen 6: Candidate In-Depth Detail */}
          {currentTab === 'candidate_detail' && (
            <CandidateDetailView
              candidate={selectedCandidate}
              job={selectedJob}
              onBack={() => setCurrentTab('results')}
              onPushToMoka={handlePushToMoka}
              onOpenRejectModal={handleOpenRejectModal}
              onUpdateAiAccuracyFeedback={handleUpdateAiAccuracy}
            />
          )}

          {/* Extra View: Audit & History Log */}
          {currentTab === 'history' && (
            <HistoryRecordsView
              historyRecords={historyRecords}
              jobs={jobs}
              onViewBatchResults={jobId => {
                setSelectedJobId(jobId);
                setCurrentTab('results');
              }}
              onReuseConfig={jobId => {
                setSelectedJobId(jobId);
                setCurrentTab('config_wizard');
              }}
              onBackToJobs={() => setCurrentTab('jobs')}
            />
          )}
        </main>
      </div>

      {/* By-Job History Modal (按岗位回溯该岗位的所有历史批次，满足用户要求) */}
      {historyModalJob && (
        <JobHistoryModal
          job={historyModalJob}
          historyRecords={historyRecords}
          onClose={() => setHistoryModalJob(null)}
          onViewBatchResults={(jobId, batchNo) => {
            setSelectedJobId(jobId);
            setHistoryModalJob(null);
            showToast(`已切换至【${historyModalJob.title}】历史批次 ${batchNo}`);
            setCurrentTab('results');
          }}
          onReuseConfig={jobId => {
            setSelectedJobId(jobId);
            setHistoryModalJob(null);
            setCurrentTab('config_wizard');
          }}
        />
      )}

      {/* Screen 7 Modal: Rejection Reason Collector */}
      {rejectModalCandidate && (
        <FeedbackModal
          candidate={rejectModalCandidate}
          onClose={() => setRejectModalCandidate(null)}
          onSubmitFeedback={handleSubmitRejectFeedback}
        />
      )}

      {/* Pipeline Simulation Modal */}
      {isSimulatingScreening && (
        <ScreeningSimulationModal
          job={selectedJob}
          onFinish={handleFinishSimulation}
          onRunInBackground={handleRunInBackground}
        />
      )}

      {/* Internal IM Notification Simulation Modal */}
      {showImModal && (
        <ImNotificationModal
          candidates={candidates}
          job={selectedJob}
          onClose={() => setShowImModal(false)}
          onSelectCandidate={cand => {
            setSelectedCandidateId(cand.id);
            setCurrentTab('candidate_detail');
          }}
          onPushToMoka={handlePushToMoka}
        />
      )}
    </div>
  );
}
