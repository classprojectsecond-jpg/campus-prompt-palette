import { Header } from '@/components/Header';
import { TabNavigation } from '@/components/TabNavigation';
import { StageSelector } from '@/components/StageSelector';
import { FileAttachmentSection } from '@/components/FileAttachmentSection';
import { CommonSettings } from '@/components/CommonSettings';
import { PromptPreview } from '@/components/PromptPreview';
import { PromptLibrary } from '@/components/PromptLibrary';
import { ReportTab } from '@/components/tabs/ReportTab';
import { ExamTab } from '@/components/tabs/ExamTab';
import { CodingTab } from '@/components/tabs/CodingTab';
import { ResearchTab } from '@/components/tabs/ResearchTab';
import { CareerTab } from '@/components/tabs/CareerTab';
import { ImageTab } from '@/components/tabs/ImageTab';
import { useAppState } from '@/hooks/useAppState';
import { useTheme } from '@/hooks/useTheme';
import { generatePrompt } from '@/utils/promptBuilder';

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const state = useAppState();

  const handleGenerate = () => {
    const prompt = generatePrompt(
      state.activeTab, state.commonSettings, state.stages, state.fileAttachment,
      state.reportData, state.examData, state.codingData, state.researchData,
      state.careerData, state.imageData
    );
    state.setGeneratedPrompt(prompt);
  };

  const renderTabContent = () => {
    switch (state.activeTab) {
      case 'report': return <ReportTab data={state.reportData} stages={state.stages} onChange={state.setReportData} />;
      case 'exam': return <ExamTab data={state.examData} stages={state.stages} onChange={state.setExamData} />;
      case 'coding': return <CodingTab data={state.codingData} stages={state.stages} onChange={state.setCodingData} />;
      case 'research': return <ResearchTab data={state.researchData} stages={state.stages} onChange={state.setResearchData} />;
      case 'career': return <CareerTab data={state.careerData} stages={state.stages} onChange={state.setCareerData} />;
      case 'image': return <ImageTab data={state.imageData} stages={state.stages} onChange={state.setImageData} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      
      <main className="max-w-[1600px] mx-auto p-4 md:p-6">
        <div className="mb-6">
          <TabNavigation activeTab={state.activeTab} onTabChange={state.setActiveTab} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Tab Content */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {renderTabContent()}
            <StageSelector stages={state.stages} onChange={state.setStages} />
            <FileAttachmentSection attachment={state.fileAttachment} onChange={state.setFileAttachment} />
            <PromptPreview prompt={state.generatedPrompt} onGenerate={handleGenerate} onSave={state.savePrompt} />
          </div>

          {/* Right Column - Settings & Library */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            <CommonSettings settings={state.commonSettings} onChange={state.setCommonSettings} />
            <PromptLibrary prompts={state.savedPrompts} onLoad={state.loadPrompt} onDelete={state.deletePrompt} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
