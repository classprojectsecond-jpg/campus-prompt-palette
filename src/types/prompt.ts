export type TabType = 'report' | 'exam' | 'coding' | 'research' | 'career' | 'image';

export interface CommonSettings {
  mode: 'learning' | 'task';
  resultFormat: 'outline' | 'full';
  includeSources: boolean;
  includeSelfCheck: boolean;
  subjectName: string;
  majorType: 'major' | 'general' | 'other';
  gradeLevel: '1' | '2' | '3' | '4' | 'graduate' | 'other';
  professorStyle: 'strict' | 'flexible' | 'unknown';
  userMajor: string;
  interestAreas: string;
  writingStyleSample: string;
  deadlineType: 'assignment' | 'exam' | 'other';
  deadlineValue: string;
  aiRegulation: string;
  includeRegulation: boolean;
  targetModel: 'chatgpt' | 'gemini' | 'other';
  targetModelOther: string;
  explanationLanguage: 'korean' | 'english' | 'mixed';
  outputLanguage: 'korean' | 'english' | 'other';
  difficultyLevel: 'high-school' | 'undergraduate' | 'graduate' | 'expert';
}

export interface StageSelection {
  research: boolean;
  outline: boolean;
  fullWrite: boolean;
}

export interface FileAttachment {
  hasAttachment: boolean;
  description: string;
}

export interface ReportTabData {
  taskDescription: string;
  topic: string;
  rubric: string;
  researchScope: string;
  sourceTypes: string;
  outlineStructure: '3-paragraph' | '5-paragraph' | 'other';
  outlineOther: string;
  wordCountPreset: '300' | '800' | '1500' | '3000' | 'other';
  wordCountOther: string;
  tone: 'academic' | 'report' | 'presentation' | 'casual';
}

export interface ExamTabData {
  examScope: string;
  examType: string;
  notesText: string;
  summaryType: 'concept-list' | 'concept-example-trap' | 'other';
  summaryOther: string;
  wordCountPreset: '200' | '400' | '600' | 'bullet' | 'other';
  wordCountOther: string;
}

export interface CodingTabData {
  language: 'python' | 'javascript' | 'c-cpp' | 'matlab' | 'other';
  languageOther: string;
  environment: string;
  featureDescription: string;
  currentCode: string;
  errorMessage: string;
  goal: 'script' | 'app' | 'library';
  writeMode: 'minimal-code' | 'explanation';
  wordCountPreset: '300' | '600' | '1000' | 'other';
  wordCountOther: string;
}

export interface ResearchTabData {
  researchTopic: string;
  currentIdea: string;
  referenceSummary: string;
  literatureKeywords: string;
  outlineStructure: 'proposal' | 'review' | 'other';
  outlineOther: string;
  wordCountPreset: '500' | '1000' | '1500' | 'other';
  wordCountOther: string;
}

export interface CareerTabData {
  documentType: 'professor-email' | 'internship' | 'company-inquiry' | 'cover-letter';
  recipientInfo: string;
  coreMessage: string;
  experience: string;
  existingDraft: string;
  companyResearchMode: boolean;
  outlineStructure: 'email' | 'cover-letter';
  emailLength: 'short' | 'medium' | 'long' | 'other';
  emailLengthOther: string;
  coverLetterWordCount: '500' | '800' | '1000' | '1500' | 'other';
  coverLetterWordCountOther: string;
}

export interface ImageTabData {
  imageType: 'logo' | 'app-ui' | 'poster' | 'thumbnail' | 'illustration';
  serviceName: string;
  tagline: string;
  styleKeywords: string;
  referenceDescription: string;
  preserveElements: string;
  platform: string;
  promptMode: 'outline' | 'full';
  includeBothLanguages: boolean;
}

export interface SavedPrompt {
  id: string;
  title: string;
  tabType: TabType;
  prompt: string;
  notes: string;
  createdAt: string;
}

export interface AppState {
  activeTab: TabType;
  commonSettings: CommonSettings;
  stages: StageSelection;
  fileAttachment: FileAttachment;
  reportData: ReportTabData;
  examData: ExamTabData;
  codingData: CodingTabData;
  researchData: ResearchTabData;
  careerData: CareerTabData;
  imageData: ImageTabData;
  savedPrompts: SavedPrompt[];
  generatedPrompt: string;
}
