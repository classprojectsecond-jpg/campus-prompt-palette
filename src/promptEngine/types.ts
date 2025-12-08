export type TabId =
  | "reportEssay"
  | "exam"
  | "coding"
  | "research"
  | "careerEmail"
  | "image";

export interface CommonSettings {
  mode: "learning" | "deliverable";
  outlineMode: "outline" | "full";
  tonePreset:
    | "academic"
    | "report"
    | "casual"
    | "formalEmail"
    | "presentation";
  includeReferences: boolean;
  selfCheckEnabled: boolean;
  subjectProfile: {
    courseName?: string;
    majorOrGE?: string;
    level?: "HS" | "UG1" | "UG2" | "UG3" | "UG4" | "GR";
    professorStyle?: "strict" | "relaxed";
    assignmentType?: string;
  };
  userProfile: {
    major?: string;
    interests?: string;
    preferredExamples?: string;
  };
  styleSampleText?: string;
  timePressure?: {
    deadlineDescription?: string;
    examRemaining?: string;
  };
  aiPolicyText?: string;
  modelPreference?: "ChatGPT" | "Gemini" | "Other";
  languageLevel?: "HS" | "UG" | "GR";
}

export interface ReportEssayInputs {
  assignmentSummary?: string;
  topic?: string;
  requiredSections?: string;
  lengthTarget?: string;
  keyPoints?: string;
  prohibitedThings?: string;
  attachedMaterialSummary?: string;
  stageCollectMaterial: boolean;
  stageOutline: boolean;
  stageDraft: boolean;
}

export interface ExamInputs {
  examScope?: string;
  questionType?: string;
  myWeakPoints?: string;
  timeAvailable?: string;
  wantPracticeSet?: boolean;
  wantSummarySheet?: boolean;
}

export interface CodingInputs {
  goalDescription?: string;
  techStack?: string;
  constraints?: string;
  currentCodeSnippet?: string;
  wantStepPlan?: boolean;
  wantRefactor?: boolean;
}

export interface ResearchInputs {
  researchTopic?: string;
  researchQuestion?: string;
  methodology?: string;
  targetVenueOrClass?: string;
  existingWorkSummary?: string;
  lengthTarget?: string;
}

export interface CareerEmailInputs {
  emailType?: "professor" | "hr" | "networking" | "etc";
  purpose?: string;
  receiverProfile?: string;
  keyPoints?: string;
  lengthPreset?: string;
  wantCompanyResearch?: boolean;
  wantOutline?: boolean;
  wantFullWrite?: boolean;
  documentType?: "email" | "cover-letter";
}

export interface ImageInputs {
  imageGoal?: string;
  subject?: string;
  style?: string;
  colorPalette?: string;
  resolutionOrRatio?: string;
  detailLevel?: "simple" | "medium" | "detailed";
  negativePrompt?: string;
}

export type TabInputs =
  | { tabId: "reportEssay"; data: ReportEssayInputs }
  | { tabId: "exam"; data: ExamInputs }
  | { tabId: "coding"; data: CodingInputs }
  | { tabId: "research"; data: ResearchInputs }
  | { tabId: "careerEmail"; data: CareerEmailInputs }
  | { tabId: "image"; data: ImageInputs };

export interface PromptItem {
  id: string;
  title: string;
  tabId: TabId;
  createdAt: string;
  prompt: string;
}
