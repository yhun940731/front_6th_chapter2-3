import * as DialogPrimitive from '@radix-ui/react-dialog';
import React from 'react';

import type { Post } from '../../entities/post/model/types';
import { EditPostFormContent } from '../../features/PostDialogs';
import { DialogContent, DialogHeader, DialogTitle } from '../../shared/ui';

export const Dialog = DialogPrimitive.Root;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPost: Post | null;
  setSelectedPost: (v: Post | null) => void;
  onSubmit: () => void;
};

const PostEditDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  selectedPost,
  setSelectedPost,
  onSubmit,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>게시물 수정</DialogTitle>
      </DialogHeader>
      <EditPostFormContent
        selectedPost={selectedPost}
        setSelectedPost={setSelectedPost}
        onSubmit={onSubmit}
      />
    </DialogContent>
  </Dialog>
);

export default PostEditDialog;
