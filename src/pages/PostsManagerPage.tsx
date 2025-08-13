import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// entities hooks
import { usePostsState, usePostActions } from '../entities/post/model/hooks';
import PaginationControls from '../features/PaginationControls';
import PostsControls from '../features/PostsControls';
import { Card, CardContent } from '../shared/ui';
import CommentAddDialog from '../widgets/CommentAddDialog';
import CommentEditDialog from '../widgets/CommentEditDialog';
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

  // 상태/액션 훅 (Jotai 래핑)
  const {
    skip,
    setSkip,
    limit,
    setLimit,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedTag,
    setSelectedTag,
    loading,
  } = usePostsState();
  const {
    fetchTags: doFetchTags,
    fetchPosts: doFetchPosts,
    fetchPostsByTag: doFetchPostsByTag,
  } = usePostActions();

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

  // 태그별 게시물 가져오기
  const fetchPostsByTag = (tag: string) => doFetchPostsByTag(tag);

  // 댓글/상세/사용자 모달 등은 각 위젯 내부에서 처리

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

  // FSD 위젯/피처 콜백은 각 컴포넌트 내부에서 처리
  // 댓글 렌더링은 PostDetailDialog 내부로 이전됨

  return (
    <main className='flex-grow container mx-auto px-4 py-8'>
      <Card className='w-full max-w-6xl mx-auto'>
        <PostsHeader title='게시물 관리자' />

        <CardContent>
          <div className='flex flex-col gap-4'>
            {/* 검색 및 필터 컨트롤 - Feature */}
            <PostsControls />

            {/* 게시물 테이블 - Widget */}
            {loading ? <div className='flex justify-center p-4'>로딩 중...</div> : <PostsTable />}

            {/* 페이지네이션 - Feature */}
            <PaginationControls />
          </div>
        </CardContent>

        {/* 게시물 추가 대화상자 */}
        <PostAddDialog />

        {/* 게시물 수정 대화상자 */}
        <PostEditDialog />

        {/* 댓글 추가 대화상자 */}
        <CommentAddDialog />

        {/* 댓글 수정 대화상자 */}
        <CommentEditDialog />

        {/* 게시물 상세 보기 - Widget */}
        <PostDetailDialog />

        {/* 사용자 모달 - Widget */}
        <UserModal />
      </Card>
    </main>
  );
};

export default PostsManager;
