import Header from '@/components/layout/Header';
import { SqlProvider } from '@/components/providers/SqlProvider';
import { SelectionProvider } from '@/components/providers/SelectionProvider';

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return (
    <SqlProvider>
      <SelectionProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="mx-auto max-w-7xl w-full flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
            {children}
          </main>
        </div>
      </SelectionProvider>
    </SqlProvider>
  );
}


