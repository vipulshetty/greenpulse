
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import TopNav from './TopNav';
import { useToast } from '@/hooks/use-toast';
import { Bell, Settings, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

// Hardcoded sample alerts for demonstration
const sampleAlerts = [
  {
    id: '1',
    type: 'critical' as const,
    message: 'Soil moisture critically low! Irrigation system activated.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    source: 'moisture' as const,
    read: false
  },
  {
    id: '2',
    type: 'warning' as const,
    message: 'Temperature is rising above optimal range.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    source: 'temperature' as const,
    read: false
  },
  {
    id: '3',
    type: 'info' as const,
    message: 'Weekly nutrient application scheduled for tomorrow.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    source: 'nutrients' as const,
    read: true
  }
];

const Layout = ({ children }: LayoutProps) => {
  const { toast } = useToast();

  // Example of showing a notification when a new alert comes in
  // This would normally be triggered by an event from your backend
  React.useEffect(() => {
    // Simulate a new alert after 3 seconds for demonstration purposes
    const timer = setTimeout(() => {
      toast({
        title: "Low Moisture Alert",
        description: "Plant #3 moisture level is critically low",
        variant: "destructive",
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <TopNav alerts={sampleAlerts} className="border-b border-green-100 bg-white/95 shadow-sm" />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
