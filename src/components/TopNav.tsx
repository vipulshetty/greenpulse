
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
import { motion, AnimatePresence } from 'framer-motion';

interface TopNavProps {
  alerts: AlertData[];
  className?: string;
}

const TopNav = ({ alerts, className }: TopNavProps) => {
  const [showAlerts, setShowAlerts] = useState(false);
  
  const unreadAlerts = alerts.filter(alert => !alert.read);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex items-center justify-between p-4 backdrop-blur-sm z-10 ${className}`}
    >
      <div className="flex items-center">
        <SidebarTrigger />
      </div>
      
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <DropdownMenu open={showAlerts} onOpenChange={setShowAlerts}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Bell className="h-5 w-5" />
                <AnimatePresence>
                  {unreadAlerts.length > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Badge variant="destructive" className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 p-0 text-xs">
                        {unreadAlerts.length}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
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
              <AnimatePresence>
                {alerts.length > 0 ? (
                  alerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <AlertItem alert={alert} />
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-muted-foreground"
                  >
                    <p>No notifications</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Theme toggle */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button variant="ghost" size="icon">
            <SunMoon className="h-5 w-5" />
          </Button>
        </motion.div>
        
        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2"
              >
                <Avatar className="h-8 w-8 border-2 border-primary/30">
                  <AvatarFallback>GP</AvatarFallback>
                </Avatar>
                <span className="font-medium hidden sm:inline-block">Garden Admin</span>
              </motion.div>
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
    </motion.div>
  );
};

export default TopNav;
