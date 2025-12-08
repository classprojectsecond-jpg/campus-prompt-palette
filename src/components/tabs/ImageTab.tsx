import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import type { ImageTabData, StageSelection } from '@/types/prompt';

interface ImageTabProps {
  data: ImageTabData;
  stages: StageSelection;
  onChange: (data: ImageTabData) => void;
}

export function ImageTab({ data, stages, onChange }: ImageTabProps) {
  const update = <K extends keyof ImageTabData>(key: K, value: ImageTabData[K]) => {
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
            <Label className="input-label">이미지 유형</Label>
            <Select
              value={data.imageType}
              onValueChange={(v) => update('imageType', v as any)}
            >
              <SelectTrigger className="bg-secondary/30 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="logo">로고</SelectItem>
                <SelectItem value="app-ui">앱 UI</SelectItem>
                <SelectItem value="poster">포스터</SelectItem>
                <SelectItem value="thumbnail">썸네일</SelectItem>
                <SelectItem value="illustration">일러스트</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="input-label">서비스 이름</Label>
            <Input
              value={data.serviceName}
              onChange={(e) => update('serviceName', e.target.value)}
              placeholder="예: Campus Prompt Palette"
              className="bg-secondary/30 border-border/50"
            />
          </div>

          <div>
            <Label className="input-label">태그라인</Label>
            <Input
              value={data.tagline}
              onChange={(e) => update('tagline', e.target.value)}
              placeholder="예: 대학생을 위한 AI 프롬프트 스튜디오"
              className="bg-secondary/30 border-border/50"
            />
          </div>

          <div>
            <Label className="input-label">색감/스타일 키워드</Label>
            <Input
              value={data.styleKeywords}
              onChange={(e) => update('styleKeywords', e.target.value)}
              placeholder="예: 파스텔, 미니멀, 모던, 그라데이션"
              className="bg-secondary/30 border-border/50"
            />
          </div>

          <div>
            <Label className="input-label">참고 이미지 설명/URL</Label>
            <Textarea
              value={data.referenceDescription}
              onChange={(e) => update('referenceDescription', e.target.value)}
              placeholder="참고하고 싶은 이미지를 설명하거나 URL을 입력하세요."
              className="min-h-[60px] bg-secondary/30 border-border/50"
            />
          </div>

          <div>
            <Label className="input-label">유지해야 할 요소</Label>
            <Input
              value={data.preserveElements}
              onChange={(e) => update('preserveElements', e.target.value)}
              placeholder="예: 기존 로고 형태, 특정 아이콘"
              className="bg-secondary/30 border-border/50"
            />
          </div>

          <div>
            <Label className="input-label">플랫폼</Label>
            <Input
              value={data.platform}
              onChange={(e) => update('platform', e.target.value)}
              placeholder="예: 아이폰 15 프로 목업, 웹 페이지 헤더"
              className="bg-secondary/30 border-border/50"
            />
          </div>
        </div>
      </div>

      {/* Prompt Mode */}
      <div className="glass-card p-4 rounded-xl animate-slide-up">
        <h3 className="section-title text-campus-teal">프롬프트 모드</h3>
        <RadioGroup
          value={data.promptMode}
          onValueChange={(v) => update('promptMode', v as any)}
          className="space-y-2"
        >
          <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
            <RadioGroupItem value="outline" id="img-outline" className="mt-0.5" />
            <div>
              <Label htmlFor="img-outline" className="font-medium cursor-pointer">프롬프트 아웃라인 모드</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                핵심 키워드와 구성 요소만 나열
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
            <RadioGroupItem value="full" id="img-full" className="mt-0.5" />
            <div>
              <Label htmlFor="img-full" className="font-medium cursor-pointer">프롬프트 완전 작성 모드</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                나노바나나에 바로 붙여넣을 수 있는 자세한 프롬프트
              </p>
            </div>
          </div>
        </RadioGroup>

        <div className="flex items-center gap-2 mt-4">
          <Checkbox
            id="bothLang"
            checked={data.includeBothLanguages}
            onCheckedChange={(c) => update('includeBothLanguages', c === true)}
          />
          <Label htmlFor="bothLang" className="cursor-pointer text-sm">
            한국어와 영어 버전 프롬프트 동시 생성
          </Label>
        </div>
      </div>
    </div>
  );
}
