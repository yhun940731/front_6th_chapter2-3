import * as DialogPrimitive from '@radix-ui/react-dialog';
import React from 'react';

import { AddCommentFormContent } from '../../features/PostDialogs';
import { DialogContent, DialogHeader, DialogTitle } from '../../shared/ui';

export const Dialog = DialogPrimitive.Root;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newComment: { body: string; postId: number | null; userId: number };
  setNewComment: (v: { body: string; postId: number | null; userId: number }) => void;
  onSubmit: () => void;
};

const CommentAddDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  newComment,
  setNewComment,
  onSubmit,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>새 댓글 추가</DialogTitle>
      </DialogHeader>
      <AddCommentFormContent
        newComment={newComment}
        setNewComment={setNewComment}
        onSubmit={onSubmit}
      />
    </DialogContent>
  </Dialog>
);

export default CommentAddDialog;
