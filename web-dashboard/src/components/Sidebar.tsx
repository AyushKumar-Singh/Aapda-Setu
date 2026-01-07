import {
  LayoutDashboard,
  AlertTriangle,
  Map,
  CheckCircle,
  BarChart3,
  Users,
  Settings,
  FileText,
  Radio,
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isCollapsed: boolean;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Radio, label: 'Live Alerts', id: 'alerts' },
  { icon: Map, label: 'Map View', id: 'map' },
  { icon: CheckCircle, label: 'Verification', id: 'verification' },
  { icon: FileText, label: 'Reports', id: 'reports' },
  { icon: BarChart3, label: 'Analytics', id: 'analytics' },
  { icon: Users, label: 'Users', id: 'users' },
  { icon: Settings, label: 'Settings', id: 'settings' },
];

export function Sidebar({ currentPage, onNavigate, isCollapsed }: SidebarProps) {
  return (
    <aside
      className={cn(
        'sticky top-[68px] h-[calc(100vh-68px)] border-r border-border bg-card transition-all duration-300 shadow-soft-md',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col gap-2 p-3">
        {/* Navigation Items */}
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  'relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all font-medium',
                  isActive
                    ? 'bg-gradient-primary text-white shadow-soft-md glow-primary'
                    : 'text-foreground hover:bg-muted hover:text-primary'
                )}
              >
                <Icon className={cn('h-5 w-5 flex-shrink-0')} />
                {!isCollapsed && (
                  <span className="truncate text-sm">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        {!isCollapsed && (
          <div className="mt-auto rounded-xl border border-border bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-success text-sm font-medium flex items-center gap-2">
                  <span className="status-active"></span>
                  System Active
                </p>
                <p className="text-muted-foreground text-xs">All services online</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}