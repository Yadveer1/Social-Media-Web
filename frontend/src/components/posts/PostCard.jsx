import { useState } from 'react';
import { Heart, MessageCircle, Trash2, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';

import { useAuthStore } from '@/stores/authStore';
import { usePostStore } from '@/stores/postStore';
import { useCommentStore } from '@/stores/commentStore';
import { API_BASE_URL } from '@/utils/constants';
import { formatDate, getInitials, getProfilePictureUrl } from '@/utils/formatters';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CommentSection from '@/components/comments/CommentSection';

const PostCard = ({ post, showActions = true }) => {
  const { user } = useAuthStore();
  const { toggleLike, deletePost } = usePostStore();
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [loading, setLoading] = useState(false);

  const isOwner = user?._id === post.userId?._id || user?.id === post.userId?._id;

  const handleLike = async () => {
    setLoading(true);
    const action = liked ? 'unlike' : 'like';
    
    // Optimistic update
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    
    try {
      const result = await toggleLike(post._id, action);
      if (!result.success) {
        // Revert on failure
        setLiked(liked);
        setLikesCount(post.likes);
        toast.error(result.message);
      }
    } catch (error) {
      setLiked(liked);
      setLikesCount(post.likes);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    setLoading(true);
    try {
      const result = await deletePost(post._id);
      if (result.success) {
        toast.success('Post deleted successfully');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to delete post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage 
                src={getProfilePictureUrl(post.userId?.profilePicture, API_BASE_URL)} 
                alt={post.userId?.name || 'User'}
              />
              <AvatarFallback>
                {post.userId?.name ? getInitials(post.userId.name) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{post.userId?.name || 'Unknown User'}</h3>
              <p className="text-sm text-muted-foreground">
                @{post.userId?.username || 'unknown'} · {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          
          {isOwner && showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="whitespace-pre-wrap">{post.body}</p>
        
        {post.media && (
          <div className="rounded-lg overflow-hidden">
            {post.fileType?.includes('image') || ['jpg', 'jpeg', 'png', 'gif'].includes(post.fileType) ? (
              <img 
                src={`${API_BASE_URL}/${post.media}`} 
                alt="Post media"
                className="w-full object-cover max-h-96"
              />
            ) : post.fileType?.includes('video') || ['mp4', 'webm', 'ogg'].includes(post.fileType) ? (
              <video 
                src={`${API_BASE_URL}/${post.media}`}
                controls
                className="w-full max-h-96"
              />
            ) : null}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col gap-3">
        <div className="flex gap-2 w-full">
          <Button 
            variant={liked ? "default" : "ghost"} 
            size="sm" 
            onClick={handleLike}
            disabled={loading}
          >
            <Heart className={`w-4 h-4 mr-1 ${liked ? 'fill-current' : ''}`} />
            {likesCount}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Comment
          </Button>
        </div>
        
        {showComments && <CommentSection postId={post._id} />}
      </CardFooter>
    </Card>
  );
};

export default PostCard;
