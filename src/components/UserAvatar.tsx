
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, CreditCard, FileText, Shield } from 'lucide-react';

const UserAvatar = () => {
  const { user, signout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link 
          to="/signin" 
          className="py-2 px-4 text-foreground hover:text-foreground/80 transition-colors"
        >
          Sign In
        </Link>
        <Link 
          to="/get-started" 
          className="py-2 px-4 bg-shield-blue text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Get Started
        </Link>
      </div>
    );
  }

  const handleSignOut = () => {
    signout();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none">
          <Avatar className="h-9 w-9 cursor-pointer border-2 border-transparent hover:border-shield-blue transition-all">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-shield-blue text-white">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/ekyc')}>
          <Shield className="mr-2 h-4 w-4" />
          <span>KYC Verification</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/continue-report')}>
          <FileText className="mr-2 h-4 w-4" />
          <span>My Reports</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/view-all-rewards')}>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>My Rewards</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 hover:text-red-700 hover:bg-red-50">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
