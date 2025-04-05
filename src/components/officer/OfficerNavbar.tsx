
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, User, Settings, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useOfficerAuth } from '@/contexts/OfficerAuthContext';

const OfficerNavbar = () => {
  const { officer, signOut } = useOfficerAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate("/officer-login");
  };
  
  return (
    <header className="fixed w-full bg-white shadow-sm z-50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/officer-dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                P
              </div>
              <span className="font-semibold text-gray-900">Officer Portal</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-4">
              <Link to="/officer-dashboard" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-shield-blue">
                Dashboard
              </Link>
              <Link to="/officer-dashboard?tab=sos" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-shield-blue">
                SOS Alerts
              </Link>
              <Link to="/officer-dashboard?tab=kyc" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-shield-blue">
                KYC Verification
              </Link>
              <Link to="/officer-dashboard?tab=advisories" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-shield-blue">
                Advisories
              </Link>
            </nav>
            
            {officer ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(officer.full_name)}&color=7F9CF5&background=EBF4FF`} />
                      <AvatarFallback>{officer.full_name[0]}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{officer.full_name}</p>
                      <p className="text-xs text-gray-500">{officer.department_email}</p>
                      <p className="text-xs text-gray-500">Badge: {officer.badge_number}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/officer-dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/officer-profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/officer-settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default" size="sm" className="bg-shield-blue text-white hover:bg-blue-600">
                <Link to="/officer-login">Sign in</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default OfficerNavbar;
