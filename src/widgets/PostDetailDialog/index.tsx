import * as DialogPrimitive from '@radix-ui/react-dialog';
import React from 'react';

import type { Post } from '../../entities/post/model/types';
import { DialogContent, DialogHeader, DialogTitle } from '../../shared/ui';

export const Dialog = DialogPrimitive.Root;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPost: Post | null;
  searchQuery: string;
  highlightText: (text: string, highlight: string) => React.ReactNode;
  renderComments: (postId: number) => React.ReactNode;
};

const PostDetailDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  selectedPost,
  searchQuery,
  highlightText,
  renderComments,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost?.title ?? '', searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <p>{highlightText(selectedPost?.body ?? '', searchQuery)}</p>
          {selectedPost && renderComments(selectedPost.id)}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDetailDialog;
