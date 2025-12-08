import { Settings, User, Clock, Shield, Cpu } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { CommonSettings as CommonSettingsType } from '@/types/prompt';

interface CommonSettingsProps {
  settings: CommonSettingsType;
  onChange: (settings: CommonSettingsType) => void;
}

export function CommonSettings({ settings, onChange }: CommonSettingsProps) {
  const update = <K extends keyof CommonSettingsType>(key: K, value: CommonSettingsType[K]) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border/50 bg-secondary/30">
        <h2 className="flex items-center gap-2 font-semibold text-foreground">
          <Settings className="h-5 w-5 text-primary" />
          공통 설정
        </h2>
      </div>

      <Accordion type="multiple" defaultValue={['mode', 'profile']} className="px-4">
        {/* Mode Selection */}
        <AccordionItem value="mode" className="border-border/50">
          <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
            모드 선택
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-4">
            <RadioGroup
              value={settings.mode}
              onValueChange={(v) => update('mode', v as 'learning' | 'task')}
              className="space-y-2"
            >
              <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                <RadioGroupItem value="learning" id="learning" className="mt-0.5" />
                <div>
                  <Label htmlFor="learning" className="font-medium cursor-pointer">학습 모드</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    힌트, 개념 설명, 피드백 중심. 정답/완성 글은 바로 주지 않음
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                <RadioGroupItem value="task" id="task" className="mt-0.5" />
                <div>
                  <Label htmlFor="task" className="font-medium cursor-pointer">과제/결과물 모드</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    실제 과제, 레포트 등 완성본에 가까운 텍스트 생성
                  </p>
                </div>
              </div>
            </RadioGroup>

            <div className="space-y-2">
              <Label className="text-sm font-medium">결과 형태</Label>
              <RadioGroup
                value={settings.resultFormat}
                onValueChange={(v) => update('resultFormat', v as 'outline' | 'full')}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="outline" id="outline-format" />
                  <Label htmlFor="outline-format" className="cursor-pointer text-sm">아웃라인만</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="full" id="full-format" />
                  <Label htmlFor="full-format" className="cursor-pointer text-sm">완전 작성</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="sources"
                  checked={settings.includeSources}
                  onCheckedChange={(c) => update('includeSources', c === true)}
                />
                <Label htmlFor="sources" className="cursor-pointer text-sm">
                  출처·참고문헌 아이디어 포함
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="selfcheck"
                  checked={settings.includeSelfCheck}
                  onCheckedChange={(c) => update('includeSelfCheck', c === true)}
                />
                <Label htmlFor="selfcheck" className="cursor-pointer text-sm">
                  답변 마지막에 자기검토 포함
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Profile Settings */}
        <AccordionItem value="profile" className="border-border/50">
          <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              프로필 설정
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            <div>
              <Label className="input-label">과목명</Label>
              <Input
                value={settings.subjectName}
                onChange={(e) => update('subjectName', e.target.value)}
                placeholder="예: 경영학원론"
                className="bg-secondary/30 border-border/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="input-label">전공/교양</Label>
                <Select
                  value={settings.majorType}
                  onValueChange={(v) => update('majorType', v as any)}
                >
                  <SelectTrigger className="bg-secondary/30 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="major">전공</SelectItem>
                    <SelectItem value="general">교양</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="input-label">학년/수준</Label>
                <Select
                  value={settings.gradeLevel}
                  onValueChange={(v) => update('gradeLevel', v as any)}
                >
                  <SelectTrigger className="bg-secondary/30 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1학년</SelectItem>
                    <SelectItem value="2">2학년</SelectItem>
                    <SelectItem value="3">3학년</SelectItem>
                    <SelectItem value="4">4학년</SelectItem>
                    <SelectItem value="graduate">대학원</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="input-label">교수 스타일</Label>
              <Select
                value={settings.professorStyle}
                onValueChange={(v) => update('professorStyle', v as any)}
              >
                <SelectTrigger className="bg-secondary/30 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strict">엄격한 평가</SelectItem>
                  <SelectItem value="flexible">비교적 유연</SelectItem>
                  <SelectItem value="unknown">모름</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="input-label">사용자 전공</Label>
              <Input
                value={settings.userMajor}
                onChange={(e) => update('userMajor', e.target.value)}
                placeholder="예: 컴퓨터공학"
                className="bg-secondary/30 border-border/50"
              />
            </div>

            <div>
              <Label className="input-label">관심 분야 및 예시 도메인</Label>
              <Textarea
                value={settings.interestAreas}
                onChange={(e) => update('interestAreas', e.target.value)}
                placeholder="예: 음악, 스타트업, 환경, 전자공학 등"
                className="min-h-[60px] bg-secondary/30 border-border/50"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Writing Style */}
        <AccordionItem value="style" className="border-border/50">
          <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
            스타일 샘플 (선택)
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <Textarea
              value={settings.writingStyleSample}
              onChange={(e) => update('writingStyleSample', e.target.value)}
              placeholder="나의 글쓰기 샘플을 붙여넣으면, 비슷한 문체로 작성해 달라고 요청합니다."
              className="min-h-[100px] bg-secondary/30 border-border/50"
            />
          </AccordionContent>
        </AccordionItem>

        {/* Time/Deadline */}
        <AccordionItem value="deadline" className="border-border/50">
          <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              마감/시험 시간
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            <Select
              value={settings.deadlineType}
              onValueChange={(v) => update('deadlineType', v as any)}
            >
              <SelectTrigger className="bg-secondary/30 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="assignment">과제 마감까지</SelectItem>
                <SelectItem value="exam">시험까지</SelectItem>
                <SelectItem value="other">기타</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={settings.deadlineValue}
              onChange={(e) => update('deadlineValue', e.target.value)}
              placeholder="예: 3일, 12시간"
              className="bg-secondary/30 border-border/50"
            />
          </AccordionContent>
        </AccordionItem>

        {/* AI Regulation */}
        <AccordionItem value="regulation" className="border-border/50">
          <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              AI 사용 규정
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            <Textarea
              value={settings.aiRegulation}
              onChange={(e) => update('aiRegulation', e.target.value)}
              placeholder="학교/과목별 AI 사용 규정 전문 혹은 요약을 붙여넣으세요."
              className="min-h-[80px] bg-secondary/30 border-border/50"
            />
            <div className="flex items-center gap-2">
              <Switch
                id="includeReg"
                checked={settings.includeRegulation}
                onCheckedChange={(c) => update('includeRegulation', c)}
              />
              <Label htmlFor="includeReg" className="cursor-pointer text-sm">
                프롬프트에 규정 상기·준수 문구 포함
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Model/Language Settings */}
        <AccordionItem value="model" className="border-border/50">
          <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
            <span className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              모델/언어/난이도
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            <div>
              <Label className="input-label">대상 모델</Label>
              <Select
                value={settings.targetModel}
                onValueChange={(v) => update('targetModel', v as any)}
              >
                <SelectTrigger className="bg-secondary/30 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chatgpt">ChatGPT</SelectItem>
                  <SelectItem value="gemini">Gemini</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
              {settings.targetModel === 'other' && (
                <Input
                  value={settings.targetModelOther}
                  onChange={(e) => update('targetModelOther', e.target.value)}
                  placeholder="모델명 입력"
                  className="mt-2 bg-secondary/30 border-border/50"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="input-label">설명 언어</Label>
                <Select
                  value={settings.explanationLanguage}
                  onValueChange={(v) => update('explanationLanguage', v as any)}
                >
                  <SelectTrigger className="bg-secondary/30 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="korean">한국어</SelectItem>
                    <SelectItem value="english">영어</SelectItem>
                    <SelectItem value="mixed">혼합</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="input-label">결과물 언어</Label>
                <Select
                  value={settings.outputLanguage}
                  onValueChange={(v) => update('outputLanguage', v as any)}
                >
                  <SelectTrigger className="bg-secondary/30 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="korean">한국어</SelectItem>
                    <SelectItem value="english">영어</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="input-label">난이도 수준</Label>
              <Select
                value={settings.difficultyLevel}
                onValueChange={(v) => update('difficultyLevel', v as any)}
              >
                <SelectTrigger className="bg-secondary/30 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">고등학생 수준</SelectItem>
                  <SelectItem value="undergraduate">학부생 수준</SelectItem>
                  <SelectItem value="graduate">대학원생 수준</SelectItem>
                  <SelectItem value="expert">전문가 수준</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
