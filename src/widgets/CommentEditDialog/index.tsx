import * as DialogPrimitive from '@radix-ui/react-dialog';
import React from 'react';

import { EditCommentFormContent } from '../../features/PostDialogs';
import { DialogContent, DialogHeader, DialogTitle } from '../../shared/ui';

export const Dialog = DialogPrimitive.Root;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedComment: { id: number; body: string } | null;
  setSelectedComment: (v: { id: number; body: string } | null) => void;
  onSubmit: () => void;
};

const CommentEditDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  selectedComment,
  setSelectedComment,
  onSubmit,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>댓글 수정</DialogTitle>
      </DialogHeader>
      <EditCommentFormContent
        selectedComment={selectedComment}
        setSelectedComment={setSelectedComment}
        onSubmit={onSubmit}
      />
    </DialogContent>
  </Dialog>
);

export default CommentEditDialog;
