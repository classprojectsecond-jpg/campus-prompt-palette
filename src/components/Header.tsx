import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';
interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}
export function Header({
  theme,
  onToggleTheme
}: HeaderProps) {
  return <header className="sticky top-0 z-50 glass-card border-b border-border/50 px-4 py-3 md:px-6">
      <div className="flex items-center justify-between max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Campus Prompt Palette Logo" className="h-24 md:h-30 w-auto" />
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:block text-sm text-muted-foreground">
            대학생을 위한 맞춤형 AI 프롬프트 스튜디오
          </span>
          
          <Button variant="outline" size="sm" onClick={onToggleTheme} className="gap-2 bg-secondary/50 border-border/50 hover:bg-secondary">
            {theme === 'light' ? <>
                <Sun className="h-4 w-4" />
                <span className="hidden sm:inline">Light</span>
              </> : <>
                <Moon className="h-4 w-4" />
                <span className="hidden sm:inline">Dark</span>
              </>}
          </Button>
        </div>
      </div>
    </header>;
}