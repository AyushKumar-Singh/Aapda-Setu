import { Bell, Search, User, Shield, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-soft">
      <div className="flex h-[68px] items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-soft glow-primary">
            <Shield className="absolute h-5 w-5 text-white" />
            <MapPin className="absolute h-3 w-3 text-white translate-x-0.5 translate-y-0.5" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-foreground font-semibold tracking-tight">
              Aapda Setu
            </h1>
            <p className="text-muted-foreground text-xs">Emergency Response Platform</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mx-4 hidden w-full max-w-md lg:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search alerts, locations, users..."
            className="w-full pl-10 h-10 bg-muted border-border"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search mobile */}
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-emergency text-white text-xs shadow-soft glow-emergency">
                  4
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Critical Alert: Forest Fire</p>
                  <p className="text-muted-foreground text-xs">Nainital, Uttarakhand - 5 min ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Report Verified</p>
                  <p className="text-muted-foreground text-xs">ALT-002 verified by AI system</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">New Incident Report</p>
                  <p className="text-muted-foreground text-xs">Requires verification - RPT-003</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Response Team Dispatched</p>
                  <p className="text-muted-foreground text-xs">NDRF Team 2 en route</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary shadow-soft">
                  <User className="h-5 w-5 text-white" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}