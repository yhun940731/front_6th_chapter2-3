// Post API functions (dummyjson proxy via /api)
export async function apiFetchPosts(limit: number, skip: number) {
  const res = await fetch(`/api/posts?limit=${limit}&skip=${skip}`);
  return res.json();
}

export async function apiFetchUsersLite() {
  const res = await fetch('/api/users?limit=0&select=username,image');
  return res.json();
}

export async function apiFetchTags() {
  const res = await fetch('/api/posts/tags');
  return res.json();
}

export async function apiSearchPosts(q: string) {
  const res = await fetch(`/api/posts/search?q=${encodeURIComponent(q)}`);
  return res.json();
}

export async function apiFetchPostsByTag(tag: string) {
  const res = await fetch(`/api/posts/tag/${encodeURIComponent(tag)}`);
  return res.json();
}

export async function apiAddPost(payload: { title: string; body: string; userId: number }) {
  const res = await fetch('/api/posts/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function apiUpdatePost(id: number, payload: any) {
  const res = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function apiDeletePost(id: number) {
  await fetch(`/api/posts/${id}`, { method: 'DELETE' });
}
// Unused after FSD refactor cleanup. File intentionally left blank.
export {};
