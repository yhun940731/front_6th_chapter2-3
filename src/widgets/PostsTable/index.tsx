import { MessageSquare, Edit2, Trash2, ThumbsDown, ThumbsUp } from 'lucide-react';
import React from 'react';

import {
  Button,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../../shared/ui';

type Props = {
  posts: any[];
  searchQuery: string;
  selectedTag: string;
  onTagClick: (tag: string) => void;
  onOpenPostDetail: (post: any) => void;
  onEditPost: (post: any) => void;
  onDeletePost: (id: number) => void;
  highlightText: (text: string, highlight: string) => React.ReactNode;
  onAuthorClick: (user: any) => void;
};

const PostsTable: React.FC<Props> = ({
  posts,
  searchQuery,
  selectedTag,
  onTagClick,
  onOpenPostDetail,
  onEditPost,
  onDeletePost,
  highlightText,
  onAuthorClick,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[50px]'>ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className='w-[150px]'>작성자</TableHead>
          <TableHead className='w-[150px]'>반응</TableHead>
          <TableHead className='w-[150px]'>작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className='space-y-1'>
                <div>{highlightText(post.title, searchQuery)}</div>
                <div className='flex flex-wrap gap-1'>
                  {post.tags?.map((tag: any) => (
                    <span
                      key={tag}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        selectedTag === tag
                          ? 'text-white bg-blue-500 hover:bg-blue-600'
                          : 'text-blue-800 bg-blue-100 hover:bg-blue-200'
                      }`}
                      onClick={() => onTagClick(tag)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div
                className='flex items-center space-x-2 cursor-pointer'
                onClick={() => post.author && onAuthorClick(post.author)}
              >
                <img
                  src={post.author?.image}
                  alt={post.author?.username}
                  className='w-8 h-8 rounded-full'
                />
                <span>{post.author?.username}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex items-center gap-2'>
                <ThumbsUp className='w-4 h-4' />
                <span>{post.reactions?.likes || 0}</span>
                <ThumbsDown className='w-4 h-4' />
                <span>{post.reactions?.dislikes || 0}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex items-center gap-2'>
                <Button variant='ghost' size='sm' onClick={() => onOpenPostDetail(post)}>
                  <MessageSquare className='w-4 h-4' />
                </Button>
                <Button variant='ghost' size='sm' onClick={() => onEditPost(post)}>
                  <Edit2 className='w-4 h-4' />
                </Button>
                <Button variant='ghost' size='sm' onClick={() => onDeletePost(post.id)}>
                  <Trash2 className='w-4 h-4' />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PostsTable;
