import { Outlet } from 'react-router';
import { Header } from '../Header/Header';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <main className="max-w-6xl mx-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
