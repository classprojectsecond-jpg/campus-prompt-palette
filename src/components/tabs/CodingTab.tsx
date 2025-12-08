import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { CodingTabData, StageSelection } from '@/types/prompt';

interface CodingTabProps {
  data: CodingTabData;
  stages: StageSelection;
  onChange: (data: CodingTabData) => void;
}

export function CodingTab({ data, stages, onChange }: CodingTabProps) {
  const update = <K extends keyof CodingTabData>(key: K, value: CodingTabData[K]) => {
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="input-label">언어</Label>
              <Select
                value={data.language}
                onValueChange={(v) => update('language', v as any)}
              >
                <SelectTrigger className="bg-secondary/30 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="c-cpp">C/C++</SelectItem>
                  <SelectItem value="matlab">MATLAB</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
              {data.language === 'other' && (
                <Input
                  value={data.languageOther}
                  onChange={(e) => update('languageOther', e.target.value)}
                  placeholder="언어명 입력"
                  className="mt-2 bg-secondary/30 border-border/50"
                />
              )}
            </div>

            <div>
              <Label className="input-label">환경</Label>
              <Input
                value={data.environment}
                onChange={(e) => update('environment', e.target.value)}
                placeholder="예: Replit, VS Code, MATLAB"
                className="bg-secondary/30 border-border/50"
              />
            </div>
          </div>

          <div>
            <Label className="input-label">무엇을 만들고 싶나요?</Label>
            <RadioGroup
              value={data.goal}
              onValueChange={(v) => update('goal', v as any)}
              className="flex flex-wrap gap-4 mt-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="script" id="script" />
                <Label htmlFor="script" className="cursor-pointer text-sm">스크립트/알고리즘</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="app" id="app" />
                <Label htmlFor="app" className="cursor-pointer text-sm">앱 만들기 (웹/GUI)</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="library" id="library" />
                <Label htmlFor="library" className="cursor-pointer text-sm">라이브러리/모듈</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="input-label">구현하고 싶은 기능 설명</Label>
            <Textarea
              value={data.featureDescription}
              onChange={(e) => update('featureDescription', e.target.value)}
              placeholder="무엇을 만들고 싶은지 자세히 설명하세요."
              className="min-h-[80px] bg-secondary/30 border-border/50"
            />
          </div>

          <div>
            <Label className="input-label">현재 코드 (선택)</Label>
            <Textarea
              value={data.currentCode}
              onChange={(e) => update('currentCode', e.target.value)}
              placeholder="이미 작성한 코드가 있다면 붙여넣으세요."
              className="min-h-[80px] font-mono text-sm bg-secondary/30 border-border/50"
            />
          </div>

          <div>
            <Label className="input-label">에러 메시지 (선택)</Label>
            <Textarea
              value={data.errorMessage}
              onChange={(e) => update('errorMessage', e.target.value)}
              placeholder="발생한 에러 메시지가 있다면 붙여넣으세요."
              className="min-h-[60px] font-mono text-sm bg-secondary/30 border-border/50"
            />
          </div>
        </div>
      </div>

      {/* Research Stage */}
      {stages.research && (
        <div className="glass-card p-4 rounded-xl animate-slide-up">
          <h3 className="section-title text-campus-teal">알고리즘/라이브러리 조사 옵션</h3>
          <p className="helper-text">
            3~5개의 후보 알고리즘을 복잡도, 장단점과 함께 비교하고, 
            선택한 환경에서 사용 가능한 라이브러리를 추천받습니다. (유료 API 제외)
          </p>
        </div>
      )}

      {/* Outline Stage */}
      {stages.outline && (
        <div className="glass-card p-4 rounded-xl animate-slide-up">
          <h3 className="section-title text-campus-blue">파일/모듈 구조 설계 옵션</h3>
          <p className="helper-text">
            생성할 파일/모듈 목록과 각각의 역할을 정리합니다.
            {data.goal === 'app' && ' 앱의 UI 구조(페이지, 컴포넌트)도 포함됩니다.'}
          </p>
        </div>
      )}

      {/* Full Write Stage */}
      {stages.fullWrite && (
        <div className="glass-card p-4 rounded-xl animate-slide-up">
          <h3 className="section-title text-campus-navy">코드 작성 옵션</h3>
          <div className="space-y-3">
            <div>
              <Label className="input-label">작성 모드</Label>
              <RadioGroup
                value={data.writeMode}
                onValueChange={(v) => update('writeMode', v as any)}
                className="space-y-2 mt-2"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="minimal-code" id="minimal" />
                  <Label htmlFor="minimal" className="cursor-pointer text-sm">최소 동작 예제 코드 생성</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="explanation" id="explanation" />
                  <Label htmlFor="explanation" className="cursor-pointer text-sm">코드 설명/리포트 작성</Label>
                </div>
              </RadioGroup>
            </div>

            {data.writeMode === 'explanation' && (
              <div>
                <Label className="input-label">설명 분량</Label>
                <Select
                  value={data.wordCountPreset}
                  onValueChange={(v) => update('wordCountPreset', v as any)}
                >
                  <SelectTrigger className="bg-secondary/30 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300">약 300자</SelectItem>
                    <SelectItem value="600">약 600자</SelectItem>
                    <SelectItem value="1000">약 1000자</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
                {data.wordCountPreset === 'other' && (
                  <Input
                    value={data.wordCountOther}
                    onChange={(e) => update('wordCountOther', e.target.value)}
                    placeholder="예: A4 1페이지 내외"
                    className="mt-2 bg-secondary/30 border-border/50"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
