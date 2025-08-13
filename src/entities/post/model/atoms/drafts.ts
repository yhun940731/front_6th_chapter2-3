import { atom } from 'jotai';

import type { NewComment, NewPost } from '../types';

export const newPostAtom = atom<NewPost>({ title: '', body: '', userId: 1 });
export const newCommentAtom = atom<NewComment>({ body: '', postId: null, userId: 1 });
