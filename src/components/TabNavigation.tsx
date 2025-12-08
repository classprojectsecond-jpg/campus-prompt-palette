import { FileText, BookOpen, Code, FlaskConical, Briefcase, Image } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { TabType } from '@/types/prompt';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'report', label: '레포트·에세이', icon: FileText },
  { id: 'exam', label: '시험 대비', icon: BookOpen },
  { id: 'coding', label: '코딩', icon: Code },
  { id: 'research', label: '연구·논문', icon: FlaskConical },
  { id: 'career', label: '커리어·이메일', icon: Briefcase },
  { id: 'image', label: '이미지 생성', icon: Image },
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as TabType)} className="w-full">
      <TabsList className="w-full h-auto flex-wrap gap-1 bg-secondary/50 p-1.5 rounded-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex-1 min-w-[120px] gap-2 py-2.5 px-3 text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-card data-[state=active]:text-primary rounded-lg transition-all"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
