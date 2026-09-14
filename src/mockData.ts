import { JobPosition, Candidate, ScreeningHistoryRecord } from './types';

export const INITIAL_JOBS: JobPosition[] = [
  {
    id: 'job-01',
    code: 'RD-2026-089',
    title: '资深后端开发架构师 (Go / 微服务)',
    department: '基础平台与架构部',
    recruiter: '林晓涵 (当前HR)',
    headCount: 2,
    urgency: 'high',
    status: 'completed',
    lastRunAt: '2026-09-14 09:20',
    stats: {
      total: 186,
      passed: 24,
      rejected: 162,
      avgScore: 78.5,
    },
    config: {
      source: 'both',
      timeRange: 'last_30_days',
      originalJd: `【岗位职责】
1. 负责核心高并发、高可用微服务底座架构设计与演进，保障亿级日活场景系统稳定；
2. 主导多活容灾、分布式事务、高性能RPC与服务网格(Service Mesh)关键技术攻关；
3. 协助业务团队解决高并发性能瓶颈、内存泄漏、分布式死锁等疑难问题；
4. 推进DevOps自动化流水线与可观测性系统(Tracing/Metrics/Logging)落地。

【任职要求】
1. 本科及以上学历，计算机或软件工程相关专业，5年以上Golang开发经验；
2. 具备至少千万级QPS或海量数据分布式系统实际架构落地经验；
3. 熟练掌握K8s、Docker容器化生态，精通Kafka/Pulsar、Redis高可用集群方案；
4. 逻辑清晰，具备良好的技术领导力与跨团队协同推进能力。`,
      implicitRequirements: '优先考虑一线互联网大厂核心中台架构背景；沟通敏捷且务实，抗压能力强；期望近3年跳槽不超过1次。',
      hardRules: {
        minDegree: '本科',
        isFullTimeDegreeOnly: true,
        minYears: 5,
        maxYears: 12,
        ageRange: [27, 36],
        requiredSkills: ['Golang', '高并发微服务', '分布式系统', 'Kubernetes/容器'],
      },
      vetoRules: [
        '近2年连续跳槽且单段工期不足10个月',
        '非统招全日制本科学历（学信网可查）',
        '无千万级以上高并发或分布式系统实战经验',
      ],
      estimatedTotalCount: 380,
      estimatedRemainCount: 186,
      profile: {
        targetRoleSummary: '能独立扛起亿级流量微服务底座演进的实战型技术架构师，兼备扎实算法内功与生产突发故障排障敏锐度。',
        coreDeliverables3to6Months: [
          '第1~2个月：快速熟悉现有订单与支付微服务拓扑，完成核心网关吞吐提升30%的性能重构专项',
          '第3~4个月：落地新一代Service Mesh灰度与全链路压测体系，缩短故障定位时长至5分钟以内',
          '第5~6个月：带领4人攻坚小组完成跨机房多活架构演进原型，输出架构设计RFC规范',
        ],
        keyCompetencies: ['分布式系统高可用设计', 'Go运行时深度调优', '海量数据并发处理', '突发高负载容灾'],
        softSkills: ['极强技术说服力', 'OWNER攻坚精神', '高压下冷静决策', '文档规范与知识沉淀'],
        bonusPoints: ['拥有知名开源项目核心贡献者(Committer)经历', '头部大厂P7+/T8技术专家背景', 'ACM或顶尖算法竞赛获奖者'],
        cultureFitNotes: '务实求真，杜绝纸上谈兵；乐于通过代码复核(Code Review)与分享带领团队共同成长。',
      },
      weights: {
        skills: 40,
        experience: 30,
        stability: 15,
        education: 15,
      },
    },
  },
  {
    id: 'job-02',
    code: 'PD-2026-042',
    title: 'AI Native 商业化产品专家',
    department: '生成式AI应用产品部',
    recruiter: '林晓涵 (当前HR)',
    headCount: 1,
    urgency: 'high',
    status: 'screening',
    screeningProgress: {
      stage: 'dual_retrieval',
      stageText: '简历经历深度匹配与多维综合评分中...',
      recalledCount: 142,
      scoredCount: 68,
      totalCount: 220,
      percent: 62,
    },
    lastRunAt: '2026-09-14 10:15',
    config: {
      source: 'moka_live',
      timeRange: 'last_7_days',
      originalJd: `【岗位职责】
1. 负责大模型与生成式AI在企业级SaaS场景商业化产品的落地规划与商业模式闭环；
2. 深度结合用户交互(Copilot/Agent)体验，探索从提示词工程到复杂工作流的商业变现路径；
3. 与算法团队配合制定Prompt评估与评测指标，确保模型在垂直场景体验稳定性；
4. 协同销售、客户成功团队推进种子企业客户试用并打通ARR续费转化。`,
      implicitRequirements: '有成功跑通AI商业化ARR变现落地经验；对Agent工作流与用户心智有深刻认知；有创业团队或大厂孵化业务从0到1经验。',
      hardRules: {
        minDegree: '本科',
        isFullTimeDegreeOnly: true,
        minYears: 3,
        maxYears: 8,
        ageRange: [25, 35],
        requiredSkills: ['AI产品设计', '商业化策略', '大模型Agent', 'B端SaaS'],
      },
      vetoRules: [
        '无任何AI/大模型相关产品实操经历',
        '纯C端纯内容运营背景且缺乏B端商业化变现理解',
      ],
      estimatedTotalCount: 220,
      estimatedRemainCount: 96,
      profile: {
        targetRoleSummary: '既懂生成式AI边界又能算清ROI的产品操盘手，兼具技术敏锐度与商业变现洞察力。',
        coreDeliverables3to6Months: [
          '首月完成企业内测版AI工作流商业定价方案与计费漏斗搭建',
          '3个月内达成首批50家高客单企业客户留存与转付费，客户满意度≥88分',
          '梳理标准化产品售前白皮书与客户实施交付指南',
        ],
        keyCompetencies: ['商业敏感度与定价策略', 'LLM能力边界认知', 'B端复杂工作流抽象', '数据驱动迭代'],
        softSkills: ['客户同理心', '敏锐的市场嗅觉', '跨算法/工程的高效同频沟通'],
        bonusPoints: ['独立主导过年ARR超千万元级别AI SaaS产品', '有知名开源模型社区影响力'],
        cultureFitNotes: '激情开放，享受与未知技术前沿快速共舞。',
      },
      weights: {
        skills: 35,
        experience: 35,
        stability: 15,
        education: 15,
      },
    },
  },
  {
    id: 'job-03',
    code: 'DS-2026-015',
    title: '高级 UI/UX 设计专家 (Design System)',
    department: '用户体验设计中心',
    recruiter: '林晓涵 (当前HR)',
    headCount: 1,
    urgency: 'normal',
    status: 'configuring',
    config: {
      source: 'both',
      timeRange: 'last_30_days',
      originalJd: `【岗位职责】
1. 主导企业级中后台复杂设计系统(Design System)规范制定、多端组件库搭建与维护；
2. 负责B端商业化矩阵产品核心操作流程的高保真体验设计与可用性测试；
3. 与前端工程团队紧密合作推进Token化标准与自动化设计走查工具落地。`,
      implicitRequirements: '要求附带成熟上线中后台作品集链接；具备极强排版规范与微交互设计功底；熟悉Figma变量组件生态。',
      hardRules: {
        minDegree: '大专',
        isFullTimeDegreeOnly: false,
        minYears: 4,
        maxYears: 10,
        ageRange: [24, 38],
        requiredSkills: ['Design System', 'Figma', 'B端中后台交互', '设计走查'],
      },
      vetoRules: [
        '无任何B端复杂系统或组件库设计实际作品集',
      ],
      estimatedTotalCount: 160,
      estimatedRemainCount: 88,
      profile: {
        targetRoleSummary: '兼顾像素级审美与宏观系统思维的资深体验设计师，能建立标准化设计资产护城河。',
        coreDeliverables3to6Months: [
          '统一5款中后台子产品的设计语言，重构Design Tokens规范',
          '联合前端发布3.0通用组件库，减少产研交付走查沟通成本40%',
        ],
        keyCompetencies: ['组件库架构与规范化', '复杂B端链路降噪', '视觉层级把控', '前端实现边界认知'],
        softSkills: ['同理心', '清晰的设计陈述答辩能力', '推敲细节的耐心'],
        bonusPoints: ['知名设计社区推荐设计师', '熟悉CSS/HTML/Tailwind代码落地逻辑'],
        cultureFitNotes: '对美与秩序有极致执着，善于通过规范赋能他人。',
      },
      weights: {
        skills: 45,
        experience: 25,
        stability: 15,
        education: 15,
      },
    },
  },
  {
    id: 'job-04',
    code: 'SL-2026-102',
    title: '大客户商业化销售总监 (KA Sales)',
    department: '企业大客户事业部',
    recruiter: '林晓涵 (当前HR)',
    headCount: 2,
    urgency: 'high',
    status: 'idle',
    config: {
      source: 'talent_pool',
      timeRange: 'all',
      originalJd: `【岗位职责】
1. 聚焦金融、央国企及头部互联网行业大客户，负责AI解决方案与SaaS系统的拓展与销售闭环；
2. 搭建并管理区域KA销售团队，拆解并超额达成季度、年度大几千万元营收目标；
3. 建立高层战略级决策人(CXO/CIO)客情关系网络，主导重大招投标方案攻坚。`,
      implicitRequirements: '必须具备大型企业软件或云计算KA销售实战成功案例；形象干练、商务洽谈底蕴深厚；具备强悍的人际敏锐度。',
      hardRules: {
        minDegree: '本科',
        isFullTimeDegreeOnly: true,
        minYears: 7,
        maxYears: 15,
        ageRange: [28, 42],
        requiredSkills: ['KA大客户销售', '招投标管理', 'CXO高层公关', '年销千万业绩'],
      },
      vetoRules: [
        '过往年均回款业绩低于500万',
        '近3年更换超过3家公司',
      ],
      estimatedTotalCount: 140,
      estimatedRemainCount: 45,
      profile: {
        targetRoleSummary: '具备战略格局与地面作战能力的销售领军者，擅长撬动复杂决策链的大型客单。',
        coreDeliverables3to6Months: [
          '建立重点目标客户白名单，完成至少3家头部金融机构战略入围',
          '带领团队签单回款不低于1500万元，沉淀标准化KA打法大图',
        ],
        keyCompetencies: ['复杂销售商机推进', '高层公关与方案说服', '商务风险控制', '团队销售管线漏斗管理'],
        softSkills: ['狼性自驱', '高逆商韧性', '卓越商务礼仪'],
        bonusPoints: ['具备多年外企/国内一线科技大厂大客户销售俱乐部成员资质'],
        cultureFitNotes: '用业绩说话，坦诚自驱，有极强的抱团攻坚集体荣誉感。',
      },
      weights: {
        experience: 45,
        skills: 25,
        stability: 20,
        education: 10,
      },
    },
  },
];

export const MOCK_CANDIDATES: Candidate[] = [
  {
    id: 'cand-01',
    jobId: 'job-01',
    sourceType: 'moka_live',
    name: '沈墨言',
    gender: '男',
    age: 31,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '138****6729',
    email: 'moyen.shen@techlead.io',
    city: '北京·海淀',
    currentCompany: '字节跳动 (ByteDance)',
    currentTitle: '基础架构部 · 资深后端研发专家 (2-2/P7+)',
    degree: '硕士 (统招全日制)',
    school: '北京航空航天大学',
    is985211: true,
    major: '计算机科学与技术',
    workYears: 7,
    totalScore: 94,
    rrfRank: 1,
    vectorSimilarity: 0.942,
    keywordMatchScore: 96,
    scores: {
      education: {
        score: 95,
        weightApplied: 15,
        rationale: '985北航计算机硕士，本硕一致且均为计算机顶尖科班出身，理论底子扎实。',
        evidenceQuotes: ['北京航空航天大学 计算机学院 硕士研究生 (2016-2019)', 'GPA 3.82/4.0，主研分布式系统拓扑与容灾'],
      },
      skills: {
        score: 96,
        weightApplied: 40,
        rationale: '精通Golang与微服务架构，主导过3000万QPS的网关底座与RPC治理平台，技术深度完全超纲匹配。',
        evidenceQuotes: [
          '主导设计抖音核心推荐流微服务旁路Mesh化方案，平稳支撑3000w+ QPS',
          '自研高性能Go内存池与连接复用组件，单机GC停顿时间下降45%',
          '深度掌握K8s Operator开发，实现数百个微服务实例秒级弹性扩缩容',
        ],
      },
      stability: {
        score: 90,
        weightApplied: 15,
        rationale: '7年仅2段经历（美团3年，字节4年），平均在职时间3.5年，连续上升期，无频繁跳槽风险。',
        evidenceQuotes: ['2019.04 - 2022.03 美团到店事业部 后端工程师', '2022.04 - 至今 字节跳动 架构部 资深后端专家'],
      },
      experience: {
        score: 93,
        weightApplied: 30,
        rationale: '具备超大型千万级并发实操、故障自愈与跨团队架构RFC落地经验，与JD目标画像契合度极高。',
        evidenceQuotes: [
          '主导跨多机房双活容灾体系演进，故障自动化逃逸切换缩短至15秒',
          '输出8篇基础架构技术规范RFC，组织20+场架构设计复盘与落地指导',
        ],
      },
    },
    aiSummary: '超高匹配度的架构领军人才。北航科班计算机硕，大厂核心架构部背书，拥有千万级QPS超高并发实操落地与Service Mesh重构经验。各维度均属顶尖，强烈建议进入下一轮业务面。',
    highlights: [
      '主导过3000万QPS的核心流量网关重构与Service Mesh落地，技术内功极其扎实',
      '近7年仅2段大厂任职经历，职业曲线稳步晋升，稳定性极佳',
      '深入掌握Go Runtime与GC底层机制，多次解决生产环境复杂内存抖动难题',
      '具备良好的技术领导力与跨部门RFC规范推导经验',
    ],
    gapsOrRisks: [
      '当前职级薪资水位预计较高，需HR前期做好薪酬预期管理与股权激励沟通',
      '在当前团队处于核心骨干岗位，离职审批周期可能在1~1.5个月左右',
    ],
    interviewAdvice: [
      '建议深入考察其在跨机房多活容灾演进中，遇到分布式事务一致性与网络分区(Brain-split)时的具体妥协策略',
      '了解其过往在面对业务方抵触技术改造时的跨团队推进技巧与沟通风格',
      '询问其对于下一代云原生可观测性架构演进趋势的思考与预判',
    ],
    matchTags: ['985本硕', '千万级QPS', 'Service Mesh', 'Go底层调优', '大厂P7+架构师'],
    originalResumeText: `【个人基本信息】
姓名：沈墨言 | 性别：男 | 年龄：31岁 | 现居：北京海淀
学历：北京航空航天大学 · 计算机科学与技术 (硕士) | 毕业年份：2019
工作年限：7年 | 目前状态：在职看机会 | 期望岗位：资深后端架构师

【专业技能树】
- 语言基础：精通Golang底层原理（GC/GMP调度/内存分配），熟悉C++/Rust语言
- 架构体系：精通千万级QPS分布式系统、微服务治理、Service Mesh、分布式事务与多活容灾
- 基础设施：熟练掌握Kubernetes、Docker、Envoy、Kafka、Redis Cluster等主流中间件
- 可观测性：熟悉OpenTelemetry全链路追踪、Prometheus监控告警与故障自愈系统

【工作与项目经历】
1. 2022.04 - 至今 | 字节跳动 · 基础架构部 | 资深后端研发专家 (2-2)
- 负责抖音推荐与内容分发服务核心底座。主导并设计了下一代自适应微服务网关架构。
- 采用Go深度调优自研连接池及协程调度，应对晚高峰3000w+ QPS洪峰，吞吐提升35%，单机P99延迟由18ms降至11ms。
- 主导推进异地多活方案落地，主导编写架构RFC规范并通过专家委员会评审，演练故障切换逃逸耗时控制在15秒内。

2. 2019.04 - 2022.03 | 美团 · 到店平台部 | 后端开发工程师
- 负责到店交易引擎核心结算系统高并发改造，沉淀可复用分布式事务Seata扩展插件。
- 梳理历史老旧Java/Go混排单体架构，拆解为12个原子微服务，线上零故障完成数据灰度迁移。

【教育经历】
2016.09 - 2019.03 北京航空航天大学 计算机学院 硕士 (统招全日制)
2012.09 - 2016.07 北京航空航天大学 计算机科学与技术 本科`,
    status: 'pending',
  },
  {
    id: 'cand-02',
    jobId: 'job-01',
    sourceType: 'moka_live',
    name: '陆子轩',
    gender: '男',
    age: 29,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '139****1842',
    email: 'zixuan.lu@cloudnative.cn',
    city: '北京·朝阳',
    currentCompany: '快手科技',
    currentTitle: '主站研发部 · 高级Golang开发工程师 (T3-1)',
    degree: '本科 (统招全日制)',
    school: '华中科技大学',
    is985211: true,
    major: '软件工程',
    workYears: 6,
    totalScore: 89,
    rrfRank: 2,
    vectorSimilarity: 0.898,
    keywordMatchScore: 92,
    scores: {
      education: {
        score: 90,
        weightApplied: 15,
        rationale: '985顶尖工科院校软件工程全日制本科，学历硬性条件完全合规。',
        evidenceQuotes: ['华中科技大学 软件学院 本科 (2016-2020)'],
      },
      skills: {
        score: 92,
        weightApplied: 40,
        rationale: '6年纯Go高并发经验，熟悉快手主站服务治理与Kafka消息总线吞吐调优。',
        evidenceQuotes: [
          '主导直播弹幕与送礼结算系统Go架构重塑，承载日常千万级在线并发',
          '基于eBPF技术构建生产环境网络排障探针，精准定位长尾延迟故障',
        ],
      },
      stability: {
        score: 85,
        weightApplied: 15,
        rationale: '6年内2段经历（知乎2年，快手4年），节奏健康，符合稳定性要求。',
        evidenceQuotes: ['知乎 2020-2022', '快手 2022-至今'],
      },
      experience: {
        score: 86,
        weightApplied: 30,
        rationale: '业务层高并发实战经验丰富，但与JD中多活容灾和底层架构平台演进相比，业务偏向稍重。',
        evidenceQuotes: ['主要支撑快手主站直播与互动业务，跨机房容灾主导深度略逊于纯架构线候选人'],
      },
    },
    aiSummary: '华科科班出身，快手核心业务高并发实战专家。Go代码工程素养极佳，善于利用eBPF等前沿技术解决生产网络瓶颈，工程抗压强，非常适合承担高负荷业务微服务架构攻坚。',
    highlights: [
      '快手直播弹幕高并发实战经验，抗并发实战扎实',
      '熟练运用eBPF和Linux内核参数调优排障，有排障硬技能',
      '985正规科班，思维敏捷，工程代码严谨规范',
    ],
    gapsOrRisks: [
      '过往经历偏向具体业务线的架构支撑，在跨机房异地多活系统顶层设计上略显薄弱',
    ],
    interviewAdvice: [
      '着重考察其对异地多活方案中数据复制延迟、跨区一致性冲突的具体解决方案',
      '考察其在千万级长连接推送场景下，单机内存优化与FD句柄耗尽时的应急手段',
    ],
    matchTags: ['985本科', '快手直播高并发', 'eBPF网络调优', 'Go微服务实战'],
    originalResumeText: `【个人基本信息】
姓名：陆子轩 | 性别：男 | 年龄：29岁 | 现居：北京朝阳
学历：华中科技大学 · 软件工程 (本科) | 工作年限：6年
目前职位：快手主站研发部 高级工程师

【主要经历】
- 2022.03-至今 快手 主站直播服务团队 高级Golang开发工程师
负责直播间消息通道分发与礼物打赏实时流计算架构。将弹幕下发端到端延迟降低至120ms以内。
- 2020.07-2022.02 知乎 社区业务线 后端工程师
负责社区信息流推荐与问答互动接口优化，重构核心点赞与评论计数微服务。`,
    status: 'pending',
  },
  {
    id: 'cand-03',
    jobId: 'job-01',
    sourceType: 'talent_pool',
    name: '周雅南',
    gender: '女',
    age: 32,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '137****9012',
    email: 'yanan.zhou@cloudinfra.com',
    city: '上海·浦东',
    currentCompany: 'PingCAP',
    currentTitle: 'TiDB内核研发生态团队 · 资深基础设施架构师',
    degree: '本科 (统招全日制)',
    school: '上海交通大学',
    is985211: true,
    major: '电子与计算机工程',
    workYears: 8,
    totalScore: 91,
    rrfRank: 3,
    vectorSimilarity: 0.915,
    keywordMatchScore: 90,
    scores: {
      education: {
        score: 95,
        weightApplied: 15,
        rationale: '上海交通大学计算机工程全日制本科，学术与工程声誉兼备。',
        evidenceQuotes: ['上海交通大学 本科 (2014-2018)'],
      },
      skills: {
        score: 93,
        weightApplied: 40,
        rationale: '开源分布式数据库核心Contributor，对分布式共识协议(Raft)、Go网络库有极深底层研究。',
        evidenceQuotes: ['参与TiDB分布式事务引擎优化，精通Raft一致性协议与分片再平衡机制'],
      },
      stability: {
        score: 88,
        weightApplied: 15,
        rationale: '8年2家优质企业，稳定性与技术专注度极高。',
        evidenceQuotes: ['前东家4年，PingCAP 4年'],
      },
      experience: {
        score: 87,
        weightApplied: 30,
        rationale: '偏基础设施底层与存储组件，如果岗位需要更重业务流转的微服务网关，需考察其技术泛化意愿。',
        evidenceQuotes: ['在分布式存储与底层中间件方面成就卓越，业务端业务网关经验相对较少'],
      },
    },
    aiSummary: '上交本科，PingCAP底层基础设施专家。在分布式一致性、高可用存储架构有非常深厚的造诣。若团队架构涉及分布式底层组件攻坚，此候选人是不二人选。',
    highlights: [
      '知名开源项目深度贡献者，对分布式共识协议(Raft)与存储原理极具发言权',
      '上交科班背景，技术逻辑极具前瞻性',
      '职业路径极其稳健专注，深度攻坚能力过硬',
    ],
    gapsOrRisks: [
      '目前工作偏向数据库内核与纯底层平台，与偏业务网关、微服务业务编排的日常需求存在一定领域偏差',
    ],
    interviewAdvice: [
      '了解其对从纯底层基础组件转向企业微服务整体架构与DevOps协同的个人职业定位',
      '考察其在面对非技术背景业务方提出急迫业务架构诉求时的折衷处理方案',
    ],
    matchTags: ['上海交大', '分布式存储', 'Raft协议', 'PingCAP专家', '底层硬核'],
    originalResumeText: `【个人基本信息】
姓名：周雅南 | 性别：女 | 年龄：32岁
学历：上海交通大学 · 电子与计算机工程 本科 (2014-2018)
目前职位：PingCAP 资深分布式系统架构师

【专业经历】
- 2020.06 - 至今 PingCAP 存储与内核生态组
主导分布式多副本一致性模块调优，针对网络延迟抖动环境重新设计自适应心跳检测机制。
- 2018.07 - 2020.05 携程基础架构中心 云原生平台研发`,
    status: 'pending',
  },
  {
    id: 'cand-04',
    jobId: 'job-01',
    sourceType: 'talent_pool',
    name: '韩博',
    gender: '男',
    age: 34,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '135****3311',
    email: 'hanbo.arch@163.com',
    city: '北京·海淀',
    currentCompany: '某中型互联网金融科技公司',
    currentTitle: '技术部 · 技术专家兼架构组长',
    degree: '大专 (自考本科在读)',
    school: '某职业技术学院',
    is985211: false,
    major: '计算机网络技术',
    workYears: 10,
    totalScore: 68,
    rrfRank: 4,
    vectorSimilarity: 0.74,
    keywordMatchScore: 78,
    scores: {
      education: {
        score: 55,
        weightApplied: 15,
        rationale: '大专学历，不符合岗位“统招全日制本科及以上”的硬性一票否决规则。',
        evidenceQuotes: ['某职业技术学院 大专 (2012-2015)'],
      },
      skills: {
        score: 75,
        weightApplied: 40,
        rationale: '主要使用Java转Go，Go经验约2年半，千万级微服务架构经验主要为维护老旧单体拆分。',
        evidenceQuotes: ['2023年开始将部分网关服务用Go进行重写，累计并发约5000 QPS'],
      },
      stability: {
        score: 65,
        weightApplied: 15,
        rationale: '10年经历历经5家公司，最近两段工龄均在1.5年左右，稳定性评分偏弱。',
        evidenceQuotes: ['多次在业务瓶颈期跳槽，近3年换过2家公司'],
      },
      experience: {
        score: 72,
        weightApplied: 30,
        rationale: '具备一定带队经验，但面对亿级高并发和多活容灾实战经验不足，偏中小企业规模。',
        evidenceQuotes: ['负责内部CRM与简单金流账本系统，未见海量并发或复杂网络调优记录'],
      },
    },
    aiSummary: '学历触发一票否决硬规则（统招本科），且Go架构与并发规模与本次资深岗位存在明显代差。建议在初筛阶段直接淘汰。',
    highlights: ['具备10年IT从业经历，沟通落地务实', '有小团队管理与带人经验'],
    gapsOrRisks: [
      '学历触发一票否决规则（非统招全日制本科）',
      'Go实际深层调优与千万并发经验欠缺',
      '历史跳槽频次偏高',
    ],
    interviewAdvice: ['不建议进入面试环节'],
    matchTags: ['学历不符', '一票否决候选人', '低并发经历', '转语言不久'],
    originalResumeText: `【个人基本信息】
姓名：韩博 | 年龄：34岁 | 学历：大专 | 工作年限：10年
期望岗位：Go后端工程师/主管
经历：历任某金融外包公司组长、某电商公司后端主管...`,
    status: 'rejected',
    feedback: {
      primaryReason: '学历与硬规则不符',
      secondaryReason: '非统招全日制本科且工作年限不匹配',
      notes: '初筛系统硬规则拦截，学历触发一票否决，且缺乏千万级高并发实操。',
      aiAccuracy: 'accurate',
      feedbackTime: '2026-09-14 09:35',
    },
  },
  {
    id: 'cand-05',
    jobId: 'job-01',
    sourceType: 'moka_live',
    name: '程奕飞',
    gender: '男',
    age: 28,
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    phone: '136****4499',
    email: 'yifei.cheng@alumni.zju.edu.cn',
    city: '杭州·西湖',
    currentCompany: '阿里云计算',
    currentTitle: '云原生系统架构部 · 高级研发工程师 (P6+)',
    degree: '硕士 (统招全日制)',
    school: '浙江大学',
    is985211: true,
    major: '计算机软件工程',
    workYears: 5,
    totalScore: 88,
    rrfRank: 5,
    vectorSimilarity: 0.884,
    keywordMatchScore: 90,
    scores: {
      education: {
        score: 95,
        weightApplied: 15,
        rationale: '985浙江大学全日制硕士，专业对口，学业优秀。',
        evidenceQuotes: ['浙江大学 硕士 (2019-2021)'],
      },
      skills: {
        score: 90,
        weightApplied: 40,
        rationale: '阿里云原生网络与K8s集群内核调优，精通Go并发编程及网络包嗅探分析。',
        evidenceQuotes: ['负责阿里云容器服务ACK大规模集群网络插件开发维护'],
      },
      stability: {
        score: 85,
        weightApplied: 15,
        rationale: '毕业至今在阿里工作5年，连续未曾跳槽，忠诚度与成长曲线极好。',
        evidenceQuotes: ['2021.07 - 至今 阿里巴巴/阿里云 5年持续在职'],
      },
      experience: {
        score: 82,
        weightApplied: 30,
        rationale: '技术基础好，但目前主要以平台维护和功能开发为主，独立牵头跨系统重大架构决策机会略少。',
        evidenceQuotes: ['多在主管带领下参与大型架构，作为副手或模块主责人'],
      },
    },
    aiSummary: '浙大高材生，阿里5年纯正云原生背景，基本功扎实，学习能力极强。虽独立主导亿级系统架构决策经验略显年轻，但极具潜力，建议推进初筛。',
    highlights: ['浙大科班硕士+阿里5年一线云原生研发', 'K8s集群与网络内核深度掌握', '专注度高，稳定性极好'],
    gapsOrRisks: ['目前在杭州，需确认是否接受异地搬迁至北京办公'],
    interviewAdvice: ['考察其对业务架构的理解程度与异地入职意愿', '考察其带领攻坚团队的领导潜力'],
    matchTags: ['浙大硕士', '阿里云原生', '5年阿里稳定性', '潜质型架构师'],
    originalResumeText: `【个人基本信息】
姓名：程奕飞 | 性别：男 | 年龄：28岁 | 现居：杭州
学历：浙江大学 硕士 | 工作年限：5年 | 目前职位：阿里云 高级研发工程师`,
    status: 'pushed_to_moka',
  },
  {
    id: 'cand-06',
    jobId: 'job-02',
    sourceType: 'moka_live',
    name: '林若虚',
    gender: '男',
    age: 30,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    phone: '138****8821',
    email: 'ruoxu.lin@ai-agent.tech',
    city: '北京·朝阳',
    currentCompany: '某头部大模型独角兽',
    currentTitle: 'AI 原生商业化产品线负责人',
    degree: '本科 (统招全日制)',
    school: '复旦大学',
    is985211: true,
    major: '信息管理与信息系统',
    workYears: 6,
    totalScore: 92,
    rrfRank: 1,
    vectorSimilarity: 0.935,
    keywordMatchScore: 94,
    scores: {
      education: {
        score: 92,
        weightApplied: 15,
        rationale: '复旦大学信管专业，复合学科背景兼具技术理解与商业化嗅觉。',
        evidenceQuotes: ['复旦大学 本科 (2016-2020)'],
      },
      skills: {
        score: 95,
        weightApplied: 35,
        rationale: '实操过企业级Agent工作流商业化，从Token计量计费到席位阶梯定价全链路跑通。',
        evidenceQuotes: ['主导Agent自动化工作流平台商业化从0到1，达成千万元级ARR营收'],
      },
      stability: {
        score: 88,
        weightApplied: 15,
        rationale: '6年仅两段经历，在大模型风口下保持长期专注度。',
        evidenceQuotes: ['前大厂3年，当前独角兽3年'],
      },
      experience: {
        score: 90,
        weightApplied: 35,
        rationale: '商业闭环与产品落地经验兼备，且有带领售前与产研协同攻坚经验。',
        evidenceQuotes: ['直接主导面向50+中大型B端客户的商业化PoC与交付标准落地'],
      },
    },
    aiSummary: '复旦背景，极度稀缺的具备千万级ARR大模型AI Native商业化实战闭环操盘手，对Agent定价与商业漏斗理解极其深刻。',
    highlights: ['操盘过大模型企业级Agent商业化产品从0到1', '既懂技术边界又能算清B端客户ROI', '复旦科班，逻辑极具穿透力'],
    gapsOrRisks: ['当前期权预期较高，需HR前期沟通匹配'],
    interviewAdvice: ['考察其对大模型推理成本(Token/Query)波动下的商业定价兜底策略'],
    matchTags: ['复旦本科', '大模型商业化', 'ARR破千万', 'Agent工作流', 'B端SaaS'],
    originalResumeText: `【个人信息】
姓名：林若虚 | 年龄：30岁 | 学历：复旦大学 | 工作年限：6年
目前职位：某AI大模型独角兽商业化产品线负责人
主导企业级智能工作流产品商业模式与定价，服务数十家标杆客户。`,
    status: 'pending',
  },
  {
    id: 'cand-07',
    jobId: 'job-02',
    sourceType: 'talent_pool',
    name: '陈思远',
    gender: '女',
    age: 28,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '139****7765',
    email: 'siyuan.chen@promptlab.ai',
    city: '上海·徐汇',
    currentCompany: '微软亚太研发集团',
    currentTitle: 'Copilot体验与生态资深产品经理',
    degree: '硕士 (统招全日制)',
    school: '上海交通大学',
    is985211: true,
    major: '软件工程',
    workYears: 4,
    totalScore: 86,
    rrfRank: 2,
    vectorSimilarity: 0.88,
    keywordMatchScore: 88,
    scores: {
      education: {
        score: 95,
        weightApplied: 15,
        rationale: '上海交通大学全日制硕士，国际化外企规范训练背景。',
        evidenceQuotes: ['上海交通大学 硕士 (2020-2022)'],
      },
      skills: {
        score: 88,
        weightApplied: 35,
        rationale: '精通Copilot人机交互范式与Prompt评测流程，产品设计细腻。',
        evidenceQuotes: ['负责跨应用Copilot插件生态与用户引导交互设计'],
      },
      stability: {
        score: 90,
        weightApplied: 15,
        rationale: '毕业一直在微软亚太体系任职，稳定性无可挑剔。',
        evidenceQuotes: ['微软任职4年持续在职'],
      },
      experience: {
        score: 80,
        weightApplied: 35,
        rationale: '用户体验与产品交互极强，但国内本土化商务公关与地面开拓经验略少。',
        evidenceQuotes: ['侧重产品与技术规范生态，非直面销售成单一线'],
      },
    },
    aiSummary: '上交硕士，微软Copilot体系产品专家。人机交互与产品工程素养卓越，对前沿AI体验洞察极深。',
    highlights: ['上交硕士+微软Copilot一线产品背景', '对人机协同UI交互有独到研究', '职业素养高，稳定性极好'],
    gapsOrRisks: ['偏产品体验与国际生态，对国内狼性直销变现模式需一定适应期'],
    interviewAdvice: ['考察其对国内大模型客单价与采购决策链的理解'],
    matchTags: ['上海交大', '微软Copilot', 'AI交互设计', '海外生态视野'],
    originalResumeText: `【个人简历】
姓名：陈思远 | 女 | 28岁 | 上海交通大学 软件工程 硕士
经历：微软亚太研发集团 Copilot 资深产品经理。`,
    status: 'pending',
  },
  {
    id: 'cand-08',
    jobId: 'job-03',
    sourceType: 'moka_live',
    name: '顾安澜',
    gender: '女',
    age: 29,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '131****5520',
    email: 'anlan.gu@designsys.com',
    city: '深圳·南山',
    currentCompany: '腾讯科技 (Tencent)',
    currentTitle: 'CDC体验设计部 · 资深设计系统专家',
    degree: '本科 (统招全日制)',
    school: '中国美术学院',
    is985211: false,
    major: '视觉传达与交互设计',
    workYears: 6,
    totalScore: 93,
    rrfRank: 1,
    vectorSimilarity: 0.94,
    keywordMatchScore: 95,
    scores: {
      education: {
        score: 90,
        weightApplied: 15,
        rationale: '国美顶级美院设计科班，美学功底深厚扎实。',
        evidenceQuotes: ['中国美术学院 本科 (2016-2020)'],
      },
      skills: {
        score: 96,
        weightApplied: 45,
        rationale: '主导腾讯云核心中后台Design Tokens多端规范，深度掌握Figma变量与无障碍色彩标准。',
        evidenceQuotes: ['主导万级组件资产库重塑，沉淀80+基础组件规范与暗黑主题Token系统'],
      },
      stability: {
        score: 88,
        weightApplied: 15,
        rationale: '6年2段大厂经历，专业沉淀持续深入。',
        evidenceQuotes: ['前大厂2年，腾讯4年'],
      },
      experience: {
        score: 92,
        weightApplied: 25,
        rationale: '具备大型设计系统工程化落地经验，与前端代码Token映射协同极其成熟。',
        evidenceQuotes: ['搭建自动化设计走查插件与Storybook组件对齐体系，提效40%'],
      },
    },
    aiSummary: '中国美院科班，腾讯云设计系统核心操盘手，像素级审美与工程严谨性兼备，是极为优秀的体验设计专家候选人。',
    highlights: ['主导过腾讯核心中后台Design Tokens规范制定与工程落地', '国美设计科班，审美与微交互一流', '精通前端Token规范体系与走查自动化'],
    gapsOrRisks: ['目前在深圳，若需北京/上海常驻需提前沟通意向'],
    interviewAdvice: ['考察其在中后台设计规范与业务个性化诉求冲突时的裁决策略'],
    matchTags: ['中国美院', '腾讯CDC', 'Design Tokens', '组件库专家', 'B端体验'],
    originalResumeText: `【个人基本信息】
姓名：顾安澜 | 女 | 29岁 | 中国美术学院
目前职位：腾讯 CDC 资深设计系统专家
负责大型企业中后台组件库规范，Design Tokens自动化走查。`,
    status: 'pending',
  },
  {
    id: 'cand-09',
    jobId: 'job-04',
    sourceType: 'talent_pool',
    name: '赵振华',
    gender: '男',
    age: 36,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    phone: '133****1122',
    email: 'zhenhua.zhao@enterprise-ka.cn',
    city: '北京·朝阳',
    currentCompany: '甲骨文 / 华为云',
    currentTitle: '金融大客户部 · 销售总监',
    degree: '本科 (统招全日制)',
    school: '对外经济贸易大学',
    is985211: true,
    major: '国际经济与贸易',
    workYears: 12,
    totalScore: 91,
    rrfRank: 1,
    vectorSimilarity: 0.92,
    keywordMatchScore: 92,
    scores: {
      education: {
        score: 90,
        weightApplied: 10,
        rationale: '211对外经贸全日制本科，商务礼仪与外语综合底蕴深厚。',
        evidenceQuotes: ['对外经济贸易大学 本科 (2010-2014)'],
      },
      skills: {
        score: 90,
        weightApplied: 25,
        rationale: '精通重大招投标、联合解决方案设计与CXO高层说服技巧。',
        evidenceQuotes: ['主导数个千万级政企央国企联合集采招投标标段落地'],
      },
      stability: {
        score: 90,
        weightApplied: 20,
        rationale: '12年仅2家国际/国内顶级软硬件巨头，行业信誉极高。',
        evidenceQuotes: ['Oracle 6年，华为云 6年'],
      },
      experience: {
        score: 94,
        weightApplied: 45,
        rationale: '连续5年回款业绩超2000万元，金融央国企客情资源深厚。',
        evidenceQuotes: ['连续获得KA销售金牌销售团队荣誉，大客户漏斗管理严密'],
      },
    },
    aiSummary: '外经贸背景，12年外企与国内科技大厂KA销售老兵。手握深厚金融与央国企资源，连续超额完成大额业绩，具备极强的战局把控力。',
    highlights: ['连续5年单年回款超2000万元', 'Oracle与华为云双重顶级大厂操盘经历', '极其稳健的职业操守与大客户高层公关力'],
    gapsOrRisks: ['偏重大客单直销，对标准化中小SaaS的电销打法不适用'],
    interviewAdvice: ['深入考察其过往在重大招投标中面对竞争对手恶意价格战的破局方法'],
    matchTags: ['211本科', '千万级回款', '金融KA客情', '华为云/Oracle老兵'],
    originalResumeText: `【个人基本信息】
姓名：赵振华 | 男 | 36岁 | 对外经济贸易大学
经历：12年大客户企业软件与云计算销售，连续破千万业绩。`,
    status: 'pending',
  },
];

export const MOCK_HISTORY_RECORDS: ScreeningHistoryRecord[] = [
  {
    id: 'hist-001',
    jobId: 'job-01',
    jobTitle: '资深后端开发架构师 (Go / 微服务)',
    department: '基础平台与架构部',
    batchNo: 'BATCH-20260914-0920',
    triggerTime: '2026-09-14 09:20:15',
    source: '双库合并拉取',
    totalScreened: 186,
    passedCount: 24,
    rejectedCount: 162,
    avgScore: 78.5,
    weights: { skills: 40, experience: 30, stability: 15, education: 15 },
    hardRuleSummary: '统招本科+ | 5~12年 | Go/千万级并发 | 一票否决(连续跳槽/学历)',
    operator: '林晓涵 (HR)',
    status: 'completed',
  },
  {
    id: 'hist-002',
    jobId: 'job-02',
    jobTitle: 'AI Native 商业化产品专家',
    department: '生成式AI应用产品部',
    batchNo: 'BATCH-20260914-1015',
    triggerTime: '2026-09-14 10:15:30',
    source: 'Moka 实时投递',
    totalScreened: 96,
    passedCount: 18,
    rejectedCount: 78,
    avgScore: 76.2,
    weights: { skills: 35, experience: 35, stability: 15, education: 15 },
    hardRuleSummary: '统招本科+ | 3~8年 | AI产品/B端SaaS | 一票否决(无大模型项目)',
    operator: '林晓涵 (HR)',
    status: 'screening',
  },
  {
    id: 'hist-003',
    jobId: 'job-04',
    jobTitle: '大客户商业化销售总监 (KA Sales)',
    department: '企业大客户事业部',
    batchNo: 'BATCH-20260910-1640',
    triggerTime: '2026-09-10 16:40:02',
    source: '历史人才库',
    totalScreened: 140,
    passedCount: 12,
    rejectedCount: 128,
    avgScore: 71.8,
    weights: { experience: 45, skills: 25, stability: 20, education: 10 },
    hardRuleSummary: '本科+ | 7~15年 | KA大客户/CXO攻坚 | 一票否决(业绩<500万)',
    operator: '周思齐 (HRBP)',
    status: 'completed',
  },
  {
    id: 'hist-004',
    jobId: 'job-03',
    jobTitle: '高级 UI/UX 设计专家 (Design System)',
    department: '用户体验设计中心',
    batchNo: 'BATCH-20260905-1410',
    triggerTime: '2026-09-05 14:10:48',
    source: '双库合并拉取',
    totalScreened: 88,
    passedCount: 16,
    rejectedCount: 72,
    avgScore: 81.0,
    weights: { skills: 45, experience: 25, stability: 15, education: 15 },
    hardRuleSummary: '大专+ | 4~10年 | Figma/Design System | 一票否决(无B端作品集)',
    operator: '林晓涵 (HR)',
    status: 'completed',
  },
];

// 反馈标签树形结构（一级 -> 二级）
export const FEEDBACK_REASONS_MAP: Record<string, string[]> = {
  '专业技能硬性不符': [
    '缺乏千万级超高并发微服务实战经验',
    '主开发语言非Go（纯Java/Python转岗深度不足）',
    '云原生或K8s底层排障与调优经验较弱',
    '缺少生产级Service Mesh或多活架构落地经验',
    '技术栈与业务场景契合度低',
  ],
  '工作年限与职级不匹配': [
    '实际带头主导架构年限低于5年硬性要求',
    '当前职级或定位偏执行层模块开发，非系统架构师',
    '技术广度足够但架构深度与复杂度不足',
  ],
  '职业稳定性存疑': [
    '近2年跳槽频次超标（单段工期不足10个月）',
    '过往职业空窗期较长且无合理解释',
    '跨行业跨领域过于频繁，沉淀不足',
  ],
  '学历与硬性指标不符': [
    '非统招全日制本科（学信网不符合条件）',
    '学历背景与岗位资质申报要求有偏差',
  ],
  '期望待遇或城市不匹配': [
    '薪酬期望严重超出当前岗位Headcount预算',
    '候选人异地办公（无法按时到北京现场办公）',
    '离职流程周期过长，无法满足业务紧急到位要求',
  ],
  '软性素质与文化契合度': [
    '简历项目描述真实性存疑或有过度包装嫌疑',
    '缺乏技术团队文档沉淀与协作共享精神',
    '自驱力与主动推进意识不足',
  ],
};
