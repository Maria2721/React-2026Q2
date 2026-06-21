import { Header } from '@/components/Header/Header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 transition-colors">
      <Header />
      <main className="max-w-6xl mx-auto p-8">{children}</main>
    </div>
  );
}
