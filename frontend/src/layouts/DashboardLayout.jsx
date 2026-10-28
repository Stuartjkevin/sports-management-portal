import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';

// Layout for all /dashboard pages: sidebar + top navbar + page content.
// <Outlet /> is where React Router renders the current page.
export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
      <div className={`sidebar-backdrop ${sidebarOpen ? 'show' : ''}`} onClick={closeSidebar} />
      <div className="dashboard-main">
        <TopNavbar onToggleSidebar={() => setSidebarOpen((open) => !open)} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}
