import Header from '@/components/layout/Header';
import { SqlProvider } from '@/components/providers/SqlProvider';
import { SelectionProvider } from '@/components/providers/SelectionProvider';

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return (
    <SqlProvider>
      <SelectionProvider>
        <div className="h-screen flex flex-col bg-background">
          <Header />
          <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {children}
          </main>
        </div>
      </SelectionProvider>
    </SqlProvider>
  );
}
