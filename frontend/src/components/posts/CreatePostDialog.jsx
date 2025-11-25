import { useState } from 'react';
import { toast } from 'sonner';
import { Image, X } from 'lucide-react';

import { usePostStore } from '@/stores/postStore';
import { ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES, MAX_FILE_SIZE } from '@/utils/constants';
import { validateFile } from '@/utils/formatters';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const CreatePostDialog = ({ isOpen, onClose }) => {
  const { createPost } = usePostStore();
  const [body, setBody] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMediaChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
    const validation = validateFile(file, allowedTypes, MAX_FILE_SIZE);
    
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    setMedia(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    setMedia(null);
    setMediaPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!body.trim()) {
      toast.error('Please write something');
      return;
    }

    setLoading(true);
    
    try {
      const result = await createPost(body, media);
      if (result.success) {
        toast.success('Post created successfully');
        setBody('');
        setMedia(null);
        setMediaPreview(null);
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setBody('');
      setMedia(null);
      setMediaPreview(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>
            Share your thoughts with your network
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="body">What's on your mind?</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share your thoughts..."
              rows={5}
              disabled={loading}
              className="resize-none"
            />
          </div>
          
          {mediaPreview && (
            <div className="relative rounded-lg overflow-hidden">
              {media?.type.startsWith('image/') ? (
                <img src={mediaPreview} alt="Preview" className="w-full max-h-64 object-cover" />
              ) : media?.type.startsWith('video/') ? (
                <video src={mediaPreview} controls className="w-full max-h-64" />
              ) : null}
              
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={removeMedia}
                disabled={loading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <input
              type="file"
              id="media-upload"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleMediaChange}
              disabled={loading}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
              disabled={loading}
            >
              <label htmlFor="media-upload" className="cursor-pointer">
                <Image className="w-4 h-4 mr-2" />
                Add Photo/Video
              </label>
            </Button>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Posting...' : 'Post'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
