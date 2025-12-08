import type {
  CommonSettings,
  ReportEssayInputs,
  ExamInputs,
  CodingInputs,
  ResearchInputs,
  CareerEmailInputs,
  ImageInputs
} from './types';

export function buildReportEssay(common: CommonSettings, data: ReportEssayInputs): string {
  const parts: string[] = [];
  parts.push('## 작업 지시: 레포트/에세이 작성\n');

  if (data.assignmentSummary) {
    parts.push(`### 과제 설명\n${data.assignmentSummary}\n`);
  }

  if (data.topic) {
    parts.push(`### 주제\n${data.topic}\n`);
  }

  if (data.requiredSections) {
    parts.push(`### 요구 목차/형식\n${data.requiredSections}\n`);
  }

  if (data.lengthTarget) {
    parts.push(`### 분량 목표\n${data.lengthTarget}\n`);
  }

  if (data.keyPoints) {
    parts.push(`### 반드시 포함할 논점\n${data.keyPoints}\n`);
  }

  if (data.prohibitedThings) {
    parts.push(`### 피해야 할 것\n${data.prohibitedThings}\n`);
  }

  if (data.attachedMaterialSummary) {
    parts.push(`### 참고 자료 요약\n${data.attachedMaterialSummary}\n`);
  }

  const stages: string[] = [];
  if (data.stageCollectMaterial) stages.push('자료 조사');
  if (data.stageOutline) stages.push('아웃라인');
  if (data.stageDraft) stages.push('초안 작성');

  if (stages.length > 0) {
    parts.push(`### 작업 단계\n다음 순서로 진행해 주세요: ${stages.join(' → ')}\n`);
  }

  if (data.stageCollectMaterial) {
    parts.push(`
**1단계: 자료 조사·정리**
- 주제와 관련된 키워드 후보를 5~10개 제시해 주세요.
- 각 키워드에 적합한 참고자료 유형(논문, 보고서, 뉴스 기사, 공식 통계 등)을 제안해 주세요.
- 자료를 효율적으로 정리하는 방법(표, 마인드맵, 개조식 등)도 안내해 주세요.
`);
  }

  if (data.stageOutline) {
    parts.push(`
**${data.stageCollectMaterial ? '2' : '1'}단계: 아웃라인 구성**
- ${data.requiredSections ? '과제에서 요구한 형식에 맞춰' : '서론-본론-결론 구조로'} 목차를 작성해 주세요.
- 각 단락의 핵심 논점, 뒷받침할 근거, 필요한 자료를 간략히 정리해 주세요.
- 문장 길이는 짧게, 구조 중심으로 작성해 주세요.
`);
  }

  if (data.stageDraft) {
    const toneInstruction = getToneInstruction(common.tonePreset);
    parts.push(`
**${data.stageCollectMaterial && data.stageOutline ? '3' : data.stageOutline ? '2' : '1'}단계: 본문 초안 작성**
- ${data.lengthTarget ? `목표 분량(${data.lengthTarget})에 맞춰` : '적절한 분량으로'} 문단 단위 초안을 작성해 주세요.
- ${toneInstruction}
- 각 문단의 주장-근거-예시 구조를 명확히 해 주세요.
`);
  }

  return parts.join('\n');
}

export function buildExam(common: CommonSettings, data: ExamInputs): string {
  const parts: string[] = [];
  parts.push('## 작업 지시: 시험 대비\n');

  if (data.examScope) {
    parts.push(`### 시험 범위\n${data.examScope}\n`);
  }

  if (data.questionType) {
    parts.push(`### 문제 유형\n${data.questionType} (서술형/계산형/혼합 등)\n`);
  }

  if (data.myWeakPoints) {
    parts.push(`### 나의 약점\n${data.myWeakPoints}\n`);
  }

  if (data.timeAvailable) {
    parts.push(`### 남은 시간\n${data.timeAvailable}\n`);
  }

  if (data.wantSummarySheet) {
    parts.push(`
### 요약 노트 요청
- 시험 범위를 개념 맵 형태로 요약해 주세요.
- 각 개념에 중요도(상/중/하)와 출제 가능성을 표시해 주세요.
- 핵심 공식, 정의, 예시를 간결하게 정리해 주세요.
`);
  }

  if (data.wantPracticeSet) {
    parts.push(`
### 예상 문제 세트 요청
- 예상 문제를 난이도 순(기초 → 중급 → 고급)으로 생성해 주세요.
- ${data.questionType === '계산형' ? '계산형 문제 위주로' : data.questionType === '서술형' ? '서술형 문제 위주로' : '서술형과 계산형을 골고루'} 출제해 주세요.
`);

    if (common.mode === 'learning') {
      parts.push(`- 해설은 **단계별 힌트 → 풀이 과정 → 정답** 순서로 제시해 주세요.
- 먼저 학생에게 풀어볼 기회를 주고, 막히는 부분을 질문하면 그때 다음 힌트를 제공해 주세요.`);
    } else {
      parts.push(`- 각 문제에 모범 답안과 채점 포인트를 함께 제시해 주세요.`);
    }
  }

  return parts.join('\n');
}

export function buildCoding(common: CommonSettings, data: CodingInputs): string {
  const parts: string[] = [];
  parts.push('## 작업 지시: 코딩\n');

  parts.push(`### 기본 요청사항
1. 먼저 요구 기능을 당신이 이해한 대로 다시 설명해 주세요.
2. step-by-step 구현 계획(폴더 구조, 주요 컴포넌트/함수)을 먼저 제시해 주세요.
`);

  if (data.goalDescription) {
    parts.push(`### 구현 목표\n${data.goalDescription}\n`);
  }

  if (data.techStack) {
    parts.push(`### 기술 스택\n${data.techStack}\n`);
  }

  if (data.constraints) {
    parts.push(`### 제약 조건\n${data.constraints}\n`);
  }

  if (data.currentCodeSnippet) {
    parts.push(`### 현재 코드
\`\`\`
${data.currentCodeSnippet}
\`\`\`

**코드 분석 요청:**
- 먼저 현재 코드의 오류나 개선 가능한 포인트를 설명해 주세요.
- 그 다음 개선된 코드와 개선 이유를 제시해 주세요.
`);
  }

  if (data.wantStepPlan) {
    parts.push(`
### 단계별 계획 요청
계획을 더 세분화하여 다음 순서로 제시해 주세요:
1. **환경 설정**: 필요한 도구, 라이브러리 설치
2. **최소 동작 예제**: 핵심 기능만 동작하는 프로토타입
3. **기능 확장**: 추가 기능 구현
4. **테스트 및 리팩터링**: 버그 수정, 코드 정리
`);
  }

  if (data.wantRefactor) {
    parts.push(`
### 리팩터링 요청
- 코드의 가독성, 유지보수성, 성능을 개선해 주세요.
- 변경 전후 비교와 개선 이유를 설명해 주세요.
`);
  }

  parts.push(`
### Replit 환경 고려사항
- 가능하면 단일 파일 또는 최소한의 의존성만 사용해 주세요.
- 실행 방법을 주석으로 명시해 주세요.
- 외부 유료 API는 사용하지 마세요.
`);

  return parts.join('\n');
}

export function buildResearch(common: CommonSettings, data: ResearchInputs): string {
  const parts: string[] = [];
  parts.push('## 작업 지시: 연구/논문\n');

  if (data.researchTopic) {
    parts.push(`### 연구 주제\n${data.researchTopic}\n`);
  }

  if (data.researchQuestion) {
    parts.push(`### 연구 질문\n${data.researchQuestion}\n`);
  }

  if (data.methodology) {
    parts.push(`### 연구 방법론\n${data.methodology}\n`);
  }

  if (data.targetVenueOrClass) {
    parts.push(`### 대상 학회/수업\n${data.targetVenueOrClass}\n`);
  }

  if (data.existingWorkSummary) {
    parts.push(`### 기존 연구 요약\n${data.existingWorkSummary}\n`);
  }

  if (data.lengthTarget) {
    parts.push(`### 목표 분량\n${data.lengthTarget}\n`);
  }

  if (common.outlineMode === 'outline') {
    parts.push(`
### 구조화 요청 (아웃라인 모드)
다음 영역으로 나눈 연구 구조를 생성해 주세요:
1. **연구 목적**: 왜 이 연구가 필요한가?
2. **연구 질문**: 무엇을 밝히고자 하는가?
3. **가설**: 예상되는 결과는?
4. **방법**: 어떻게 연구할 것인가?
5. **기대 결과**: 어떤 결과가 예상되는가?
6. **한계**: 연구의 제한점은?
7. **참고문헌 영역**: 어떤 문헌을 참고해야 하는가?
`);
  } else {
    parts.push(`
### 본문 작성 요청 (완전 작성 모드)
연구계획서 형식으로 ${data.lengthTarget || '적절한 분량'}으로 작성해 주세요.
각 섹션(서론, 문헌검토, 연구방법, 예상결과, 결론)을 포함해 주세요.
`);
  }

  if (common.includeReferences) {
    parts.push(`
### 선행연구 탐색 안내
- 검색 전략: 어떤 키워드 조합으로 검색해야 하는지
- 추천 데이터베이스: Web of Science, Scopus, Google Scholar, 국내 학술 DB (RISS, DBpia, KCI 등)
- 핵심 논문 5~10편 추천 (가능한 경우 DOI 포함)
`);
  }

  return parts.join('\n');
}

export function buildCareerEmail(common: CommonSettings, data: CareerEmailInputs): string {
  const parts: string[] = [];
  
  const isCoverLetter = data.documentType === 'cover-letter';
  
  if (isCoverLetter) {
    parts.push('## 작업 지시: 자기소개서/커버레터\n');
  } else {
    parts.push('## 작업 지시: 커리어/이메일\n');
    
    let emailTypeDescription = '';
    switch (data.emailType) {
      case 'professor':
        emailTypeDescription = '지도교수/수업 교수에게 보내는 이메일 (면담 요청, 마감 연장 요청, 추천서 요청 등)';
        break;
      case 'hr':
        emailTypeDescription = '채용담당자용 이메일 (지원서 제출, 후속 문의, 인터뷰 감사메일)';
        break;
      case 'networking':
        emailTypeDescription = '선배/현업자에게 네트워킹 및 조언 요청';
        break;
      default:
        emailTypeDescription = '기타 비즈니스 이메일';
    }
    parts.push(`### 이메일 유형\n${emailTypeDescription}\n`);
  }

  if (data.purpose) {
    parts.push(`### 목적\n${data.purpose}\n`);
  }

  if (data.receiverProfile) {
    parts.push(`### 수신자/대상 정보\n${data.receiverProfile}\n`);
  }

  if (data.keyPoints) {
    parts.push(`### 핵심 내용/경험\n${data.keyPoints}\n`);
  }

  if (data.wantCompanyResearch) {
    parts.push(`
### 기업/연구실 조사 (1단계)
다음 정보를 조사하고 정리해 주세요:
1. **사업/연구 분야**: 주요 사업 영역, 연구 분야
2. **최근 이슈**: 최근 뉴스, 프로젝트, 발표 등
3. **핵심 키워드**: 기업 문화, 핵심 가치, 인재상
4. **연결 아이디어**: 내 경험과 연결할 수 있는 포인트
`);
  }

  if (data.wantOutline) {
    if (isCoverLetter) {
      parts.push(`
### 자기소개서 구조 설계 (2단계)
다음 구조로 아웃라인을 작성해 주세요:
1. **지원동기**: 왜 이 기업/연구실인가?
2. **관련 경험**: 어떤 경험이 있는가?
3. **역량**: 어떤 역량을 보유했는가?
4. **비전**: 입사 후 어떻게 기여하겠는가?
`);
    } else {
      parts.push(`
### 이메일 구조 설계 (2단계)
다음 구조로 이메일을 구성해 주세요:
1. **제목**: 간결하고 목적이 명확한 제목
2. **인사**: 상대방에 맞는 적절한 인사말
3. **본문**: 상황 설명 → 요청/감사 내용 → 마무리
4. **서명**: 이름, 소속, 연락처
`);
    }
  }

  if (data.wantFullWrite) {
    if (isCoverLetter) {
      parts.push(`
### 자기소개서 완전 작성 (3단계)
위 구조에 따라 ${data.lengthPreset || '적절한 분량'}으로 자기소개서를 작성해 주세요.
- 구체적인 경험과 성과 중심으로 작성
- 해당 기업/연구실에 맞춤화된 내용
- 진정성 있는 어조 유지
`);
    } else {
      parts.push(`
### 이메일 완전 작성 (3단계)
위 구조에 따라 이메일을 작성해 주세요.
- 한국어 극존대/공손체 사용
- 상황에 적합한 어조 유지
`);
      if (data.lengthPreset) {
        const lengthMap: Record<string, string> = {
          '짧게 (5~7문장)': '5~7문장 내외의 간결한 이메일',
          '보통 (8~12문장)': '8~12문장의 적절한 길이',
          '길게': '상세한 설명이 포함된 긴 이메일'
        };
        parts.push(`### 분량\n${lengthMap[data.lengthPreset] || data.lengthPreset}\n`);
      }
    }
  }

  if (!data.wantOutline && !data.wantFullWrite && !data.wantCompanyResearch) {
    if (isCoverLetter) {
      parts.push(`
### 자기소개서 구조 요청
다음 구조로 작성해 주세요:
1. **지원동기**: 왜 이 기업/연구실인가?
2. **관련 경험**: 어떤 경험이 있는가?
3. **역량**: 어떤 역량을 보유했는가?
4. **비전**: 입사 후 어떻게 기여하겠는가?
`);
    } else {
      parts.push(`
### 이메일 구조 요청
다음 구조로 작성해 주세요:
1. **제목**: 간결하고 목적이 명확한 제목
2. **인사**: 상대방에 맞는 적절한 인사말
3. **본문**: 상황 설명 → 요청/감사 내용 → 마무리
4. **서명**: 이름, 소속, 연락처

- 한국어 극존대/공손체를 사용해 주세요.
`);
    }

    if (data.lengthPreset && !isCoverLetter) {
      const lengthMap: Record<string, string> = {
        '짧게 (5~7문장)': '5~7문장 내외의 간결한 이메일',
        '보통 (8~12문장)': '8~12문장의 적절한 길이',
        '길게': '상세한 설명이 포함된 긴 이메일'
      };
      parts.push(`### 분량\n${lengthMap[data.lengthPreset] || data.lengthPreset}\n`);
    }
    if (data.lengthPreset && isCoverLetter) {
      parts.push(`### 분량\n${data.lengthPreset}\n`);
    }
  }

  return parts.join('\n');
}

export function buildImage(common: CommonSettings, data: ImageInputs): string {
  const parts: string[] = [];
  parts.push('## 작업 지시: 이미지 생성 프롬프트\n');

  parts.push(`**참고**: 이미지 생성기(Midjourney, DALL-E, Stable Diffusion 등)에서 바로 붙여넣을 수 있는 영어 중심 프롬프트를 생성해 주세요. 필요한 경우 한국어로 보충 설명을 달아 주세요.\n`);

  if (data.imageGoal) {
    parts.push(`### 이미지 목적\n${data.imageGoal}\n`);
  }

  if (data.subject) {
    parts.push(`### 주요 피사체\n${data.subject}\n`);
  }

  if (data.style) {
    parts.push(`### 스타일\n${data.style}\n`);
  }

  if (data.colorPalette) {
    parts.push(`### 색상 팔레트\n${data.colorPalette}\n`);
  }

  if (data.resolutionOrRatio) {
    parts.push(`### 해상도/비율\n${data.resolutionOrRatio}\n`);
  }

  const detailLevelMap: Record<string, string> = {
    'simple': '심플 - 핵심 요소만',
    'medium': '중간 - 적당한 디테일',
    'detailed': '상세 - 풍부한 디테일'
  };

  if (data.detailLevel) {
    parts.push(`### 디테일 수준\n${detailLevelMap[data.detailLevel]}\n`);
  }

  if (data.negativePrompt) {
    parts.push(`### 제외할 요소 (Negative Prompt)\n${data.negativePrompt}\n`);
  }

  parts.push(`
### 프롬프트 구조
다음 순서로 프롬프트를 작성해 주세요:
1. **Main subject and composition**: 주요 피사체와 구도
2. **Style and mood**: 스타일과 분위기
3. **Color palette**: 색상 팔레트
4. **Lighting and background**: 조명과 배경
5. **Resolution / aspect ratio**: 해상도와 비율
6. **Negative prompts**: 원하지 않는 요소
`);

  return parts.join('\n');
}

function getToneInstruction(tonePreset: string): string {
  switch (tonePreset) {
    case 'academic':
      return '학술적 보고서체(~다/~이다 어미)로 작성해 주세요.';
    case 'report':
      return '교수 제출용 보고서체로, 공손하지만 과도하게 딱딱하지 않게 작성해 주세요.';
    case 'casual':
      return '친구에게 설명하듯 자연스러운 문체로 작성해 주세요.';
    case 'formalEmail':
      return '교수/HR에게 보내는 이메일용 극존대체로 작성해 주세요.';
    case 'presentation':
      return '발표 대본용 구어체로 작성해 주세요.';
    default:
      return '적절한 문체로 작성해 주세요.';
  }
}
