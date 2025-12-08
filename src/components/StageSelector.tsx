import { Search, List, FileText } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { StageSelection } from '@/types/prompt';

interface StageSelectorProps {
  stages: StageSelection;
  onChange: (stages: StageSelection) => void;
}

export function StageSelector({ stages, onChange }: StageSelectorProps) {
  const handleToggle = (key: keyof StageSelection) => {
    onChange({ ...stages, [key]: !stages[key] });
  };

  return (
    <div className="glass-card p-4 rounded-xl animate-fade-in">
      <h3 className="section-title">
        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
          2
        </span>
        단계 선택
      </h3>
      <p className="helper-text mb-4">
        원하는 단계를 선택하세요. 선택한 단계에 맞춰 프롬프트가 생성됩니다.
      </p>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-campus-teal/20 flex items-center justify-center">
              <Search className="h-4 w-4 text-campus-teal" />
            </div>
            <div>
              <Label htmlFor="research" className="font-medium cursor-pointer">
                자료 조사·정리
              </Label>
              <p className="text-xs text-muted-foreground">관련 자료 수집 및 정리</p>
            </div>
          </div>
          <Switch
            id="research"
            checked={stages.research}
            onCheckedChange={() => handleToggle('research')}
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-campus-blue/20 flex items-center justify-center">
              <List className="h-4 w-4 text-campus-blue" />
            </div>
            <div>
              <Label htmlFor="outline" className="font-medium cursor-pointer">
                아웃라인 생성
              </Label>
              <p className="text-xs text-muted-foreground">구조 및 목차 설계</p>
            </div>
          </div>
          <Switch
            id="outline"
            checked={stages.outline}
            onCheckedChange={() => handleToggle('outline')}
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-campus-navy/20 flex items-center justify-center">
              <FileText className="h-4 w-4 text-campus-navy" />
            </div>
            <div>
              <Label htmlFor="fullWrite" className="font-medium cursor-pointer">
                본문 완전 작성
              </Label>
              <p className="text-xs text-muted-foreground">완성된 글 작성</p>
            </div>
          </div>
          <Switch
            id="fullWrite"
            checked={stages.fullWrite}
            onCheckedChange={() => handleToggle('fullWrite')}
          />
        </div>
      </div>
    </div>
  );
}
