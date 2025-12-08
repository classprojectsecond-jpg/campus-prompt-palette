import { useState, useEffect, useCallback } from 'react';
import type { AppState, SavedPrompt, TabType, CommonSettings, StageSelection, FileAttachment, ReportTabData, ExamTabData, CodingTabData, ResearchTabData, CareerTabData, ImageTabData } from '@/types/prompt';

const initialCommonSettings: CommonSettings = {
  mode: 'task',
  resultFormat: 'full',
  includeSources: false,
  includeSelfCheck: true,
  subjectName: '',
  majorType: 'major',
  gradeLevel: '3',
  professorStyle: 'unknown',
  userMajor: '',
  interestAreas: '',
  writingStyleSample: '',
  deadlineType: 'assignment',
  deadlineValue: '',
  aiRegulation: '',
  includeRegulation: false,
  targetModel: 'chatgpt',
  targetModelOther: '',
  explanationLanguage: 'korean',
  outputLanguage: 'korean',
  difficultyLevel: 'undergraduate',
};

const initialStages: StageSelection = {
  research: false,
  outline: true,
  fullWrite: false,
};

const initialFileAttachment: FileAttachment = {
  hasAttachment: false,
  description: '',
};

const initialReportData: ReportTabData = {
  taskDescription: '',
  topic: '',
  rubric: '',
  researchScope: '',
  sourceTypes: '',
  outlineStructure: '5-paragraph',
  outlineOther: '',
  wordCountPreset: '1500',
  wordCountOther: '',
  tone: 'academic',
};

const initialExamData: ExamTabData = {
  examScope: '',
  examType: '',
  notesText: '',
  summaryType: 'concept-example-trap',
  summaryOther: '',
  wordCountPreset: '400',
  wordCountOther: '',
};

const initialCodingData: CodingTabData = {
  language: 'python',
  languageOther: '',
  environment: '',
  featureDescription: '',
  currentCode: '',
  errorMessage: '',
  goal: 'script',
  writeMode: 'minimal-code',
  wordCountPreset: '600',
  wordCountOther: '',
};

const initialResearchData: ResearchTabData = {
  researchTopic: '',
  currentIdea: '',
  referenceSummary: '',
  literatureKeywords: '',
  outlineStructure: 'proposal',
  outlineOther: '',
  wordCountPreset: '1000',
  wordCountOther: '',
};

const initialCareerData: CareerTabData = {
  documentType: 'professor-email',
  recipientInfo: '',
  coreMessage: '',
  experience: '',
  existingDraft: '',
  companyResearchMode: false,
  outlineStructure: 'email',
  emailLength: 'medium',
  emailLengthOther: '',
  coverLetterWordCount: '800',
  coverLetterWordCountOther: '',
};

const initialImageData: ImageTabData = {
  imageType: 'logo',
  serviceName: '',
  tagline: '',
  styleKeywords: '',
  referenceDescription: '',
  preserveElements: '',
  platform: '',
  promptMode: 'full',
  includeBothLanguages: true,
};

const STORAGE_KEY = 'campus-prompt-palette-saved-prompts';

export function useAppState() {
  const [activeTab, setActiveTab] = useState<TabType>('report');
  const [commonSettings, setCommonSettings] = useState<CommonSettings>(initialCommonSettings);
  const [stages, setStages] = useState<StageSelection>(initialStages);
  const [fileAttachment, setFileAttachment] = useState<FileAttachment>(initialFileAttachment);
  const [reportData, setReportData] = useState<ReportTabData>(initialReportData);
  const [examData, setExamData] = useState<ExamTabData>(initialExamData);
  const [codingData, setCodingData] = useState<CodingTabData>(initialCodingData);
  const [researchData, setResearchData] = useState<ResearchTabData>(initialResearchData);
  const [careerData, setCareerData] = useState<CareerTabData>(initialCareerData);
  const [imageData, setImageData] = useState<ImageTabData>(initialImageData);
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');

  // Load saved prompts from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedPrompts(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load saved prompts:', e);
    }
  }, []);

  // Save prompts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPrompts));
    } catch (e) {
      console.error('Failed to save prompts:', e);
    }
  }, [savedPrompts]);

  const savePrompt = useCallback((title: string, notes: string) => {
    const newPrompt: SavedPrompt = {
      id: Date.now().toString(),
      title,
      tabType: activeTab,
      prompt: generatedPrompt,
      notes,
      createdAt: new Date().toISOString(),
    };
    setSavedPrompts(prev => [newPrompt, ...prev]);
  }, [activeTab, generatedPrompt]);

  const deletePrompt = useCallback((id: string) => {
    setSavedPrompts(prev => prev.filter(p => p.id !== id));
  }, []);

  const loadPrompt = useCallback((prompt: SavedPrompt) => {
    setGeneratedPrompt(prompt.prompt);
    setActiveTab(prompt.tabType);
  }, []);

  return {
    activeTab,
    setActiveTab,
    commonSettings,
    setCommonSettings,
    stages,
    setStages,
    fileAttachment,
    setFileAttachment,
    reportData,
    setReportData,
    examData,
    setExamData,
    codingData,
    setCodingData,
    researchData,
    setResearchData,
    careerData,
    setCareerData,
    imageData,
    setImageData,
    savedPrompts,
    savePrompt,
    deletePrompt,
    loadPrompt,
    generatedPrompt,
    setGeneratedPrompt,
  };
}
