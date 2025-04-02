
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import UserAvatar from './UserAvatar';

const UserMenu: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <UserAvatar />
    </div>
  );
};

export default UserMenu;
