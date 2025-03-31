
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, X, Bell, LogOut } from 'lucide-react';
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

const OfficerNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Example officer data - in a real app, this would come from authentication
  const officer = {
    name: "Officer John Smith",
    badge: "P-12345",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    notifications: 5
  };

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
            <Link to="/officer-dashboard" className="text-sm font-medium text-gray-700 hover:text-shield-blue transition-colors">
              Dashboard
            </Link>
            <Link to="/officer-dashboard?tab=sos" className="text-sm font-medium text-gray-700 hover:text-shield-blue transition-colors">
              SOS Alerts
            </Link>
            <Link to="/officer-dashboard?tab=kyc" className="text-sm font-medium text-gray-700 hover:text-shield-blue transition-colors">
              KYC Verification
            </Link>
            <Link to="/officer-dashboard?tab=advisories" className="text-sm font-medium text-gray-700 hover:text-shield-blue transition-colors">
              Advisories
            </Link>
            <Link to="/officer-dashboard?tab=criminals" className="text-sm font-medium text-gray-700 hover:text-shield-blue transition-colors">
              Criminal Profiles
            </Link>
            <Link to="/officer-dashboard?tab=cases" className="text-sm font-medium text-gray-700 hover:text-shield-blue transition-colors">
              Case Mapping
            </Link>
            
            {/* Notification bell */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {officer.notifications > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[20px] min-h-[20px] flex items-center justify-center text-xs" 
                      variant="destructive"
                    >
                      {officer.notifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-60 overflow-y-auto">
                  <DropdownMenuItem className="flex flex-col items-start cursor-pointer">
                    <div className="font-medium">New SOS Alert</div>
                    <div className="text-xs text-gray-500">Downtown Central Square, 5 minutes ago</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start cursor-pointer">
                    <div className="font-medium">KYC Verification Pending</div>
                    <div className="text-xs text-gray-500">5 new users waiting for verification</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start cursor-pointer">
                    <div className="font-medium">New Tip Received</div>
                    <div className="text-xs text-gray-500">Information about wanted individual #1042</div>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-blue-600 cursor-pointer justify-center">
                  View all notifications
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
                <DropdownMenuItem>
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Notification bell - mobile */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {officer.notifications > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[20px] min-h-[20px] flex items-center justify-center text-xs" 
                  variant="destructive"
                >
                  {officer.notifications}
                </Badge>
              )}
            </Button>
            
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

            <Link 
              to="/officer-dashboard" 
              className="block text-base font-medium text-gray-700 hover:text-shield-blue transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/officer-dashboard?tab=sos" 
              className="block text-base font-medium text-gray-700 hover:text-shield-blue transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              SOS Alerts
            </Link>
            <Link 
              to="/officer-dashboard?tab=kyc" 
              className="block text-base font-medium text-gray-700 hover:text-shield-blue transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              KYC Verification
            </Link>
            <Link 
              to="/officer-dashboard?tab=advisories" 
              className="block text-base font-medium text-gray-700 hover:text-shield-blue transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Advisories
            </Link>
            <Link 
              to="/officer-dashboard?tab=criminals" 
              className="block text-base font-medium text-gray-700 hover:text-shield-blue transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Criminal Profiles
            </Link>
            <Link 
              to="/officer-dashboard?tab=cases" 
              className="block text-base font-medium text-gray-700 hover:text-shield-blue transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Case Mapping
            </Link>
            
            <div className="border-t border-gray-100 pt-4">
              <Link 
                to="/signin"
                className="flex items-center text-red-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default OfficerNavbar;
