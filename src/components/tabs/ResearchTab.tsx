import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { ResearchTabData, StageSelection } from '@/types/prompt';

interface ResearchTabProps {
  data: ResearchTabData;
  stages: StageSelection;
  onChange: (data: ResearchTabData) => void;
}

export function ResearchTab({ data, stages, onChange }: ResearchTabProps) {
  const update = <K extends keyof ResearchTabData>(key: K, value: ResearchTabData[K]) => {
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
            <Label className="input-label">연구 주제</Label>
            <Input
              value={data.researchTopic}
              onChange={(e) => update('researchTopic', e.target.value)}
              placeholder="예: 딥러닝 기반 자연어 처리 기술 동향"
              className="bg-secondary/30 border-border/50"
            />
          </div>

          <div>
            <Label className="input-label">현재 아이디어</Label>
            <Textarea
              value={data.currentIdea}
              onChange={(e) => update('currentIdea', e.target.value)}
              placeholder="현재 생각하고 있는 연구 아이디어를 설명하세요."
              className="min-h-[80px] bg-secondary/30 border-border/50"
            />
          </div>

          <div>
            <Label className="input-label">참고 논문 요약/초록</Label>
            <Textarea
              value={data.referenceSummary}
              onChange={(e) => update('referenceSummary', e.target.value)}
              placeholder="참고하려는 주요 논문의 요약이나 초록을 붙여넣으세요."
              className="min-h-[100px] bg-secondary/30 border-border/50"
            />
          </div>
        </div>
      </div>

      {/* Research Stage */}
      {stages.research && (
        <div className="glass-card p-4 rounded-xl animate-slide-up">
          <h3 className="section-title text-campus-teal">문헌 조사·정리 옵션</h3>
          <div>
            <Label className="input-label">검색 키워드</Label>
            <Input
              value={data.literatureKeywords}
              onChange={(e) => update('literatureKeywords', e.target.value)}
              placeholder="예: NLP, transformer, attention mechanism"
              className="bg-secondary/30 border-border/50"
            />
            <p className="helper-text">
              핵심 논문 5~10편을 요약하고, 내 연구와의 연결 코멘트를 작성해 달라고 요청합니다.
            </p>
          </div>
        </div>
      )}

      {/* Outline Stage */}
      {stages.outline && (
        <div className="glass-card p-4 rounded-xl animate-slide-up">
          <h3 className="section-title text-campus-blue">구조 설계 옵션</h3>
          <RadioGroup
            value={data.outlineStructure}
            onValueChange={(v) => update('outlineStructure', v as any)}
            className="space-y-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="proposal" id="proposal" />
              <Label htmlFor="proposal" className="cursor-pointer text-sm">연구계획서 구조</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="review" id="review" />
              <Label htmlFor="review" className="cursor-pointer text-sm">리뷰 논문 구조</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="other" id="research-other" />
              <Label htmlFor="research-other" className="cursor-pointer text-sm">기타</Label>
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
                <SelectItem value="500">약 500자</SelectItem>
                <SelectItem value="1000">약 1000자</SelectItem>
                <SelectItem value="1500">약 1500자</SelectItem>
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
            <p className="helper-text">
              대학원 연구계획 스타일로 작성하고, 마지막에 한계/리스크를 bullet으로 정리합니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
