import * as DialogPrimitive from '@radix-ui/react-dialog';
import React from 'react';

import { AddPostFormContent } from '../../features/PostDialogs';
import { DialogContent, DialogHeader, DialogTitle } from '../../shared/ui';

export const Dialog = DialogPrimitive.Root;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newPost: { title: string; body: string; userId: number };
  setNewPost: (v: { title: string; body: string; userId: number }) => void;
  onSubmit: () => void;
};

const PostAddDialog: React.FC<Props> = ({ open, onOpenChange, newPost, setNewPost, onSubmit }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>새 게시물 추가</DialogTitle>
      </DialogHeader>
      <AddPostFormContent newPost={newPost} setNewPost={setNewPost} onSubmit={onSubmit} />
    </DialogContent>
  </Dialog>
);

export default PostAddDialog;
