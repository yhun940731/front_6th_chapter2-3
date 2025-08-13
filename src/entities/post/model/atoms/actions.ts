import { atom } from 'jotai';

import {
  apiAddPost,
  apiDeletePost,
  apiFetchPosts,
  apiFetchPostsByTag,
  apiFetchTags,
  apiFetchUsersLite,
  apiSearchPosts,
  apiUpdatePost,
} from '../../api';
import type { Comment, Post, Tag, UserLite } from '../types';
import { commentsAtom } from './comments';
import { newCommentAtom, newPostAtom } from './drafts';
import { selectedCommentAtom, selectedPostAtom } from './selection';
import {
  postsAtom,
  totalAtom,
  skipAtom,
  limitAtom,
  searchQueryAtom,
  tagsAtom,
  loadingAtom,
} from './state';
import {
  showAddCommentDialogAtom,
  showAddDialogAtom,
  showEditCommentDialogAtom,
  showEditDialogAtom,
} from './ui';

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
  const current = get(postsAtom) as Post[];
  set(postsAtom, [data as Post, ...current]);
  set(showAddDialogAtom, false);
  set(newPostAtom, { title: '', body: '', userId: 1 });
});

export const updatePostAtom = atom(null, async (get, set) => {
  const post = get(selectedPostAtom) as Post;
  const updated = await apiUpdatePost(post.id, post);
  set(
    postsAtom,
    (get(postsAtom) as Post[]).map((p) => (p.id === updated.id ? (updated as Post) : p)),
  );
  set(showEditDialogAtom, false);
});

export const deletePostAtom = atom(null, async (get, set, id: number) => {
  await apiDeletePost(id);
  set(
    postsAtom,
    (get(postsAtom) as Post[]).filter((p) => p.id !== id),
  );
});

export const fetchCommentsAtom = atom(null, async (get, set, postId: number) => {
  const map = get(commentsAtom) as Record<number, Comment[]>;
  if (map[postId]) return;
  const res = await fetch(`/api/comments/post/${postId}`);
  const data = await res.json();
  set(commentsAtom, { ...map, [postId]: data.comments as Comment[] });
});

export const addCommentAtom = atom(null, async (get, set) => {
  const draft = get(newCommentAtom);
  const res = await fetch('/api/comments/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draft),
  });
  const data = await res.json();
  const map = get(commentsAtom) as Record<number, Comment[]>;
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
  const map = get(commentsAtom) as Record<number, Comment[]>;
  set(commentsAtom, {
    ...map,
    [postId]: map[postId].map((c) => (c.id === data.id ? (data as Comment) : c)),
  });
  set(showEditCommentDialogAtom, false);
});

export const deleteCommentAtom = atom(null, async (get, set, id: number, postId: number) => {
  await fetch(`/api/comments/${id}`, { method: 'DELETE' });
  const map = get(commentsAtom) as Record<number, Comment[]>;
  set(commentsAtom, {
    ...map,
    [postId]: map[postId].filter((c) => c.id !== id),
  });
});

export const likeCommentAtom = atom(null, async (get, set, id: number, postId: number) => {
  const map = get(commentsAtom) as Record<number, Comment[]>;
  const current = map[postId].find((c) => c.id === id)!;
  const res = await fetch(`/api/comments/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ likes: current.likes + 1 }),
  });
  const data = await res.json();
  set(commentsAtom, {
    ...map,
    [postId]: map[postId].map((c) =>
      c.id === data.id ? ({ ...data, likes: current.likes + 1 } as Comment) : c,
    ),
  });
});
