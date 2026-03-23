import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';

export default function AppShell() {
  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      {/* Sidebar — hidden on mobile, visible on lg+ */}
      <Sidebar />
      
      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <Header />
        
        {/* Scrollable content area - bg-surface2 provides subtle off-white contrast */}
        <main className="flex-1 overflow-y-auto bg-surface2 p-6 lg:p-8 pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>
      
      {/* Bottom nav — visible on mobile only */}
      <BottomNav />
    </div>
  );
}
