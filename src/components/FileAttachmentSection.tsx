import { Paperclip } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { FileAttachment } from '@/types/prompt';

interface FileAttachmentSectionProps {
  attachment: FileAttachment;
  onChange: (attachment: FileAttachment) => void;
}

export function FileAttachmentSection({ attachment, onChange }: FileAttachmentSectionProps) {
  return (
    <div className="glass-card p-4 rounded-xl animate-fade-in">
      <h3 className="section-title">
        <Paperclip className="h-4 w-4 text-primary" />
        파일 첨부 정보
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Checkbox
            id="hasAttachment"
            checked={attachment.hasAttachment}
            onCheckedChange={(checked) =>
              onChange({ ...attachment, hasAttachment: checked === true })
            }
            className="mt-0.5"
          />
          <Label htmlFor="hasAttachment" className="text-sm leading-relaxed cursor-pointer">
            이 작업과 관련된 파일을 다른 시스템(과제 제출, 이메일, 코드 업로드 등)에 이미 첨부했습니다.
          </Label>
        </div>

        {attachment.hasAttachment && (
          <div className="animate-slide-up">
            <Textarea
              placeholder="첨부한 파일의 종류와 내용(예: PDF 레포트 초안, 코드 zip, 데이터셋, 기존 발표 자료 등)을 간단히 설명하세요."
              value={attachment.description}
              onChange={(e) =>
                onChange({ ...attachment, description: e.target.value })
              }
              className="min-h-[80px] bg-secondary/30 border-border/50"
            />
          </div>
        )}
      </div>
    </div>
  );
}
