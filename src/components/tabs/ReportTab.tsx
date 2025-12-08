import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { ReportTabData, StageSelection } from '@/types/prompt';

interface ReportTabProps {
  data: ReportTabData;
  stages: StageSelection;
  onChange: (data: ReportTabData) => void;
}

export function ReportTab({ data, stages, onChange }: ReportTabProps) {
  const update = <K extends keyof ReportTabData>(key: K, value: ReportTabData[K]) => {
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
            <Label className="input-label">과제 설명</Label>
            <Textarea
              value={data.taskDescription}
              onChange={(e) => update('taskDescription', e.target.value)}
              placeholder="과제의 전체적인 설명을 입력하세요."
              className="min-h-[80px] bg-secondary/30 border-border/50"
            />
          </div>

          <div>
            <Label className="input-label">주제</Label>
            <Input
              value={data.topic}
              onChange={(e) => update('topic', e.target.value)}
              placeholder="예: 인공지능의 윤리적 문제"
              className="bg-secondary/30 border-border/50"
            />
          </div>

          <div>
            <Label className="input-label">평가 기준/루브릭</Label>
            <Textarea
              value={data.rubric}
              onChange={(e) => update('rubric', e.target.value)}
              placeholder="평가 기준이나 루브릭이 있다면 입력하세요."
              className="min-h-[60px] bg-secondary/30 border-border/50"
            />
          </div>
        </div>
      </div>

      {/* Research Stage */}
      {stages.research && (
        <div className="glass-card p-4 rounded-xl animate-slide-up">
          <h3 className="section-title text-campus-teal">자료 조사·정리 옵션</h3>
          <div className="space-y-3">
            <div>
              <Label className="input-label">조사 범위</Label>
              <Input
                value={data.researchScope}
                onChange={(e) => update('researchScope', e.target.value)}
                placeholder="예: 최근 5년 내 국내외 논문"
                className="bg-secondary/30 border-border/50"
              />
            </div>
            <div>
              <Label className="input-label">자료 유형</Label>
              <Input
                value={data.sourceTypes}
                onChange={(e) => update('sourceTypes', e.target.value)}
                placeholder="예: 학술논문, 신문기사, 통계자료"
                className="bg-secondary/30 border-border/50"
              />
            </div>
          </div>
        </div>
      )}

      {/* Outline Stage */}
      {stages.outline && (
        <div className="glass-card p-4 rounded-xl animate-slide-up">
          <h3 className="section-title text-campus-blue">아웃라인 옵션</h3>
          <div>
            <Label className="input-label">구조 선택</Label>
            <RadioGroup
              value={data.outlineStructure}
              onValueChange={(v) => update('outlineStructure', v as any)}
              className="space-y-2 mt-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="3-paragraph" id="3p" />
                <Label htmlFor="3p" className="cursor-pointer text-sm">3단락 (서론-본론-결론)</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="5-paragraph" id="5p" />
                <Label htmlFor="5p" className="cursor-pointer text-sm">5단락 (서론-본론1-본론2-본론3-결론)</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="other" id="other-struct" />
                <Label htmlFor="other-struct" className="cursor-pointer text-sm">기타</Label>
              </div>
            </RadioGroup>
            {data.outlineStructure === 'other' && (
              <Input
                value={data.outlineOther}
                onChange={(e) => update('outlineOther', e.target.value)}
                placeholder="원하는 구조를 설명하세요"
                className="mt-2 bg-secondary/30 border-border/50"
              />
            )}
          </div>
        </div>
      )}

      {/* Full Write Stage */}
      {stages.fullWrite && (
        <div className="glass-card p-4 rounded-xl animate-slide-up">
          <h3 className="section-title text-campus-navy">본문 완전 작성 옵션</h3>
          <div className="space-y-3">
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
                  <SelectItem value="300">약 300자</SelectItem>
                  <SelectItem value="800">약 800자</SelectItem>
                  <SelectItem value="1500">약 1500자</SelectItem>
                  <SelectItem value="3000">약 3000자</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
              {data.wordCountPreset === 'other' && (
                <Input
                  value={data.wordCountOther}
                  onChange={(e) => update('wordCountOther', e.target.value)}
                  placeholder="예: A4 2페이지, 2000자 이상"
                  className="mt-2 bg-secondary/30 border-border/50"
                />
              )}
            </div>

            <div>
              <Label className="input-label">문체/말투</Label>
              <Select
                value={data.tone}
                onValueChange={(v) => update('tone', v as any)}
              >
                <SelectTrigger className="bg-secondary/30 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">학술적 문체</SelectItem>
                  <SelectItem value="report">보고서 문체</SelectItem>
                  <SelectItem value="presentation">발표용 문체</SelectItem>
                  <SelectItem value="casual">캐주얼 문체</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
