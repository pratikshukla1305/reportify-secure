
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Bell, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

// Define notification type
interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'sos' | 'kyc' | 'tip' | 'system';
  linkTo: string;
}

const OfficerNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Example officer data - in a real app, this would come from authentication
  const officer = {
    name: "Officer John Smith",
    badge: "P-12345",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
  };

  // Example notifications - in a real app, this would come from a database or API
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "notif-1",
      title: "New SOS Alert",
      description: "Downtown Central Square, 5 minutes ago",
      time: "5 minutes ago",
      read: false,
      type: "sos",
      linkTo: "/officer-dashboard?tab=sos"
    },
    {
      id: "notif-2",
      title: "KYC Verification Pending",
      description: "5 new users waiting for verification",
      time: "30 minutes ago",
      read: false,
      type: "kyc",
      linkTo: "/officer-dashboard?tab=kyc"
    },
    {
      id: "notif-3",
      title: "New Tip Received",
      description: "Information about wanted individual #1042",
      time: "2 hours ago",
      read: false,
      type: "tip",
      linkTo: "/officer-dashboard?tab=criminals"
    },
    {
      id: "notif-4",
      title: "System Maintenance",
      description: "Scheduled maintenance in 24 hours",
      time: "1 day ago",
      read: true,
      type: "system",
      linkTo: "/officer-dashboard"
    }
  ]);

  // Get the number of unread notifications
  const unreadNotificationsCount = notifications.filter(notif => !notif.read).length;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fixed navigation function to handle tab changes
  const handleTabNavigation = (tab: string) => {
    // Navigate to the officer-dashboard with the specified tab as a query parameter
    navigate(`/officer-dashboard?tab=${tab}`);
    setIsMobileMenuOpen(false);
  };

  // Function to handle navigation to the dashboard home view
  const navigateToDashboard = () => {
    navigate('/officer-dashboard');
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    // In a real app, this would handle authentication logout
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the officer portal",
    });
    navigate('/officer-login');
  };

  const handleViewProfile = () => {
    navigate('/officer-profile');
  };

  const handleSettings = () => {
    navigate('/officer-settings');
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    // Mark notification as read
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => 
        notif.id === notification.id ? { ...notif, read: true } : notif
      )
    );
    
    // Navigate to the relevant page
    navigate(notification.linkTo);
  };

  // View all notifications
  const handleViewAllNotifications = () => {
    // Mark all notifications as read
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => ({ ...notif, read: true }))
    );
    
    toast({
      title: "Notifications",
      description: "All notifications marked as read",
    });
  };

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
      isScrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-100 py-2' : 'bg-white py-4'
    )}>
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/officer-dashboard" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-shield-blue" />
            <div className="flex flex-col">
              <span className="text-xl font-semibold text-shield-dark">Midshield</span>
              <span className="text-xs text-gray-500">Officer Portal</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button 
              variant="ghost" 
              className="text-sm font-medium text-gray-700 hover:text-shield-blue transition-colors"
              onClick={navigateToDashboard}
            >
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              className="text-sm font-medium text-gray-700 hover:text-shield-blue transition-colors"
              onClick={() => handleTabNavigation('sos')}
            >
              SOS Alerts
            </Button>
            <Button 
              variant="ghost" 
              className="text-sm font-medium text-gray-700 hover:text-shield-blue transition-colors"
              onClick={() => handleTabNavigation('kyc')}
            >
              KYC Verification
            </Button>
            <Button 
              variant="ghost" 
              className="text-sm font-medium text-gray-700 hover:text-shield-blue transition-colors"
              onClick={() => handleTabNavigation('advisories')}
            >
              Advisories
            </Button>
            <Button 
              variant="ghost" 
              className="text-sm font-medium text-gray-700 hover:text-shield-blue transition-colors"
              onClick={() => handleTabNavigation('criminals')}
            >
              Criminal Profiles
            </Button>
            <Button 
              variant="ghost" 
              className="text-sm font-medium text-gray-700 hover:text-shield-blue transition-colors"
              onClick={() => handleTabNavigation('cases')}
            >
              Case Mapping
            </Button>
            
            {/* Notification bell */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotificationsCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[20px] min-h-[20px] flex items-center justify-center text-xs" 
                      variant="destructive"
                    >
                      {unreadNotificationsCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-60 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <DropdownMenuItem 
                        key={notification.id} 
                        className={cn(
                          "flex flex-col items-start cursor-pointer p-3",
                          !notification.read && "bg-blue-50"
                        )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-xs text-gray-500">{notification.description}</div>
                        <div className="text-xs text-gray-400 mt-1">{notification.time}</div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-3 text-center text-sm text-gray-500">
                      No notifications
                    </div>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-blue-600 cursor-pointer justify-center"
                  onClick={handleViewAllNotifications}
                >
                  Mark all as read
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* User avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={officer.avatar} alt={officer.name} />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{officer.name}</p>
                    <p className="text-xs leading-none text-gray-500">Badge: {officer.badge}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleViewProfile}>
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSettings}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Notification bell - mobile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotificationsCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[20px] min-h-[20px] flex items-center justify-center text-xs" 
                      variant="destructive"
                    >
                      {unreadNotificationsCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-60 overflow-y-auto">
                  {notifications.map(notification => (
                    <DropdownMenuItem 
                      key={notification.id} 
                      className={cn(
                        "flex flex-col items-start cursor-pointer p-3",
                        !notification.read && "bg-blue-50"
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-xs text-gray-500">{notification.description}</div>
                      <div className="text-xs text-gray-400 mt-1">{notification.time}</div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-blue-600 cursor-pointer justify-center"
                  onClick={handleViewAllNotifications}
                >
                  Mark all as read
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <button
              className="text-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 animate-fade-in z-50">
          <div className="px-4 py-5 space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={officer.avatar} alt={officer.name} />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{officer.name}</p>
                <p className="text-xs text-gray-500">Badge: {officer.badge}</p>
              </div>
            </div>

            <Button 
              variant="ghost" 
              className="block w-full justify-start text-base font-medium text-gray-700 hover:text-shield-blue transition-colors"
              onClick={navigateToDashboard}
            >
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              className="block w-full justify-start text-base font-medium text-gray-700 hover:text-shield-blue transition-colors"
              onClick={() => handleTabNavigation('sos')}
            >
              SOS Alerts
            </Button>
            <Button 
              variant="ghost" 
              className="block w-full justify-start text-base font-medium text-gray-700 hover:text-shield-blue transition-colors"
              onClick={() => handleTabNavigation('kyc')}
            >
              KYC Verification
            </Button>
            <Button 
              variant="ghost" 
              className="block w-full justify-start text-base font-medium text-gray-700 hover:text-shield-blue transition-colors"
              onClick={() => handleTabNavigation('advisories')}
            >
              Advisories
            </Button>
            <Button 
              variant="ghost" 
              className="block w-full justify-start text-base font-medium text-gray-700 hover:text-shield-blue transition-colors"
              onClick={() => handleTabNavigation('criminals')}
            >
              Criminal Profiles
            </Button>
            <Button 
              variant="ghost" 
              className="block w-full justify-start text-base font-medium text-gray-700 hover:text-shield-blue transition-colors"
              onClick={() => handleTabNavigation('cases')}
            >
              Case Mapping
            </Button>
            
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <Button 
                variant="ghost"
                className="block w-full justify-start text-base font-medium text-gray-700 hover:text-shield-blue transition-colors"
                onClick={handleViewProfile}
              >
                <User className="h-4 w-4 mr-2" />
                My Profile
              </Button>
              <Button 
                variant="ghost"
                className="block w-full justify-start text-base font-medium text-gray-700 hover:text-shield-blue transition-colors"
                onClick={handleSettings}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="ghost"
                className="block w-full justify-start text-base font-medium text-red-600 hover:text-red-700 transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default OfficerNavbar;
