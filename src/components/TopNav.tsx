
import { useState } from 'react';
import { Bell, User, SunMoon, Settings, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AlertData } from './AlertItem';
import AlertItem from './AlertItem';

interface TopNavProps {
  alerts: AlertData[];
  className?: string;
}

const TopNav = ({ alerts, className }: TopNavProps) => {
  const [showAlerts, setShowAlerts] = useState(false);
  
  const unreadAlerts = alerts.filter(alert => !alert.read);

  return (
    <div className={`flex items-center justify-between p-4 ${className}`}>
      <div className="flex items-center">
        <SidebarTrigger />
      </div>
      
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <DropdownMenu open={showAlerts} onOpenChange={setShowAlerts}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadAlerts.length > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 p-0 text-xs">
                  {unreadAlerts.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-h-[400px] overflow-y-auto p-0">
            <div className="p-3 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Notifications</h3>
                <Button variant="ghost" size="sm" className="text-xs h-auto py-1">
                  Mark all as read
                </Button>
              </div>
            </div>
            <div className="p-1">
              {alerts.length > 0 ? (
                alerts.map(alert => (
                  <AlertItem key={alert.id} alert={alert} />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No notifications</p>
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Theme toggle */}
        <Button variant="ghost" size="icon">
          <SunMoon className="h-5 w-5" />
        </Button>
        
        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>GP</AvatarFallback>
              </Avatar>
              <span className="font-medium hidden sm:inline-block">Garden Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="h-4 w-4 mr-2" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopNav;
