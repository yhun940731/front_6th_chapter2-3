import * as DialogPrimitive from '@radix-ui/react-dialog';
import React from 'react';

import {
  useCommentActions,
  useDialogState,
  useSelectionState,
} from '../../entities/post/model/hooks';
import { EditCommentFormContent } from '../../features/PostDialogs';
import { DialogContent, DialogHeader, DialogTitle } from '../../shared/ui';

export const Dialog = DialogPrimitive.Root;

const CommentEditDialog: React.FC = () => {
  const { showEditCommentDialog, setShowEditCommentDialog } = useDialogState();
  const { selectedComment, setSelectedComment } = useSelectionState();
  const { updateComment } = useCommentActions();
  return (
    <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <EditCommentFormContent
          selectedComment={selectedComment}
          setSelectedComment={
            setSelectedComment as unknown as (v: { id: number; body: string } | null) => void
          }
          onSubmit={updateComment}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CommentEditDialog;
