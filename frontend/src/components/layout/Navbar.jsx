import { Link, useNavigate } from 'react-router-dom';
import { Home, Users, User, FileText, LogOut, Search } from 'lucide-react';
import { toast } from 'sonner';

import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import { API_BASE_URL } from '@/utils/constants';
import { getInitials, getProfilePictureUrl } from '@/utils/formatters';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const { profile } = useUserStore();
  
  const currentUser = profile?.userId || user;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="font-bold text-xl hidden sm:inline">ProNetwork</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard" className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/connections" className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>Network</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/my-posts" className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  <span>My Posts</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/search" className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage 
                      src={getProfilePictureUrl(currentUser?.profilePicture, API_BASE_URL)} 
                      alt={currentUser?.name || 'User'} 
                    />
                    <AvatarFallback>
                      {currentUser?.name ? getInitials(currentUser.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser?.name || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser?.email || ''}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-posts" className="cursor-pointer flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>My Posts</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden flex justify-around border-t border-gray-200 py-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard">
            <Home className="w-5 h-5" />
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/connections">
            <Users className="w-5 h-5" />
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/my-posts">
            <FileText className="w-5 h-5" />
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/search">
            <Search className="w-5 h-5" />
          </Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
