import * as DialogPrimitive from '@radix-ui/react-dialog';
import React, { useEffect } from 'react';

import {
  useCommentActions,
  useDialogState,
  usePostsState,
  useSelectionState,
} from '../../entities/post/model/hooks';
import { DialogContent, DialogHeader, DialogTitle } from '../../shared/ui';
import CommentsList from '../../widgets/CommentsList';

export const Dialog = DialogPrimitive.Root;

const PostDetailDialog: React.FC = () => {
  const { showPostDetailDialog, setShowPostDetailDialog } = useDialogState();
  const { selectedPost, setSelectedComment, newComment, setNewComment, comments } =
    useSelectionState();
  const { searchQuery } = usePostsState();
  const { fetchComments, deleteComment, likeComment } = useCommentActions();

  // 기존 페이지의 하이라이트 로직을 동일하게 사용
  const highlightText = (text: string | undefined, highlight: string) => {
    if (!text) return null;
    if (!highlight.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>,
        )}
      </span>
    );
  };

  useEffect(() => {
    if (showPostDetailDialog && selectedPost) {
      fetchComments(selectedPost.id);
    }
  }, [showPostDetailDialog, selectedPost]);

  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost?.title ?? '', searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <p>{highlightText(selectedPost?.body ?? '', searchQuery)}</p>
          {selectedPost && (
            <CommentsList
              postId={selectedPost.id}
              comments={comments}
              searchQuery={searchQuery}
              onAddClick={(pid) => setNewComment({ ...newComment, postId: pid })}
              onLike={likeComment}
              onEdit={(comment) => setSelectedComment(comment)}
              onDelete={deleteComment}
              highlightText={(text, h) => highlightText(text, h)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDetailDialog;
