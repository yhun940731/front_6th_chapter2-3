import { atom } from 'jotai';

import type { Comment, NewComment, NewPost, Post, Tag, User, UserLite } from './types';
import {
  apiAddPost,
  apiDeletePost,
  apiFetchPosts,
  apiFetchPostsByTag,
  apiFetchTags,
  apiFetchUsersLite,
  apiSearchPosts,
  apiUpdatePost,
} from '../api';

// Core state atoms
export const postsAtom = atom<Post[]>([]);
export const totalAtom = atom<number>(0);
export const skipAtom = atom<number>(0);
export const limitAtom = atom<number>(10);
export const searchQueryAtom = atom<string>('');
export const sortByAtom = atom<string>('');
export const sortOrderAtom = atom<'asc' | 'desc'>('asc');
export const tagsAtom = atom<Tag[]>([]);
export const selectedTagAtom = atom<string>('');
export const loadingAtom = atom<boolean>(false);

// UI atoms
export const showAddDialogAtom = atom<boolean>(false);
export const showEditDialogAtom = atom<boolean>(false);
export const showPostDetailDialogAtom = atom<boolean>(false);
export const showAddCommentDialogAtom = atom<boolean>(false);
export const showEditCommentDialogAtom = atom<boolean>(false);
export const showUserModalAtom = atom<boolean>(false);

// Selection atoms
export const selectedPostAtom = atom<Post | null>(null);
export const selectedUserAtom = atom<User | null>(null);
export const selectedCommentAtom = atom<Comment | null>(null);

// Draft atoms
export const newPostAtom = atom<NewPost>({ title: '', body: '', userId: 1 });
export const newCommentAtom = atom<NewComment>({ body: '', postId: null, userId: 1 });

// Comments map: postId -> comments
export const commentsAtom = atom<Record<number, Comment[]>>({});

// Actions
export const fetchTagsAtom = atom(null, async (_get, set) => {
  const data = await apiFetchTags();
  set(tagsAtom, data as Tag[]);
});

export const fetchPostsAtom = atom(null, async (get, set) => {
  set(loadingAtom, true);
  try {
    const limit = get(limitAtom);
    const skip = get(skipAtom);
    const postsData = await apiFetchPosts(limit, skip);
    const usersData = await apiFetchUsersLite();
    const users = usersData.users as UserLite[];
    const postsWithUsers = (postsData.posts as Post[]).map((post) => ({
      ...post,
      author: users.find((u) => u.id === post.userId),
    }));
    set(postsAtom, postsWithUsers);
    set(totalAtom, postsData.total as number);
  } finally {
    set(loadingAtom, false);
  }
});

export const fetchPostsByTagAtom = atom(null, async (_get, set, tag: string) => {
  if (!tag || tag === 'all') {
    await set(fetchPostsAtom);
    return;
  }
  set(loadingAtom, true);
  try {
    const [postsData, usersData] = await Promise.all([
      apiFetchPostsByTag(tag),
      apiFetchUsersLite(),
    ]);
    const users = usersData.users as UserLite[];
    const postsWithUsers = (postsData.posts as Post[]).map((post) => ({
      ...post,
      author: users.find((u) => u.id === post.userId),
    }));
    set(postsAtom, postsWithUsers);
    set(totalAtom, postsData.total as number);
  } finally {
    set(loadingAtom, false);
  }
});

export const searchPostsAtom = atom(null, async (get, set) => {
  const q = get(searchQueryAtom);
  if (!q) {
    await set(fetchPostsAtom);
    return;
  }
  set(loadingAtom, true);
  try {
    const data = await apiSearchPosts(q);
    set(postsAtom, data.posts as Post[]);
    set(totalAtom, data.total as number);
  } finally {
    set(loadingAtom, false);
  }
});

export const addPostAtom = atom(null, async (get, set) => {
  const draft = get(newPostAtom);
  const data = await apiAddPost(draft);
  set(postsAtom, [data as Post, ...get(postsAtom)]);
  set(showAddDialogAtom, false);
  set(newPostAtom, { title: '', body: '', userId: 1 });
});

export const updatePostAtom = atom(null, async (get, set) => {
  const post = get(selectedPostAtom)!;
  const updated = await apiUpdatePost(post.id, post);
  set(
    postsAtom,
    get(postsAtom).map((p) => (p.id === updated.id ? (updated as Post) : p)),
  );
  set(showEditDialogAtom, false);
});

export const deletePostAtom = atom(null, async (get, set, id: number) => {
  await apiDeletePost(id);
  set(
    postsAtom,
    get(postsAtom).filter((p) => p.id !== id),
  );
});

export const fetchCommentsAtom = atom(null, async (get, set, postId: number) => {
  if (get(commentsAtom)[postId]) return;
  const res = await fetch(`/api/comments/post/${postId}`);
  const data = await res.json();
  set(commentsAtom, { ...get(commentsAtom), [postId]: data.comments as Comment[] });
});

export const addCommentAtom = atom(null, async (get, set) => {
  const draft = get(newCommentAtom);
  const res = await fetch('/api/comments/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draft),
  });
  const data = await res.json();
  const map = get(commentsAtom);
  set(commentsAtom, { ...map, [data.postId]: [...(map[data.postId] || []), data as Comment] });
  set(showAddCommentDialogAtom, false);
  set(newCommentAtom, { body: '', postId: null, userId: 1 });
});

export const updateCommentAtom = atom(null, async (get, set) => {
  const selected = get(selectedCommentAtom)!;
  const res = await fetch(`/api/comments/${selected.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body: selected.body }),
  });
  const data = await res.json();
  const postId = data.postId as number;
  set(commentsAtom, {
    ...get(commentsAtom),
    [postId]: get(commentsAtom)[postId].map((c) => (c.id === data.id ? (data as Comment) : c)),
  });
  set(showEditCommentDialogAtom, false);
});

export const deleteCommentAtom = atom(null, async (get, set, id: number, postId: number) => {
  await fetch(`/api/comments/${id}`, { method: 'DELETE' });
  set(commentsAtom, {
    ...get(commentsAtom),
    [postId]: get(commentsAtom)[postId].filter((c) => c.id !== id),
  });
});

export const likeCommentAtom = atom(null, async (get, set, id: number, postId: number) => {
  const current = get(commentsAtom)[postId].find((c) => c.id === id)!;
  const res = await fetch(`/api/comments/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ likes: current.likes + 1 }),
  });
  const data = await res.json();
  set(commentsAtom, {
    ...get(commentsAtom),
    [postId]: get(commentsAtom)[postId].map((c) =>
      c.id === data.id ? ({ ...data, likes: current.likes + 1 } as Comment) : c,
    ),
  });
});
