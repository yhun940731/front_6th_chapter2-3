import React from 'react';

import { Button, Input, Textarea } from '../../shared/ui';

export const AddPostFormContent: React.FC<{
  newPost: { title: string; body: string; userId: number };
  setNewPost: (v: { title: string; body: string; userId: number }) => void;
  onSubmit: () => void;
}> = ({ newPost, setNewPost, onSubmit }) => (
  <div className='space-y-4'>
    <Input
      placeholder='제목'
      value={newPost.title}
      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
    />
    <Textarea
      rows={30}
      placeholder='내용'
      value={newPost.body}
      onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
    />
    <Input
      type='number'
      placeholder='사용자 ID'
      value={newPost.userId}
      onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
    />
    <Button onClick={onSubmit}>게시물 추가</Button>
  </div>
);

export const EditPostFormContent: React.FC<{
  selectedPost: any;
  setSelectedPost: (v: any) => void;
  onSubmit: () => void;
}> = ({ selectedPost, setSelectedPost, onSubmit }) => (
  <div className='space-y-4'>
    <Input
      placeholder='제목'
      value={selectedPost?.title || ''}
      onChange={(e) => selectedPost && setSelectedPost({ ...selectedPost, title: e.target.value })}
    />
    <Textarea
      rows={15}
      placeholder='내용'
      value={selectedPost?.body || ''}
      onChange={(e) => selectedPost && setSelectedPost({ ...selectedPost, body: e.target.value })}
    />
    <Button onClick={onSubmit}>게시물 업데이트</Button>
  </div>
);

export const AddCommentFormContent: React.FC<{
  newComment: { body: string; postId: number | null; userId: number };
  setNewComment: (v: { body: string; postId: number | null; userId: number }) => void;
  onSubmit: () => void;
}> = ({ newComment, setNewComment, onSubmit }) => (
  <div className='space-y-4'>
    <Textarea
      placeholder='댓글 내용'
      value={newComment.body}
      onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
    />
    <Button onClick={onSubmit}>댓글 추가</Button>
  </div>
);

export const EditCommentFormContent: React.FC<{
  selectedComment: any;
  setSelectedComment: (v: any) => void;
  onSubmit: () => void;
}> = ({ selectedComment, setSelectedComment, onSubmit }) => (
  <div className='space-y-4'>
    <Textarea
      placeholder='댓글 내용'
      value={selectedComment?.body || ''}
      onChange={(e) =>
        selectedComment && setSelectedComment({ ...selectedComment, body: e.target.value })
      }
    />
    <Button onClick={onSubmit}>댓글 업데이트</Button>
  </div>
);
