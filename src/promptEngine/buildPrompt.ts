import type { CommonSettings, TabInputs } from './types';
import {
  buildReportEssay,
  buildExam,
  buildCoding,
  buildResearch,
  buildCareerEmail,
  buildImage
} from './tabBuilders';

export function buildPrompt(common: CommonSettings, tab: TabInputs): string {
  const sections: string[] = [];

  sections.push(buildRoleAndContext(common));
  sections.push(buildAIPolicyAndMode(common));
  sections.push(buildOutlineModeSetting(common));
  sections.push(buildToneSetting(common));
  sections.push(buildCommonOptions(common));
  sections.push(buildTabSpecificContent(common, tab));
  sections.push(buildReflectionPattern(common));

  return sections.filter(s => s.trim()).join('\n\n---\n\n');
}

function buildRoleAndContext(common: CommonSettings): string {
  const parts: string[] = [];

  parts.push(`# 역할 정의

당신은 **한국 대학생을 돕는 전문 AI 어시스턴트**입니다.`);

  const contextParts: string[] = [];

  if (common.subjectProfile.courseName) {
    contextParts.push(`- 과목: ${common.subjectProfile.courseName}`);
  }

  if (common.subjectProfile.majorOrGE) {
    contextParts.push(`- 전공/교양 구분: ${common.subjectProfile.majorOrGE}`);
  }

  if (common.subjectProfile.level) {
    const levelMap: Record<string, string> = {
      'HS': '고등학생',
      'UG1': '대학교 1학년',
      'UG2': '대학교 2학년',
      'UG3': '대학교 3학년',
      'UG4': '대학교 4학년',
      'GR': '대학원생'
    };
    contextParts.push(`- 학년: ${levelMap[common.subjectProfile.level]}`);
  }

  if (common.subjectProfile.professorStyle) {
    const styleMap: Record<string, string> = {
      'strict': '엄격한 채점 기준',
      'relaxed': '유연한 채점 기준'
    };
    contextParts.push(`- 교수 스타일: ${styleMap[common.subjectProfile.professorStyle]}`);
  }

  if (common.subjectProfile.assignmentType) {
    contextParts.push(`- 과제 유형: ${common.subjectProfile.assignmentType}`);
  }

  if (common.userProfile.major) {
    contextParts.push(`- 사용자 전공: ${common.userProfile.major}`);
  }

  if (common.userProfile.interests) {
    contextParts.push(`- 관심 분야: ${common.userProfile.interests}`);
  }

  if (common.userProfile.preferredExamples) {
    contextParts.push(`- 선호 예시 유형: ${common.userProfile.preferredExamples}`);
  }

  if (common.modelPreference) {
    contextParts.push(`- 대상 모델: ${common.modelPreference}`);
  }

  if (common.languageLevel) {
    const langLevelMap: Record<string, string> = {
      'HS': '고등학생 수준',
      'UG': '학부생 수준',
      'GR': '대학원생 수준'
    };
    contextParts.push(`- 설명 수준: ${langLevelMap[common.languageLevel]}`);
  }

  if (contextParts.length > 0) {
    parts.push('\n## 맥락 정보\n' + contextParts.join('\n'));
  }

  if (common.styleSampleText) {
    parts.push(`
## 스타일 참고

아래 샘플 글과 비슷한 수준의 어휘, 문장 길이, 문체로 작성해 주세요:

---
${common.styleSampleText}
---`);
  }

  if (common.timePressure?.deadlineDescription || common.timePressure?.examRemaining) {
    parts.push(`
## 시간 제약

${common.timePressure.deadlineDescription ? `- 마감: ${common.timePressure.deadlineDescription}` : ''}
${common.timePressure.examRemaining ? `- 시험까지 남은 시간: ${common.timePressure.examRemaining}` : ''}

시간 내에 가장 중요한 내용을 우선적으로 다뤄 주세요.`);
  }

  return parts.join('\n');
}

function buildAIPolicyAndMode(common: CommonSettings): string {
  const parts: string[] = [];

  if (common.aiPolicyText) {
    parts.push(`# AI 사용 규정

다음 규정을 먼저 확인하고, 이 범위 내에서만 답변해 주세요:

> ${common.aiPolicyText.split('\n').join('\n> ')}

위 규정을 준수하면서 답변을 작성해 주세요.`);
  }

  parts.push(`# 응답 모드`);

  if (common.mode === 'learning') {
    parts.push(`
## 학습 모드

**중요**: 정답을 바로 제시하지 마세요!

다음 순서로 답변해 주세요:
1. **이해 확인 질문**: 학생이 이미 알고 있는 내용을 확인하는 질문 1~2개
2. **개념 설명**: 핵심 개념을 단계별로 설명
3. **보충 예시**: 이해를 돕는 추가 예시 제공

학생이 스스로 생각하고 답을 찾아갈 수 있도록 도와주세요.`);
  } else {
    parts.push(`
## 결과물 모드

제출용 초안을 작성해 주세요.

**유의사항**:
- 실제 제출 전에 사용자가 반드시 직접 수정하고 검토해야 합니다.
- 완성도 높은 초안을 제공하되, 최종 책임은 사용자에게 있음을 전제합니다.
- 표절 검사를 통과할 수 있도록 독창적인 표현을 사용해 주세요.`);
  }

  return parts.join('\n\n');
}

function buildOutlineModeSetting(common: CommonSettings): string {
  if (common.outlineMode === 'outline') {
    return `# 작성 형식: 아웃라인 중심

다음 형식으로 작성해 주세요:
- 목차 구조를 명확히
- 각 단락의 주장과 근거를 간결하게
- 필요한 자료 리스트
- 문장 길이는 짧게, 핵심만`;
  } else {
    return `# 작성 형식: 완전 작성

실제 완성본에 가까운 수준으로 작성해 주세요:
- 서론, 본론, 결론이 완비된 형태
- 문단 간 자연스러운 연결
- 구체적인 예시와 근거 포함`;
  }
}

function buildToneSetting(common: CommonSettings): string {
  let toneDescription = '';

  switch (common.tonePreset) {
    case 'academic':
      toneDescription = `# 말투: 학술적 보고서체

- ~다/~이다 어미 사용
- 객관적이고 논리적인 표현
- 전문 용어 적절히 활용
- 감정적 표현 자제`;
      break;
    case 'report':
      toneDescription = `# 말투: 교수 제출용 보고서체

- 공손하지만 과도하게 딱딱하지 않게
- ~합니다/~입니다 어미 혼용 가능
- 명확하고 간결한 문장
- 적절한 존칭 사용`;
      break;
    case 'casual':
      toneDescription = `# 말투: 캐주얼 설명체

- 친구에게 설명하듯 자연스럽게
- 존댓말/반말 여부는 상황에 맞게
- 이해하기 쉬운 비유 활용
- 딱딱한 전문 용어보다 쉬운 표현 선호`;
      break;
    case 'formalEmail':
      toneDescription = `# 말투: 극존대 이메일체

- 교수/HR에게 보내는 공식 이메일 톤
- ~드립니다/~말씀드립니다 어미
- 최대한 공손하고 정중하게
- 비즈니스 격식 준수`;
      break;
    case 'presentation':
      toneDescription = `# 말투: 발표 대본용 구어체

- 청중에게 말하듯 자연스러운 구어체
- ~요/~습니다 어미
- 적절한 질문과 강조
- 청중의 이해를 확인하는 표현`;
      break;
    default:
      toneDescription = `# 말투: 일반

상황에 맞는 적절한 말투로 작성해 주세요.`;
  }

  return toneDescription;
}

function buildCommonOptions(common: CommonSettings): string {
  const parts: string[] = [];

  if (common.includeReferences) {
    parts.push(`## 출처 제안 요청

주장이나 통계가 나올 때마다:
- 참고할 만한 자료 유형(논문, 보고서, 공신력 있는 웹사이트)을 제안해 주세요.
- 가능하면 구체적인 검색 키워드도 알려 주세요.
- **중요**: 실제 출처 검증은 사용자가 직접 해야 합니다. AI가 제시하는 출처는 참고용일 뿐입니다.`);
  }

  if (common.selfCheckEnabled) {
    parts.push(`## 자기검토 요청

답변 마지막에 다음을 포함해 주세요:

1. **신뢰도 평가**: 이 답변의 신뢰도를 1~10점으로 자체 평가
2. **검증 필요 항목**: 사용자가 추가로 확인해야 할 부분 목록
   - 불확실한 정보
   - 최신 정보 확인 필요 항목
   - 개인적 판단이 포함된 부분`);
  }

  return parts.length > 0 ? parts.join('\n\n') : '';
}

function buildTabSpecificContent(common: CommonSettings, tab: TabInputs): string {
  switch (tab.tabId) {
    case 'reportEssay':
      return buildReportEssay(common, tab.data);
    case 'exam':
      return buildExam(common, tab.data);
    case 'coding':
      return buildCoding(common, tab.data);
    case 'research':
      return buildResearch(common, tab.data);
    case 'careerEmail':
      return buildCareerEmail(common, tab.data);
    case 'image':
      return buildImage(common, tab.data);
    default:
      return '';
  }
}

function buildReflectionPattern(common: CommonSettings): string {
  const parts: string[] = [];

  parts.push(`# 답변 품질 관리`);

  if (common.mode === 'learning') {
    parts.push(`
## Flipped Interaction 패턴 (학습 모드)

답변 구조:
1. **사전 지식 확인**: "먼저, 이 주제에 대해 당신이 이미 알고 있다고 가정되는 내용을 한 단락으로 정리하겠습니다..."
2. **부족한 점 지적**: "다음으로, 보충이 필요한 부분을 말씀드리겠습니다..."
3. **생각해볼 질문**: "스스로 생각해볼 수 있는 질문 1~3개를 던지겠습니다..."
4. **모범 해설**: "마지막으로, 모범 해설을 제시하겠습니다..."`);
  }

  parts.push(`
## 논리 점검

답변 작성 중 스스로 다음을 점검해 주세요:
- 논리적 빈틈이 없는지
- 앞뒤 내용이 일관된지
- 근거가 충분한지

문제가 발견되면 스스로 수정하고, 수정 이유를 간단히 언급해 주세요.`);

  return parts.join('\n');
}

export { buildPrompt as default };
