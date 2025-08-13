import { useAtom, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// entities imports
import {
  addCommentAtom,
  addPostAtom,
  commentsAtom,
  deleteCommentAtom,
  deletePostAtom,
  fetchCommentsAtom,
  fetchPostsAtom,
  fetchPostsByTagAtom,
  fetchTagsAtom,
  likeCommentAtom,
  limitAtom,
  loadingAtom,
  newCommentAtom,
  newPostAtom,
  postsAtom,
  searchPostsAtom,
  searchQueryAtom,
  selectedCommentAtom,
  selectedPostAtom,
  selectedTagAtom,
  selectedUserAtom,
  showAddCommentDialogAtom,
  showAddDialogAtom,
  showEditCommentDialogAtom,
  showEditDialogAtom,
  showPostDetailDialogAtom,
  showUserModalAtom,
  skipAtom,
  sortByAtom,
  sortOrderAtom,
  tagsAtom,
  totalAtom,
  updateCommentAtom,
  updatePostAtom,
} from '../entities/post/model/atoms';
import type { Post, User } from '../entities/post/model/types';
import PaginationControls from '../features/PaginationControls';
import PostsControls from '../features/PostsControls';
import { Card, CardContent } from '../shared/ui';
import CommentAddDialog from '../widgets/CommentAddDialog';
import CommentEditDialog from '../widgets/CommentEditDialog';
import CommentsList from '../widgets/CommentsList';
import PostAddDialog from '../widgets/PostAddDialog';
import PostDetailDialog from '../widgets/PostDetailDialog';
import PostEditDialog from '../widgets/PostEditDialog';
import PostsHeader from '../widgets/PostsHeader';
import PostsTable from '../widgets/PostsTable';
import UserModal from '../widgets/UserModal';
// FSD 분리된 컴포넌트

const PostsManager = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 상태 관리 (Jotai)
  const [posts] = useAtom(postsAtom);
  const [total] = useAtom(totalAtom);
  const [skip, setSkip] = useAtom(skipAtom);
  const [limit, setLimit] = useAtom(limitAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [selectedPost, setSelectedPost] = useAtom(selectedPostAtom);
  const [sortBy, setSortBy] = useAtom(sortByAtom);
  const [sortOrder, setSortOrder] = useAtom(sortOrderAtom);
  const [showAddDialog, setShowAddDialog] = useAtom(showAddDialogAtom);
  const [showEditDialog, setShowEditDialog] = useAtom(showEditDialogAtom);
  const [newPost, setNewPost] = useAtom(newPostAtom);
  const [loading] = useAtom(loadingAtom);
  const [tags] = useAtom(tagsAtom);
  const [selectedTag, setSelectedTag] = useAtom(selectedTagAtom);
  const [comments] = useAtom(commentsAtom);
  const [selectedComment, setSelectedComment] = useAtom(selectedCommentAtom);
  const [newComment, setNewComment] = useAtom(newCommentAtom);
  const [showAddCommentDialog, setShowAddCommentDialog] = useAtom(showAddCommentDialogAtom);
  const [showEditCommentDialog, setShowEditCommentDialog] = useAtom(showEditCommentDialogAtom);
  const [showPostDetailDialog, setShowPostDetailDialog] = useAtom(showPostDetailDialogAtom);
  const [showUserModal, setShowUserModal] = useAtom(showUserModalAtom);
  const [selectedUser, setSelectedUser] = useAtom(selectedUserAtom);

  // 액션 (write-only atoms)
  const doFetchTags = useSetAtom(fetchTagsAtom);
  const doFetchPosts = useSetAtom(fetchPostsAtom);
  const doFetchPostsByTag = useSetAtom(fetchPostsByTagAtom);
  const doSearchPosts = useSetAtom(searchPostsAtom);
  const doAddPost = useSetAtom(addPostAtom);
  const doUpdatePost = useSetAtom(updatePostAtom);
  const doDeletePost = useSetAtom(deletePostAtom);
  const doFetchComments = useSetAtom(fetchCommentsAtom);
  const doAddComment = useSetAtom(addCommentAtom);
  const doUpdateComment = useSetAtom(updateCommentAtom);
  const doDeleteComment = useSetAtom(deleteCommentAtom);
  const doLikeComment = useSetAtom(likeCommentAtom);

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams();
    if (skip) params.set('skip', skip.toString());
    if (limit) params.set('limit', limit.toString());
    if (searchQuery) params.set('search', searchQuery);
    if (sortBy) params.set('sortBy', sortBy);
    if (sortOrder) params.set('sortOrder', sortOrder);
    if (selectedTag) params.set('tag', selectedTag);
    navigate(`?${params.toString()}`);
  };

  // 게시물 가져오기
  const fetchPosts = () => doFetchPosts();

  // 태그 가져오기
  const fetchTags = () => doFetchTags();

  // 게시물 검색
  const searchPosts = () => doSearchPosts();

  // 태그별 게시물 가져오기
  const fetchPostsByTag = (tag: string) => doFetchPostsByTag(tag);

  // 게시물 추가
  const addPost = () => doAddPost();

  // 게시물 업데이트
  const updatePost = () => doUpdatePost();

  // 게시물 삭제
  const deletePost = (id: number) => doDeletePost(id);

  // 댓글 가져오기
  const fetchComments = (postId: number) => doFetchComments(postId);

  // 댓글 추가
  const addComment = () => doAddComment();

  // 댓글 업데이트
  const updateComment = () => doUpdateComment();

  // 댓글 삭제
  const deleteComment = (id: number, postId: number) => doDeleteComment(id, postId);

  // 댓글 좋아요
  const likeComment = (id: number, postId: number) => doLikeComment(id, postId);

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post);
    fetchComments(post.id);
    setShowPostDetailDialog(true);
  };

  // 사용자 모달 열기
  const openUserModal = async (user: User) => {
    try {
      const response = await fetch(`/api/users/${user.id}`);
      const userData = await response.json();
      setSelectedUser(userData);
      setShowUserModal(true);
    } catch (error) {
      console.error('사용자 정보 가져오기 오류:', error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag);
    } else {
      fetchPosts();
    }
    updateURL();
  }, [skip, limit, sortBy, sortOrder, selectedTag]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSkip(parseInt(params.get('skip') || '0'));
    setLimit(parseInt(params.get('limit') || '10'));
    setSearchQuery(params.get('search') || '');
    setSortBy(params.get('sortBy') || '');
    setSortOrder((params.get('sortOrder') as 'asc' | 'desc') || 'asc');
    setSelectedTag(params.get('tag') || '');
  }, [location.search]);

  // 하이라이트 함수 추가
  const highlightText = (text: string | undefined, highlight: string) => {
    if (!text) return null;
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
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

  // FSD 위젯/피처 콜백
  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    updateURL();
  };
  const handleOpenEditPost = (post: Post) => {
    setSelectedPost(post);
    setShowEditDialog(true);
  };
  const renderComments = (postId: number) => (
    <CommentsList
      postId={postId}
      comments={comments}
      searchQuery={searchQuery}
      onAddClick={(pid) => {
        setNewComment((prev) => ({ ...prev, postId: pid }));
        setShowAddCommentDialog(true);
      }}
      onLike={likeComment}
      onEdit={(comment) => {
        setSelectedComment(comment);
        setShowEditCommentDialog(true);
      }}
      onDelete={deleteComment}
      highlightText={highlightText}
    />
  );

  return (
    <main className='flex-grow container mx-auto px-4 py-8'>
      <Card className='w-full max-w-6xl mx-auto'>
        <PostsHeader title='게시물 관리자' onAddClick={() => setShowAddDialog(true)} />

        <CardContent>
          <div className='flex flex-col gap-4'>
            {/* 검색 및 필터 컨트롤 - Feature */}
            <PostsControls
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchEnter={searchPosts}
              selectedTag={selectedTag}
              tags={tags}
              onTagChange={(value) => {
                setSelectedTag(value);
                fetchPostsByTag(value);
                updateURL();
              }}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              sortOrder={sortOrder}
              onSortOrderChange={(v) => setSortOrder(v as 'asc' | 'desc')}
            />

            {/* 게시물 테이블 - Widget */}
            {loading ? (
              <div className='flex justify-center p-4'>로딩 중...</div>
            ) : (
              <PostsTable
                posts={posts}
                searchQuery={searchQuery}
                selectedTag={selectedTag}
                onTagClick={handleTagClick}
                onOpenPostDetail={openPostDetail}
                onEditPost={handleOpenEditPost}
                onDeletePost={deletePost}
                highlightText={highlightText}
                onAuthorClick={openUserModal}
              />
            )}

            {/* 페이지네이션 - Feature */}
            <PaginationControls
              limit={limit}
              skip={skip}
              total={total}
              onLimitChange={(v) => setLimit(v)}
              onPrev={() => setSkip(Math.max(0, skip - limit))}
              onNext={() => setSkip(skip + limit)}
            />
          </div>
        </CardContent>

        {/* 게시물 추가 대화상자 */}
        <PostAddDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          newPost={newPost}
          setNewPost={setNewPost}
          onSubmit={addPost}
        />

        {/* 게시물 수정 대화상자 */}
        <PostEditDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          selectedPost={selectedPost}
          setSelectedPost={setSelectedPost}
          onSubmit={updatePost}
        />

        {/* 댓글 추가 대화상자 */}
        <CommentAddDialog
          open={showAddCommentDialog}
          onOpenChange={setShowAddCommentDialog}
          newComment={newComment}
          setNewComment={setNewComment}
          onSubmit={addComment}
        />

        {/* 댓글 수정 대화상자 */}
        <CommentEditDialog
          open={showEditCommentDialog}
          onOpenChange={setShowEditCommentDialog}
          selectedComment={selectedComment}
          setSelectedComment={
            setSelectedComment as unknown as (v: { id: number; body: string } | null) => void
          }
          onSubmit={updateComment}
        />

        {/* 게시물 상세 보기 - Widget */}
        <PostDetailDialog
          open={showPostDetailDialog}
          onOpenChange={setShowPostDetailDialog}
          selectedPost={selectedPost}
          searchQuery={searchQuery}
          highlightText={highlightText}
          renderComments={renderComments}
        />

        {/* 사용자 모달 - Widget */}
        <UserModal open={showUserModal} onOpenChange={setShowUserModal} user={selectedUser} />
      </Card>
    </main>
  );
};

export default PostsManager;
