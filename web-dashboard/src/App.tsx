import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { AlertsPage } from './pages/AlertsPage';
import { MapPage } from './pages/MapPage';
import { VerificationPage } from './pages/VerificationPage';
import { ReportsPage } from './pages/ReportsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { UsersPage } from './pages/UsersPage';
import { SettingsPage } from './pages/SettingsPage';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'map':
        return <MapPage />;
      case 'verification':
        return <VerificationPage />;
      case 'reports':
        return <ReportsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'users':
        return <UsersPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            currentPage={currentPage}
            onNavigate={(page) => {
              setCurrentPage(page);
              setMobileSidebarOpen(false);
            }}
            isCollapsed={sidebarCollapsed}
          />
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              />

              {/* Sidebar */}
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed top-[68px] left-0 z-50 h-[calc(100vh-68px)] lg:hidden"
              >
                <Sidebar
                  currentPage={currentPage}
                  onNavigate={(page) => {
                    setCurrentPage(page);
                    setMobileSidebarOpen(false);
                  }}
                  isCollapsed={false}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Mobile Menu Button */}
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 left-6 z-30 lg:hidden shadow-lg"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        >
          {mobileSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="container max-w-7xl mx-auto p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster position="bottom-right" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}