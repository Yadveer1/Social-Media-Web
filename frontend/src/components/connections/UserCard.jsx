import { useState } from 'react';
import { UserPlus, Download } from 'lucide-react';
import { toast } from 'sonner';

import { useConnectionStore } from '@/stores/connectionStore';
import { API_BASE_URL } from '@/utils/constants';
import { getInitials, getProfilePictureUrl } from '@/utils/formatters';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const UserCard = ({ profile, showActions = true }) => {
  const { sendConnectionRequest, downloadResume } = useConnectionStore();
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const result = await sendConnectionRequest(profile.userId._id);
      if (result.success) {
        toast.success('Connection request sent');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadResume = async () => {
    try {
      const result = await downloadResume(profile.userId._id);
      if (result.success && result.filename) {
        const url = `${API_BASE_URL}/${result.filename}`;
        window.open(url, '_blank');
        toast.success('Opening resume');
      } else {
        toast.error(result.message || 'Resume not available');
      }
    } catch (error) {
      toast.error('Failed to download resume');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage 
              src={getProfilePictureUrl(profile.userId?.profilePicture, API_BASE_URL)} 
              alt={profile.userId?.name || 'User'} 
            />
            <AvatarFallback className="text-lg">
              {profile.userId?.name ? getInitials(profile.userId.name) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{profile.userId?.name || 'Unknown User'}</h3>
            <p className="text-sm text-muted-foreground">@{profile.userId?.username || 'unknown'}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        {profile.currentPosition && (
          <p className="text-sm font-medium">{profile.currentPosition}</p>
        )}
        {profile.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2">{profile.bio}</p>
        )}
      </CardContent>
      
      {showActions && (
        <CardFooter className="flex gap-2">
          <Button 
            size="sm" 
            onClick={handleConnect}
            disabled={loading}
            className="flex-1"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Connect
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleDownloadResume}
          >
            <Download className="w-4 h-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default UserCard;
