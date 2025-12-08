import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { ExamTabData, StageSelection } from '@/types/prompt';

interface ExamTabProps {
  data: ExamTabData;
  stages: StageSelection;
  onChange: (data: ExamTabData) => void;
}

export function ExamTab({ data, stages, onChange }: ExamTabProps) {
  const update = <K extends keyof ExamTabData>(key: K, value: ExamTabData[K]) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Basic Info */}
      <div className="glass-card p-4 rounded-xl">
        <h3 className="section-title">
          <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
            1
          </span>
          기본 정보
        </h3>
        
        <div className="space-y-3">
          <div>
            <Label className="input-label">시험 범위</Label>
            <Textarea
              value={data.examScope}
              onChange={(e) => update('examScope', e.target.value)}
              placeholder="예: 1장~5장, 미분방정식 파트"
              className="min-h-[60px] bg-secondary/30 border-border/50"
            />
          </div>

          <div>
            <Label className="input-label">시험 유형</Label>
            <Input
              value={data.examType}
              onChange={(e) => update('examType', e.target.value)}
              placeholder="예: 객관식+서술형, 오픈북"
              className="bg-secondary/30 border-border/50"
            />
          </div>

          <div>
            <Label className="input-label">나의 노트/교재 텍스트</Label>
            <Textarea
              value={data.notesText}
              onChange={(e) => update('notesText', e.target.value)}
              placeholder="관련 노트나 교재 내용을 붙여넣으세요."
              className="min-h-[100px] bg-secondary/30 border-border/50"
            />
          </div>
        </div>
      </div>

      {/* Research Stage */}
      {stages.research && (
        <div className="glass-card p-4 rounded-xl animate-slide-up">
          <h3 className="section-title text-campus-teal">자료 조사·정리 옵션</h3>
          <p className="helper-text mb-3">
            장기 대비용 요약, 자주 출제되는 문제 유형 정리를 요청합니다.
          </p>
        </div>
      )}

      {/* Outline Stage */}
      {stages.outline && (
        <div className="glass-card p-4 rounded-xl animate-slide-up">
          <h3 className="section-title text-campus-blue">요약 노트 구조 옵션</h3>
          <RadioGroup
            value={data.summaryType}
            onValueChange={(v) => update('summaryType', v as any)}
            className="space-y-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="concept-list" id="cl" />
              <Label htmlFor="cl" className="cursor-pointer text-sm">개념 리스트 형식</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="concept-example-trap" id="cet" />
              <Label htmlFor="cet" className="cursor-pointer text-sm">개념-예시-함정 형식</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="other" id="summary-other" />
              <Label htmlFor="summary-other" className="cursor-pointer text-sm">기타</Label>
            </div>
          </RadioGroup>
          {data.summaryType === 'other' && (
            <Input
              value={data.summaryOther}
              onChange={(e) => update('summaryOther', e.target.value)}
              placeholder="원하는 형식을 설명하세요"
              className="mt-2 bg-secondary/30 border-border/50"
            />
          )}
        </div>
      )}

      {/* Full Write Stage */}
      {stages.fullWrite && (
        <div className="glass-card p-4 rounded-xl animate-slide-up">
          <h3 className="section-title text-campus-navy">완전 작성 옵션</h3>
          <div>
            <Label className="input-label">분량</Label>
            <Select
              value={data.wordCountPreset}
              onValueChange={(v) => update('wordCountPreset', v as any)}
            >
              <SelectTrigger className="bg-secondary/30 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="200">약 200자</SelectItem>
                <SelectItem value="400">약 400자</SelectItem>
                <SelectItem value="600">약 600자</SelectItem>
                <SelectItem value="bullet">Bullet 형식</SelectItem>
                <SelectItem value="other">기타</SelectItem>
              </SelectContent>
            </Select>
            {data.wordCountPreset === 'other' && (
              <Input
                value={data.wordCountOther}
                onChange={(e) => update('wordCountOther', e.target.value)}
                placeholder="원하는 분량을 입력하세요"
                className="mt-2 bg-secondary/30 border-border/50"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
