import { Archive, Copy, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { SavedPrompt, TabType } from '@/types/prompt';

const TAB_LABELS: Record<TabType, string> = {
  report: '레포트', exam: '시험', coding: '코딩',
  research: '연구', career: '커리어', image: '이미지',
};

interface PromptLibraryProps {
  prompts: SavedPrompt[];
  onLoad: (prompt: SavedPrompt) => void;
  onDelete: (id: string) => void;
}

export function PromptLibrary({ prompts, onLoad, onDelete }: PromptLibraryProps) {
  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success('클립보드에 복사되었습니다!');
  };

  return (
    <div className="space-y-3 animate-fade-in">
      {prompts.length === 0 ? (
        <div className="glass-card rounded-xl p-8 text-center">
          <Archive className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground text-sm">
            저장된 프롬프트가 없습니다.<br />
            프롬프트를 생성하고 저장해보세요!
          </p>
        </div>
      ) : (
        prompts.map((p) => (
          <div key={p.id} className="glass-card rounded-xl p-4 hover:shadow-hover transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                    {TAB_LABELS[p.tabType]}
                  </span>
                  <span className="font-medium text-sm truncate">{p.title}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {p.prompt.slice(0, 120)}...
                </p>
                {p.notes && (
                  <p className="text-xs text-muted-foreground/70 italic mb-1">
                    메모: {p.notes}
                  </p>
                )}
                <p className="text-xs text-muted-foreground/50">
                  {new Date(p.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
              <Button size="sm" variant="secondary" className="flex-1 gap-1.5" onClick={() => handleCopy(p.prompt)}>
                <Copy className="h-3.5 w-3.5" />
                복사
              </Button>
              <Button size="sm" variant="secondary" className="flex-1 gap-1.5" onClick={() => onLoad(p)}>
                <Upload className="h-3.5 w-3.5" />
                불러오기
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(p.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
