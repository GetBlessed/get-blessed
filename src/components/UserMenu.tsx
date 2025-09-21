import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User, LogOut, Settings, Heart, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SignupModal from './SignupModal';

export const UserMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getUserInitials = () => {
    if (!user) return '';

    // Priority: nickname > name from profile > name from metadata > email
    const name = user.profile?.nickname ||
                 user.profile?.name ||
                 user.user_metadata?.nickname ||
                 user.user_metadata?.name ||
                 user.email || '';

    if (user.profile?.nickname || user.user_metadata?.nickname) {
      const nickname = user.profile?.nickname || user.user_metadata?.nickname || '';
      return nickname.slice(0, 2).toUpperCase();
    }

    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  };

  const getDisplayName = () => {
    if (!user) return '';
    // Priority: nickname > name from profile > name from metadata
    return user.profile?.nickname ||
           user.profile?.name ||
           user.user_metadata?.nickname ||
           user.user_metadata?.name ||
           'User';
  };

  const getFullName = () => {
    if (!user) return '';
    // Show full name if available (not nickname)
    return user.profile?.name || user.user_metadata?.name || '';
  };

  if (!user) {
    return (
      <>
        <Button
          onClick={() => setShowSignupModal(true)}
          variant="outline"
          size="sm"
          className="rounded-full"
        >
          <User className="h-4 w-4 mr-2" />
          Sign In
        </Button>

        <SignupModal
          isOpen={showSignupModal}
          onClose={() => setShowSignupModal(false)}
          onSuccess={() => {
            setShowSignupModal(false);
          }}
        />
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user.user_metadata?.avatar_url}
              alt={getDisplayName()}
            />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
            {getFullName() && getFullName() !== getDisplayName() && (
              <p className="text-xs font-normal leading-none text-foreground">
                {getFullName()}
              </p>
            )}
            <p className="text-xs leading-none text-muted-foreground">
              {user.email || user.profile?.email}
            </p>
            {(user.profile?.organization || user.user_metadata?.organization) && (
              <p className="text-xs leading-none text-muted-foreground">
                {user.profile?.organization || user.user_metadata?.organization}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigate('/dashboard')}
          className="cursor-pointer"
        >
          <Heart className="mr-2 h-4 w-4" />
          <span>My Prayers</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate('/gifts')}
          className="cursor-pointer"
        >
          <Gift className="mr-2 h-4 w-4" />
          <span>Gift a Prayer</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate('/settings')}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};