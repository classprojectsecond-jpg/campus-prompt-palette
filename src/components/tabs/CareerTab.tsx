import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import type { CareerTabData, StageSelection } from '@/types/prompt';

interface CareerTabProps {
  data: CareerTabData;
  stages: StageSelection;
  onChange: (data: CareerTabData) => void;
}

export function CareerTab({ data, stages, onChange }: CareerTabProps) {
  const update = <K extends keyof CareerTabData>(key: K, value: CareerTabData[K]) => {
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
            <Label className="input-label">문서 유형</Label>
            <Select
              value={data.documentType}
              onValueChange={(v) => update('documentType', v as any)}
            >
              <SelectTrigger className="bg-secondary/30 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professor-email">교수님 이메일</SelectItem>
                <SelectItem value="internship">인턴/채용 문의</SelectItem>
                <SelectItem value="company-inquiry">기업 문의</SelectItem>
                <SelectItem value="cover-letter">자기소개서/커버레터</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="input-label">상대 정보</Label>
            <Input
              value={data.recipientInfo}
              onChange={(e) => update('recipientInfo', e.target.value)}
              placeholder="예: OO대학교 컴퓨터공학과 김OO 교수님"
              className="bg-secondary/30 border-border/50"
            />
          </div>

          <div>
            <Label className="input-label">핵심 메시지</Label>
            <Textarea
              value={data.coreMessage}
              onChange={(e) => update('coreMessage', e.target.value)}
              placeholder="전달하고 싶은 핵심 내용을 작성하세요."
              className="min-h-[80px] bg-secondary/30 border-border/50"
            />
          </div>

          <div>
            <Label className="input-label">내 이력/경험 요약</Label>
            <Textarea
              value={data.experience}
              onChange={(e) => update('experience', e.target.value)}
              placeholder="관련 이력이나 경험을 간단히 정리하세요."
              className="min-h-[80px] bg-secondary/30 border-border/50"
            />
          </div>

          <div>
            <Label className="input-label">기존 초안 (선택)</Label>
            <Textarea
              value={data.existingDraft}
              onChange={(e) => update('existingDraft', e.target.value)}
              placeholder="이미 작성한 초안이 있다면 붙여넣으세요."
              className="min-h-[60px] bg-secondary/30 border-border/50"
            />
          </div>
        </div>
      </div>

      {/* Research Stage */}
      {stages.research && (
        <div className="glass-card p-4 rounded-xl animate-slide-up">
          <h3 className="section-title text-campus-teal">기업/연구실 조사 옵션</h3>
          <div className="flex items-center gap-3">
            <Switch
              id="companyResearch"
              checked={data.companyResearchMode}
              onCheckedChange={(c) => update('companyResearchMode', c)}
            />
            <Label htmlFor="companyResearch" className="cursor-pointer text-sm">
              기업/연구실 조사 모드 활성화
            </Label>
          </div>
          <p className="helper-text mt-2">
            사업/연구 분야, 최근 이슈, 키워드를 정리하고, 내가 연결할 경험 아이디어를 제안받습니다.
          </p>
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
              <RadioGroupItem value="email" id="email-struct" />
              <Label htmlFor="email-struct" className="cursor-pointer text-sm">
                이메일 구조 (인사→목적→내용→마무리)
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="cover-letter" id="cover-struct" />
              <Label htmlFor="cover-struct" className="cursor-pointer text-sm">
                자기소개서 구조 (지원동기→경험→역량→결론)
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}

      {/* Full Write Stage */}
      {stages.fullWrite && (
        <div className="glass-card p-4 rounded-xl animate-slide-up">
          <h3 className="section-title text-campus-navy">완전 작성 옵션</h3>
          
          {data.documentType === 'cover-letter' ? (
            <div>
              <Label className="input-label">자기소개서 분량</Label>
              <Select
                value={data.coverLetterWordCount}
                onValueChange={(v) => update('coverLetterWordCount', v as any)}
              >
                <SelectTrigger className="bg-secondary/30 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500">약 500자</SelectItem>
                  <SelectItem value="800">약 800자</SelectItem>
                  <SelectItem value="1000">약 1000자</SelectItem>
                  <SelectItem value="1500">약 1500자</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
              {data.coverLetterWordCount === 'other' && (
                <Input
                  value={data.coverLetterWordCountOther}
                  onChange={(e) => update('coverLetterWordCountOther', e.target.value)}
                  placeholder="원하는 분량을 입력하세요"
                  className="mt-2 bg-secondary/30 border-border/50"
                />
              )}
            </div>
          ) : (
            <div>
              <Label className="input-label">이메일 분량</Label>
              <Select
                value={data.emailLength}
                onValueChange={(v) => update('emailLength', v as any)}
              >
                <SelectTrigger className="bg-secondary/30 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">짧게 (5~7문장)</SelectItem>
                  <SelectItem value="medium">보통 (8~12문장)</SelectItem>
                  <SelectItem value="long">길게</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
              {data.emailLength === 'other' && (
                <Input
                  value={data.emailLengthOther}
                  onChange={(e) => update('emailLengthOther', e.target.value)}
                  placeholder="원하는 분량을 입력하세요"
                  className="mt-2 bg-secondary/30 border-border/50"
                />
              )}
            </div>
          )}
          
          <p className="helper-text mt-2">
            극존대/비즈니스 톤으로, 구체적 경험 중심으로 작성합니다.
          </p>
        </div>
      )}
    </div>
  );
}
