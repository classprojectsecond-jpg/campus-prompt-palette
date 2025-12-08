import { useState } from 'react';
import { Settings, Archive, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { CommonSettings } from '@/components/CommonSettings';
import { PromptLibrary } from '@/components/PromptLibrary';
import type { CommonSettings as CommonSettingsType, SavedPrompt } from '@/types/prompt';

interface RightPanelProps {
  settings: CommonSettingsType;
  onSettingsChange: (settings: CommonSettingsType) => void;
  savedPrompts: SavedPrompt[];
  onLoadPrompt: (prompt: SavedPrompt) => void;
  onDeletePrompt: (id: string) => void;
}

export function RightPanel({
  settings,
  onSettingsChange,
  savedPrompts,
  onLoadPrompt,
  onDeletePrompt,
}: RightPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<'settings' | 'library'>('settings');

  return (
    <>
      {/* Toggle Button - Always visible */}
      <div
        className={cn(
          "fixed right-0 top-1/2 -translate-y-1/2 z-40 transition-all duration-300",
          isOpen ? "translate-x-0 opacity-0 pointer-events-none lg:opacity-0" : "translate-x-0"
        )}
      >
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="rounded-l-lg rounded-r-none h-24 w-8 flex-col gap-1 shadow-lg border border-r-0 border-border/50 bg-card hover:bg-secondary"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="text-xs [writing-mode:vertical-lr] rotate-180">설정</span>
        </Button>
      </div>

      {/* Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full z-30 transition-all duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="h-full w-[360px] lg:w-[400px] bg-card/95 backdrop-blur-md border-l border-border/50 shadow-2xl flex flex-col">
          {/* Panel Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50 bg-secondary/30">
            <div className="flex gap-1">
              <Button
                variant={activeSection === 'settings' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveSection('settings')}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                공통 설정
              </Button>
              <Button
                variant={activeSection === 'library' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveSection('library')}
                className="gap-2"
              >
                <Archive className="h-4 w-4" />
                보관함
                {savedPrompts.length > 0 && (
                  <span className="text-xs bg-primary/20 px-1.5 rounded-full">
                    {savedPrompts.length}
                  </span>
                )}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Panel Content */}
          <ScrollArea className="flex-1">
            <div className="p-4">
              {activeSection === 'settings' ? (
                <CommonSettings settings={settings} onChange={onSettingsChange} />
              ) : (
                <PromptLibrary
                  prompts={savedPrompts}
                  onLoad={onLoadPrompt}
                  onDelete={onDeletePrompt}
                />
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
