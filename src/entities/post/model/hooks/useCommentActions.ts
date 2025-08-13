import { useSetAtom } from 'jotai';

import {
  fetchCommentsAtom,
  addCommentAtom,
  updateCommentAtom,
  deleteCommentAtom,
  likeCommentAtom,
} from '../atoms';

export function useCommentActions() {
  const fetchComments = useSetAtom(fetchCommentsAtom);
  const addComment = useSetAtom(addCommentAtom);
  const updateComment = useSetAtom(updateCommentAtom);
  const deleteComment = useSetAtom(deleteCommentAtom);
  const likeComment = useSetAtom(likeCommentAtom);
  return { fetchComments, addComment, updateComment, deleteComment, likeComment };
}
