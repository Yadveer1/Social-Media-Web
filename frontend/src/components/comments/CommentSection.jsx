import { useState, useEffect } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { useAuthStore } from '@/stores/authStore';
import { useCommentStore } from '@/stores/commentStore';
import { API_BASE_URL } from '@/utils/constants';
import { formatDate, getInitials, getProfilePictureUrl } from '@/utils/formatters';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const CommentSection = ({ postId }) => {
  const { user } = useAuthStore();
  const { comments, fetchComments, addComment, deleteComment, loading } = useCommentStore();
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const postComments = comments[postId] || [];

  useEffect(() => {
    fetchComments(postId);
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      toast.error('Please write a comment');
      return;
    }

    setSubmitting(true);
    
    try {
      const result = await addComment(postId, commentText);
      if (result.success) {
        setCommentText('');
        toast.success('Comment added');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm('Delete this comment?')) return;
    
    try {
      const result = await deleteComment(commentId, postId);
      if (result.success) {
        toast.success('Comment deleted');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="w-full space-y-4">
      <Separator />
      
      {/* Comment form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Avatar className="w-8 h-8">
          <AvatarImage 
            src={getProfilePictureUrl(user?.profilePicture, API_BASE_URL)} 
            alt={user?.name || 'You'} 
          />
          <AvatarFallback className="text-xs">
            {user?.name ? getInitials(user.name) : 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 flex gap-2">
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="resize-none"
            rows={2}
            disabled={submitting}
          />
          <Button type="submit" size="sm" disabled={submitting}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
      
      {/* Comments list */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : postComments.length > 0 ? (
          postComments.map((comment) => {
            const isOwner = user?._id === comment.userId?._id || user?.id === comment.userId?._id;
            
            return (
              <div key={comment._id} className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage 
                    src={getProfilePictureUrl(comment.userId?.profilePicture, API_BASE_URL)} 
                    alt={comment.userId?.name || 'User'} 
                    />
                  <AvatarFallback className="text-xs">
                    {comment.userId?.name ? getInitials(comment.userId.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 bg-gray-100 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-sm">{comment.userId?.name || 'Unknown User'}</h4>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(comment._id)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm mt-1">{comment.body}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
