
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  LineChart,
  Settings,
  Bell,
  Droplet,
  Sun,
  ThermometerIcon,
  Sprout,
  Cloud,
  LogOut,
} from 'lucide-react';

export function AppSidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1 rounded">
            <Sprout className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold">GreenPulse</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className={isActive('/') ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""} asChild>
                  <Link to="/">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className={isActive('/analytics') ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""} asChild>
                  <Link to="/analytics">
                    <LineChart className="h-4 w-4 mr-2" />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className={isActive('/alerts') ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""} asChild>
                  <Link to="/alerts">
                    <Bell className="h-4 w-4 mr-2" />
                    <span>Alerts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel>Sensors</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className={isActive('/sensors/moisture') ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""} asChild>
                  <Link to="/sensors/moisture">
                    <Droplet className="h-4 w-4 mr-2" />
                    <span>Moisture</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className={isActive('/sensors/temperature') ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""} asChild>
                  <Link to="/sensors/temperature">
                    <ThermometerIcon className="h-4 w-4 mr-2" />
                    <span>Temperature</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className={isActive('/sensors/light') ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""} asChild>
                  <Link to="/sensors/light">
                    <Sun className="h-4 w-4 mr-2" />
                    <span>Light</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className={isActive('/sensors/nutrients') ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""} asChild>
                  <Link to="/sensors/nutrients">
                    <Sprout className="h-4 w-4 mr-2" />
                    <span>Nutrients</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className={isActive('/weather') ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""} asChild>
                  <Link to="/weather">
                    <Cloud className="h-4 w-4 mr-2" />
                    <span>Weather</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className={isActive('/settings') ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""} asChild>
                  <Link to="/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t">
        <Button variant="outline" className="w-full justify-start">
          <LogOut className="h-4 w-4 mr-2" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
