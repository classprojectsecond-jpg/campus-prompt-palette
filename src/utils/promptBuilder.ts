import type { 
  CommonSettings, 
  StageSelection, 
  FileAttachment, 
  ReportTabData, 
  ExamTabData, 
  CodingTabData, 
  ResearchTabData, 
  CareerTabData, 
  ImageTabData,
  TabType 
} from '@/types/prompt';
import { buildPrompt } from '@/promptEngine/buildPrompt';
import type { 
  CommonSettings as EngineCommonSettings,
  TabInputs,
  ReportEssayInputs,
  ExamInputs,
  CodingInputs,
  ResearchInputs,
  CareerEmailInputs,
  ImageInputs
} from '@/promptEngine/types';

const TAB_NAMES: Record<TabType, string> = {
  report: '레포트·에세이',
  exam: '시험 대비',
  coding: '코딩',
  research: '연구·논문',
  career: '커리어·이메일',
  image: '이미지 생성',
};

function convertToEngineCommonSettings(
  settings: CommonSettings, 
  tone?: "academic" | "report" | "casual" | "formalEmail" | "presentation"
): EngineCommonSettings {
  const levelMap: Record<string, "HS" | "UG1" | "UG2" | "UG3" | "UG4" | "GR"> = {
    '1': 'UG1', '2': 'UG2', '3': 'UG3', '4': 'UG4',
    'graduate': 'GR', 'other': 'UG2'
  };

  const langLevelMap: Record<string, "HS" | "UG" | "GR"> = {
    'high-school': 'HS',
    'undergraduate': 'UG',
    'graduate': 'GR',
    'expert': 'GR'
  };

  const modelMap: Record<string, "ChatGPT" | "Gemini" | "Other"> = {
    'chatgpt': 'ChatGPT',
    'gemini': 'Gemini',
    'other': 'Other'
  };

  return {
    mode: settings.mode === 'learning' ? 'learning' : 'deliverable',
    outlineMode: settings.resultFormat === 'outline' ? 'outline' : 'full',
    tonePreset: tone || 'academic',
    includeReferences: settings.includeSources,
    selfCheckEnabled: settings.includeSelfCheck,
    subjectProfile: {
      courseName: settings.subjectName || undefined,
      majorOrGE: settings.majorType || undefined,
      level: levelMap[settings.gradeLevel] || 'UG2',
      professorStyle: settings.professorStyle === 'strict' ? 'strict' : settings.professorStyle === 'flexible' ? 'relaxed' : undefined,
      assignmentType: undefined
    },
    userProfile: {
      major: settings.userMajor || undefined,
      interests: settings.interestAreas || undefined,
      preferredExamples: undefined
    },
    styleSampleText: settings.writingStyleSample || undefined,
    timePressure: settings.deadlineValue ? {
      deadlineDescription: `${settings.deadlineType === 'assignment' ? '과제 마감' : settings.deadlineType === 'exam' ? '시험' : '기타'}까지 ${settings.deadlineValue} 남음`,
      examRemaining: settings.deadlineType === 'exam' ? settings.deadlineValue : undefined
    } : undefined,
    aiPolicyText: settings.includeRegulation && settings.aiRegulation ? settings.aiRegulation : undefined,
    modelPreference: modelMap[settings.targetModel] || 'ChatGPT',
    languageLevel: langLevelMap[settings.difficultyLevel] || 'UG'
  };
}

function buildCommonContext(settings: CommonSettings): string {
  const parts: string[] = [];

  if (settings.mode === 'learning') {
    parts.push('**모드**: 학습 모드 - 힌트, 개념 설명, 피드백, 자료 조사 방향 제시 중심으로 답변해 주세요. 정답이나 완성된 글을 바로 주지 말고, 스스로 생각할 수 있도록 도와주세요.');
  } else {
    parts.push('**모드**: 과제/결과물 모드 - 실제 제출 가능한 수준의 완성된 텍스트를 작성해 주세요.');
  }

  if (settings.resultFormat === 'outline') {
    parts.push('**결과 형태**: 아웃라인만 - 구조와 목차 중심으로 작성해 주세요.');
  } else {
    parts.push('**결과 형태**: 완전 작성 - 본문까지 포함하여 작성해 주세요.');
  }

  const profileParts: string[] = [];
  if (settings.subjectName) profileParts.push(`과목: ${settings.subjectName}`);
  if (settings.userMajor) profileParts.push(`사용자 전공: ${settings.userMajor}`);
  
  const gradeMap: Record<string, string> = {
    '1': '1학년', '2': '2학년', '3': '3학년', '4': '4학년', 
    'graduate': '대학원', 'other': '기타'
  };
  profileParts.push(`수준: ${gradeMap[settings.gradeLevel] || settings.gradeLevel}`);
  
  if (settings.interestAreas) profileParts.push(`관심 분야: ${settings.interestAreas}`);
  
  if (profileParts.length > 0) {
    parts.push(`**프로필 정보**: ${profileParts.join(', ')}`);
  }

  const difficultyMap: Record<string, string> = {
    'high-school': '고등학생 수준',
    'undergraduate': '학부생 수준',
    'graduate': '대학원생 수준',
    'expert': '전문가 수준',
  };
  parts.push(`**난이도**: ${difficultyMap[settings.difficultyLevel]}`);

  const langMap: Record<string, string> = {
    'korean': '한국어',
    'english': '영어',
    'mixed': '한국어+영어 혼합',
    'other': '기타',
  };
  parts.push(`**설명 언어**: ${langMap[settings.explanationLanguage]}`);
  parts.push(`**결과물 언어**: ${langMap[settings.outputLanguage]}`);

  if (settings.targetModel === 'other' && settings.targetModelOther) {
    parts.push(`**대상 모델**: ${settings.targetModelOther}`);
  } else {
    const modelMap: Record<string, string> = { chatgpt: 'ChatGPT', gemini: 'Gemini' };
    parts.push(`**대상 모델**: ${modelMap[settings.targetModel] || settings.targetModel}`);
  }

  if (settings.includeSources) {
    parts.push('\n**출처 요청**: 주장이나 통계에 대해 신뢰할 수 있는 출처(논문, 보고서, 공식 웹사이트 등)를 제안해 주세요. 단, 사용자가 직접 출처를 검증해야 합니다.');
  }

  if (settings.includeSelfCheck) {
    parts.push('\n**자기검토 요청**: 답변 마지막에 신뢰도를 1~10점으로 평가하고, 불확실하거나 추가 검증이 필요한 부분을 bullet으로 정리해 주세요.');
  }

  if (settings.writingStyleSample) {
    parts.push(`\n**스타일 참고**: 아래 샘플 글과 비슷한 수준의 어휘, 문장 길이, 문체로 작성해 주세요.\n---\n${settings.writingStyleSample}\n---`);
  }

  if (settings.deadlineValue) {
    const deadlineTypeMap: Record<string, string> = {
      'assignment': '과제 마감',
      'exam': '시험',
      'other': '기타',
    };
    parts.push(`\n**시간 제약**: ${deadlineTypeMap[settings.deadlineType]}까지 ${settings.deadlineValue} 남음. ${settings.mode === 'learning' ? '남은 시간 내에 가장 중요한 개념과 문제 유형을 우선적으로 다뤄 주세요.' : '시간 내 제출 가능한 최소 완성본을 목표로 해 주세요.'}`);
  }

  if (settings.includeRegulation && settings.aiRegulation) {
    parts.push(`\n**AI 사용 규정 준수**: 아래 규정을 먼저 확인하고, 이 범위 내에서 답변해 주세요.\n---\n${settings.aiRegulation}\n---`);
  }

  return parts.join('\n');
}

function buildFileAttachmentContext(attachment: FileAttachment): string {
  if (attachment.hasAttachment && attachment.description) {
    return `\n**첨부 파일 참고**: 나는 이미 "${attachment.description}"에 해당하는 파일을 별도로 제출/업로드해 두었습니다. 이 파일도 함께 고려해 주세요.`;
  }
  return '';
}

function buildReportPrompt(data: ReportTabData, stages: StageSelection, settings: CommonSettings): string {
  const parts: string[] = [];
  parts.push('## 레포트·에세이 작성 요청\n');

  if (data.taskDescription) parts.push(`**과제 설명**: ${data.taskDescription}`);
  if (data.topic) parts.push(`**주제**: ${data.topic}`);
  if (data.rubric) parts.push(`**평가 기준/루브릭**: ${data.rubric}`);

  if (stages.research) {
    parts.push('\n### 1단계: 자료 조사·정리');
    if (data.researchScope) parts.push(`- 조사 범위: ${data.researchScope}`);
    if (data.sourceTypes) parts.push(`- 자료 유형: ${data.sourceTypes}`);
    parts.push('- 주제와 관련된 핵심 자료를 정리하고, 각 자료의 핵심 내용과 내 글과의 연결점을 정리해 주세요.');
  }

  if (stages.outline) {
    parts.push('\n### 2단계: 아웃라인 생성');
    const structureMap: Record<string, string> = {
      '3-paragraph': '3단락 구조 (서론-본론-결론)',
      '5-paragraph': '5단락 구조 (서론-본론1-본론2-본론3-결론)',
      'other': data.outlineOther || '사용자 지정 구조',
    };
    parts.push(`- 구조: ${structureMap[data.outlineStructure]}`);
    parts.push('- 각 단락의 핵심 논점과 예시 아이디어를 포함한 아웃라인을 작성해 주세요.');
  }

  if (stages.fullWrite) {
    parts.push('\n### 3단계: 본문 완전 작성');
    const wordCountMap: Record<string, string> = {
      '300': '약 300자',
      '800': '약 800자',
      '1500': '약 1500자',
      '3000': '약 3000자',
      'other': data.wordCountOther || '사용자 지정 분량',
    };
    parts.push(`- 분량: ${wordCountMap[data.wordCountPreset]}`);
    
    const toneMap: Record<string, string> = {
      'academic': '학술적 문체',
      'report': '보고서 문체',
      'presentation': '발표용 문체',
      'casual': '캐주얼 문체',
    };
    parts.push(`- 문체: ${toneMap[data.tone]}`);
    parts.push('- 위 아웃라인을 바탕으로 완성된 글을 작성해 주세요.');
  }

  return parts.join('\n');
}

function buildExamPrompt(data: ExamTabData, stages: StageSelection): string {
  const parts: string[] = [];
  parts.push('## 시험 대비 요청\n');

  if (data.examScope) parts.push(`**시험 범위**: ${data.examScope}`);
  if (data.examType) parts.push(`**시험 유형**: ${data.examType}`);
  if (data.notesText) parts.push(`**내 노트/교재 내용**:\n${data.notesText}`);

  if (stages.research) {
    parts.push('\n### 1단계: 자료 조사·정리');
    parts.push('- 시험 범위 내 핵심 개념과 자주 출제되는 문제 유형을 정리해 주세요.');
  }

  if (stages.outline) {
    parts.push('\n### 2단계: 요약 노트 구조');
    const summaryMap: Record<string, string> = {
      'concept-list': '개념 리스트 형식',
      'concept-example-trap': '개념-예시-함정 형식',
      'other': data.summaryOther || '사용자 지정 형식',
    };
    parts.push(`- 형식: ${summaryMap[data.summaryType]}`);
    parts.push('- 암기와 이해에 효과적인 구조로 정리해 주세요.');
  }

  if (stages.fullWrite) {
    parts.push('\n### 3단계: 완전 작성');
    const wordCountMap: Record<string, string> = {
      '200': '약 200자',
      '400': '약 400자',
      '600': '약 600자',
      'bullet': 'bullet 형식',
      'other': data.wordCountOther || '사용자 지정 분량',
    };
    parts.push(`- 분량: ${wordCountMap[data.wordCountPreset]}`);
    parts.push('- 서술형 모범답안 또는 상세 요약 노트를 작성해 주세요.');
  }

  return parts.join('\n');
}

function buildCodingPrompt(data: CodingTabData, stages: StageSelection): string {
  const parts: string[] = [];
  parts.push('## 코딩 요청\n');

  const langMap: Record<string, string> = {
    'python': 'Python',
    'javascript': 'JavaScript',
    'c-cpp': 'C/C++',
    'matlab': 'MATLAB',
    'other': data.languageOther || '기타',
  };
  parts.push(`**언어**: ${langMap[data.language]}`);
  if (data.environment) parts.push(`**환경**: ${data.environment}`);

  const goalMap: Record<string, string> = {
    'script': '스크립트/알고리즘',
    'app': '앱 만들기 (웹/GUI)',
    'library': '라이브러리/모듈',
  };
  parts.push(`**목표**: ${goalMap[data.goal]}`);

  if (data.featureDescription) parts.push(`\n**구현하고 싶은 기능**:\n${data.featureDescription}`);
  if (data.currentCode) parts.push(`\n**현재 코드**:\n\`\`\`\n${data.currentCode}\n\`\`\``);
  if (data.errorMessage) parts.push(`\n**에러 메시지**:\n${data.errorMessage}`);

  if (stages.research) {
    parts.push('\n### 1단계: 알고리즘/라이브러리 조사');
    parts.push('- 3~5개의 후보 알고리즘을 복잡도, 장단점과 함께 비교해 주세요.');
    parts.push('- 선택한 환경에서 사용 가능한 라이브러리를 추천해 주세요 (유료 API 제외).');
  }

  if (stages.outline) {
    parts.push('\n### 2단계: 파일/모듈 구조 설계');
    parts.push('- 생성할 파일/모듈 목록과 각각의 역할을 정리해 주세요.');
    if (data.goal === 'app') {
      parts.push('- UI 구조 (페이지, 컴포넌트)도 포함해 주세요.');
    }
  }

  if (stages.fullWrite) {
    parts.push('\n### 3단계: 코드 작성');
    if (data.writeMode === 'minimal-code') {
      parts.push('- 최소 동작 예제 코드를 주석과 함께 작성해 주세요.');
      parts.push('- 외부 유료 API는 사용하지 마세요.');
    } else {
      const wordCountMap: Record<string, string> = {
        '300': '약 300자',
        '600': '약 600자',
        '1000': '약 1000자',
        'other': data.wordCountOther || '사용자 지정 분량',
      };
      parts.push(`- 코드 설명/리포트 분량: ${wordCountMap[data.wordCountPreset]}`);
      parts.push('- 코드와 함께 상세한 설명을 작성해 주세요.');
    }
  }

  return parts.join('\n');
}

function buildResearchPrompt(data: ResearchTabData, stages: StageSelection): string {
  const parts: string[] = [];
  parts.push('## 연구·논문 요청\n');

  if (data.researchTopic) parts.push(`**연구 주제**: ${data.researchTopic}`);
  if (data.currentIdea) parts.push(`**현재 아이디어**: ${data.currentIdea}`);
  if (data.referenceSummary) parts.push(`**참고 논문 요약/초록**:\n${data.referenceSummary}`);

  if (stages.research) {
    parts.push('\n### 1단계: 문헌 조사·정리');
    if (data.literatureKeywords) parts.push(`- 키워드: ${data.literatureKeywords}`);
    parts.push('- 핵심 논문 5~10편을 요약하고, 내 연구와의 연결 코멘트를 작성해 주세요.');
  }

  if (stages.outline) {
    parts.push('\n### 2단계: 구조 설계');
    const structureMap: Record<string, string> = {
      'proposal': '연구계획서 구조',
      'review': '리뷰 논문 구조',
      'other': data.outlineOther || '사용자 지정 구조',
    };
    parts.push(`- 형식: ${structureMap[data.outlineStructure]}`);
  }

  if (stages.fullWrite) {
    parts.push('\n### 3단계: 완전 작성');
    const wordCountMap: Record<string, string> = {
      '500': '약 500자',
      '1000': '약 1000자',
      '1500': '약 1500자',
      'other': data.wordCountOther || '사용자 지정 분량',
    };
    parts.push(`- 분량: ${wordCountMap[data.wordCountPreset]}`);
    parts.push('- 대학원 연구계획 스타일로 작성하고, 마지막에 한계/리스크를 bullet으로 정리해 주세요.');
  }

  return parts.join('\n');
}

function buildCareerPrompt(data: CareerTabData, stages: StageSelection): string {
  const parts: string[] = [];
  parts.push('## 커리어·이메일 요청\n');

  const docTypeMap: Record<string, string> = {
    'professor-email': '교수님 이메일',
    'internship': '인턴/채용 문의',
    'company-inquiry': '기업 문의',
    'cover-letter': '자기소개서/커버레터',
  };
  parts.push(`**문서 유형**: ${docTypeMap[data.documentType]}`);

  if (data.recipientInfo) parts.push(`**상대 정보**: ${data.recipientInfo}`);
  if (data.coreMessage) parts.push(`**핵심 메시지**: ${data.coreMessage}`);
  if (data.experience) parts.push(`**내 이력/경험**: ${data.experience}`);
  if (data.existingDraft) parts.push(`**기존 초안**:\n${data.existingDraft}`);

  if (stages.research && data.companyResearchMode) {
    parts.push('\n### 1단계: 기업/연구실 조사');
    parts.push('- 사업/연구 분야, 최근 이슈, 키워드를 정리하고, 내가 연결할 경험 아이디어를 제안해 주세요.');
  }

  if (stages.outline) {
    parts.push('\n### 2단계: 구조 설계');
    if (data.outlineStructure === 'email') {
      parts.push('- 이메일 구조: 인사 → 목적 → 내용 → 마무리');
    } else {
      parts.push('- 자기소개서 구조: 지원 동기 → 경험 → 역량 → 결론');
    }
  }

  if (stages.fullWrite) {
    parts.push('\n### 3단계: 완전 작성');
    if (data.documentType === 'cover-letter') {
      const wordCountMap: Record<string, string> = {
        '500': '약 500자',
        '800': '약 800자',
        '1000': '약 1000자',
        '1500': '약 1500자',
        'other': data.coverLetterWordCountOther || '사용자 지정 분량',
      };
      parts.push(`- 분량: ${wordCountMap[data.coverLetterWordCount]}`);
    } else {
      const lengthMap: Record<string, string> = {
        'short': '짧게 (5~7문장)',
        'medium': '보통 (8~12문장)',
        'long': '길게',
        'other': data.emailLengthOther || '사용자 지정',
      };
      parts.push(`- 분량: ${lengthMap[data.emailLength]}`);
    }
    parts.push('- 극존대/비즈니스 톤으로, 구체적 경험 중심으로 작성해 주세요.');
  }

  return parts.join('\n');
}

function buildImagePrompt(data: ImageTabData, stages: StageSelection): string {
  const parts: string[] = [];
  parts.push('## 이미지 생성 프롬프트 요청 (나노바나나용)\n');

  const typeMap: Record<string, string> = {
    'logo': '로고',
    'app-ui': '앱 UI',
    'poster': '포스터',
    'thumbnail': '썸네일',
    'illustration': '일러스트',
  };
  parts.push(`**이미지 유형**: ${typeMap[data.imageType]}`);

  if (data.serviceName) parts.push(`**서비스 이름**: ${data.serviceName}`);
  if (data.tagline) parts.push(`**태그라인**: ${data.tagline}`);
  if (data.styleKeywords) parts.push(`**색감/스타일 키워드**: ${data.styleKeywords}`);
  if (data.referenceDescription) parts.push(`**참고 이미지 설명**: ${data.referenceDescription}`);
  if (data.preserveElements) parts.push(`**유지해야 할 요소**: ${data.preserveElements}`);
  if (data.platform) parts.push(`**플랫폼**: ${data.platform}`);

  if (data.promptMode === 'outline') {
    parts.push('\n### 프롬프트 아웃라인 모드');
    parts.push('- 핵심 키워드와 구성 요소만 나열해 주세요.');
  } else {
    parts.push('\n### 프롬프트 완전 작성 모드');
    parts.push('- 나노바나나에 바로 붙여넣을 수 있는 자세한 프롬프트를 작성해 주세요.');
    if (data.includeBothLanguages) {
      parts.push('- 한국어와 영어 버전을 모두 제공해 주세요.');
    }
  }

  return parts.join('\n');
}

function convertReportData(data: ReportTabData, stages: StageSelection): ReportEssayInputs {
  const wordCountMap: Record<string, string> = {
    '300': '약 300자',
    '800': '약 800자',
    '1500': '약 1500자',
    '3000': '약 3000자',
    'other': data.wordCountOther || '사용자 지정 분량',
  };
  
  return {
    assignmentSummary: data.taskDescription || undefined,
    topic: data.topic || undefined,
    requiredSections: data.outlineStructure === 'other' ? data.outlineOther : 
      data.outlineStructure === '3-paragraph' ? '3단락 (서론-본론-결론)' : '5단락 (서론-본론1-본론2-본론3-결론)',
    lengthTarget: wordCountMap[data.wordCountPreset] || data.wordCountOther,
    keyPoints: data.rubric || undefined,
    prohibitedThings: undefined,
    attachedMaterialSummary: data.researchScope ? `조사 범위: ${data.researchScope}, 자료 유형: ${data.sourceTypes}` : undefined,
    stageCollectMaterial: stages.research,
    stageOutline: stages.outline,
    stageDraft: stages.fullWrite
  };
}

function convertExamData(data: ExamTabData, stages: StageSelection): ExamInputs {
  return {
    examScope: data.examScope || undefined,
    questionType: data.examType || undefined,
    myWeakPoints: data.notesText || undefined,
    timeAvailable: undefined,
    wantPracticeSet: stages.fullWrite,
    wantSummarySheet: stages.outline
  };
}

function convertCodingData(data: CodingTabData, stages: StageSelection): CodingInputs {
  const langMap: Record<string, string> = {
    'python': 'Python',
    'javascript': 'JavaScript',
    'c-cpp': 'C/C++',
    'matlab': 'MATLAB',
    'other': data.languageOther || '기타',
  };
  
  return {
    goalDescription: data.featureDescription || undefined,
    techStack: `${langMap[data.language]}${data.environment ? ', ' + data.environment : ''}`,
    constraints: data.errorMessage || undefined,
    currentCodeSnippet: data.currentCode || undefined,
    wantStepPlan: stages.outline,
    wantRefactor: stages.research
  };
}

function convertResearchData(data: ResearchTabData): ResearchInputs {
  const wordCountMap: Record<string, string> = {
    '500': '약 500자',
    '1000': '약 1000자',
    '1500': '약 1500자',
    'other': data.wordCountOther || '사용자 지정 분량',
  };
  
  return {
    researchTopic: data.researchTopic || undefined,
    researchQuestion: data.currentIdea || undefined,
    methodology: undefined,
    targetVenueOrClass: undefined,
    existingWorkSummary: data.referenceSummary || undefined,
    lengthTarget: wordCountMap[data.wordCountPreset] || data.wordCountOther
  };
}

function convertCareerData(data: CareerTabData, stages: StageSelection): CareerEmailInputs {
  const emailTypeMap: Record<string, "professor" | "hr" | "networking" | "etc"> = {
    'professor-email': 'professor',
    'internship': 'hr',
    'company-inquiry': 'hr',
    'cover-letter': 'etc'
  };
  
  const emailLengthMap: Record<string, string> = {
    'short': '짧게 (5~7문장)',
    'medium': '보통 (8~12문장)',
    'long': '길게'
  };
  
  const coverLetterLengthMap: Record<string, string> = {
    '500': '약 500자',
    '800': '약 800자',
    '1000': '약 1000자',
    '1500': '약 1500자'
  };
  
  let lengthPreset: string | undefined;
  if (data.documentType === 'cover-letter') {
    if (data.coverLetterWordCount === 'other' && data.coverLetterWordCountOther) {
      lengthPreset = data.coverLetterWordCountOther;
    } else {
      lengthPreset = coverLetterLengthMap[data.coverLetterWordCount] || '약 800자';
    }
  } else {
    if (data.emailLength === 'other' && data.emailLengthOther) {
      lengthPreset = data.emailLengthOther;
    } else {
      lengthPreset = emailLengthMap[data.emailLength] || '보통 (8~12문장)';
    }
  }
  
  return {
    emailType: emailTypeMap[data.documentType] || 'etc',
    purpose: data.coreMessage || undefined,
    receiverProfile: data.recipientInfo || undefined,
    keyPoints: data.experience || undefined,
    lengthPreset,
    wantCompanyResearch: stages.research && data.companyResearchMode,
    wantOutline: stages.outline,
    wantFullWrite: stages.fullWrite,
    documentType: data.documentType === 'cover-letter' ? 'cover-letter' : 'email'
  };
}

function convertImageData(data: ImageTabData): ImageInputs {
  return {
    imageGoal: data.imageType || undefined,
    subject: data.serviceName || undefined,
    style: data.styleKeywords || undefined,
    colorPalette: undefined,
    resolutionOrRatio: data.platform || undefined,
    detailLevel: data.promptMode === 'outline' ? 'simple' : 'detailed',
    negativePrompt: undefined
  };
}

type EngineTone = "academic" | "report" | "casual" | "formalEmail" | "presentation";

function getToneFromTab(
  activeTab: TabType,
  reportData: ReportTabData,
  careerData: CareerTabData
): EngineTone {
  const validReportTones: Record<string, EngineTone> = {
    'academic': 'academic',
    'report': 'report',
    'casual': 'casual',
    'presentation': 'presentation'
  };
  
  switch (activeTab) {
    case 'report': {
      const rawTone = reportData.tone;
      return validReportTones[rawTone] || 'academic';
    }
    case 'career':
      return 'formalEmail';
    case 'research':
      return 'academic';
    case 'exam':
      return 'academic';
    case 'coding':
      return 'casual';
    case 'image':
      return 'casual';
    default:
      return 'academic';
  }
}

export function generatePrompt(
  activeTab: TabType,
  commonSettings: CommonSettings,
  stages: StageSelection,
  fileAttachment: FileAttachment,
  reportData: ReportTabData,
  examData: ExamTabData,
  codingData: CodingTabData,
  researchData: ResearchTabData,
  careerData: CareerTabData,
  imageData: ImageTabData
): string {
  const tone = getToneFromTab(activeTab, reportData, careerData);
  const engineCommonSettings = convertToEngineCommonSettings(commonSettings, tone);
  
  let tabInputs: TabInputs;
  
  switch (activeTab) {
    case 'report':
      tabInputs = { tabId: 'reportEssay', data: convertReportData(reportData, stages) };
      break;
    case 'exam':
      tabInputs = { tabId: 'exam', data: convertExamData(examData, stages) };
      break;
    case 'coding':
      tabInputs = { tabId: 'coding', data: convertCodingData(codingData, stages) };
      break;
    case 'research':
      tabInputs = { tabId: 'research', data: convertResearchData(researchData) };
      break;
    case 'career':
      tabInputs = { tabId: 'careerEmail', data: convertCareerData(careerData, stages) };
      break;
    case 'image':
      tabInputs = { tabId: 'image', data: convertImageData(imageData) };
      break;
    default:
      tabInputs = { tabId: 'reportEssay', data: convertReportData(reportData, stages) };
  }

  let prompt = buildPrompt(engineCommonSettings, tabInputs);

  if (fileAttachment.hasAttachment && fileAttachment.description) {
    prompt += `\n\n---\n\n# 첨부 파일\n\n나는 이미 "${fileAttachment.description}"에 해당하는 파일을 별도로 제출/업로드해 두었습니다. 이 파일도 함께 고려해 주세요.`;
  }

  return prompt;
}
