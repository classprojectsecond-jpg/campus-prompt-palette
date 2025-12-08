import { Archive, Copy, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
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
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border/50 bg-secondary/30">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Archive className="h-5 w-5 text-primary" />
          프롬프트 보관함
          <span className="text-xs text-muted-foreground ml-auto">{prompts.length}개</span>
        </h2>
      </div>

      <ScrollArea className="h-[280px]">
        {prompts.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground text-sm">
            저장된 프롬프트가 없습니다.<br />프롬프트를 생성하고 저장해보세요!
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {prompts.map((p) => (
              <div key={p.id} className="p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded font-medium">
                        {TAB_LABELS[p.tabType]}
                      </span>
                      <span className="font-medium text-sm truncate">{p.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.prompt.slice(0, 100)}...</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {new Date(p.createdAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleCopy(p.prompt)}>
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onLoad(p)}>
                      <Upload className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(p.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
