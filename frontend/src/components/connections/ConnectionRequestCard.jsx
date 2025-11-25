import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';

import { useConnectionStore } from '@/stores/connectionStore';
import { API_BASE_URL } from '@/utils/constants';
import { formatDate, getInitials, getProfilePictureUrl } from '@/utils/formatters';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ConnectionRequestCard = ({ request, type = 'received' }) => {
  const { respondToRequest, fetchReceivedRequests } = useConnectionStore();
  const [loading, setLoading] = useState(false);

  const displayUser = type === 'received' ? request.userId : request.connectionId;

  const handleAccept = async () => {
    setLoading(true);
    try {
      const result = await respondToRequest(request._id, 'accept');
      if (result.success) {
        toast.success('Connection accepted');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to accept request');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      const result = await respondToRequest(request._id, 'reject');
      if (result.success) {
        toast.success('Connection rejected');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to reject request');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (request.status === null) return <Badge variant="secondary">Pending</Badge>;
    if (request.status === true) return <Badge variant="default">Accepted</Badge>;
    if (request.status === false) return <Badge variant="destructive">Rejected</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage 
                src={getProfilePictureUrl(displayUser?.profilePicture, API_BASE_URL)} 
                alt={displayUser?.name || 'User'} 
              />
              <AvatarFallback>
                {displayUser?.name ? getInitials(displayUser.name) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{displayUser?.name || 'Unknown User'}</h3>
              <p className="text-sm text-muted-foreground">
                @{displayUser?.username || 'unknown'}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          {formatDate(request.createdAt)}
        </p>
        
        {type === 'received' && request.status === null && (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={handleAccept}
              disabled={loading}
              className="flex-1"
            >
              <Check className="w-4 h-4 mr-2" />
              Accept
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleReject}
              disabled={loading}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConnectionRequestCard;
