'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <div className="flex-1 h-full">{children}</div>;
  }

  return (
    <>
      <Sidebar />
      <div className="flex flex-col flex-1 h-full min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative print:p-0 print:overflow-visible">
          {children}
        </main>
      </div>
    </>
  );
}
