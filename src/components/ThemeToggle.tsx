import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="text-white hover:bg-white/10 transition-all duration-200 hover:scale-110"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 transition-transform duration-300 rotate-0 hover:rotate-90" />
      ) : (
        <Moon className="h-5 w-5 transition-transform duration-300" />
      )}
    </Button>
  );
}
