import { useState } from 'react';
import { Sparkles, Copy, Save, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface PromptPreviewProps {
  prompt: string;
  onGenerate: () => void;
  onSave: (title: string, notes: string) => void;
}

export function PromptPreview({ prompt, onGenerate, onSave }: PromptPreviewProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [saveNotes, setSaveNotes] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast.success('클립보드에 복사되었습니다!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!saveTitle.trim()) {
      toast.error('저장 이름을 입력해주세요.');
      return;
    }
    onSave(saveTitle, saveNotes);
    setShowSaveDialog(false);
    setSaveTitle('');
    setSaveNotes('');
    toast.success('프롬프트가 저장되었습니다!');
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          프롬프트 미리보기
        </h2>
      </div>

      <div className="p-4">
        <Textarea
          value={prompt}
          readOnly
          placeholder="위에서 설정을 완료하고 '프롬프트 생성' 버튼을 클릭하세요."
          className="min-h-[200px] bg-secondary/20 border-border/50 font-mono text-sm resize-none"
        />

        <div className="flex flex-wrap gap-2 mt-4">
          <Button onClick={onGenerate} className="gap-2 bg-primary hover:bg-primary/90">
            <Sparkles className="h-4 w-4" />
            프롬프트 생성
          </Button>
          <Button variant="outline" onClick={() => setShowSaveDialog(true)} disabled={!prompt} className="gap-2">
            <Save className="h-4 w-4" />
            저장하기
          </Button>
          <Button variant="secondary" onClick={handleCopy} disabled={!prompt} className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            복사하기
          </Button>
        </div>
      </div>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>프롬프트 저장</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>저장 이름 *</Label>
              <Input value={saveTitle} onChange={(e) => setSaveTitle(e.target.value)} placeholder="예: 마케팅 레포트 프롬프트" className="mt-1.5" />
            </div>
            <div>
              <Label>메모 (선택)</Label>
              <Textarea value={saveNotes} onChange={(e) => setSaveNotes(e.target.value)} placeholder="나중에 참고할 메모를 작성하세요." className="mt-1.5 min-h-[80px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>취소</Button>
            <Button onClick={handleSave}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
