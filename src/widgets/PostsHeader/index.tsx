import { Plus } from 'lucide-react';
import React from 'react';

import { Button, CardHeader, CardTitle } from '../../shared/ui';

type Props = {
  title: string;
  onAddClick: () => void;
};

const PostsHeader: React.FC<Props> = ({ title, onAddClick }) => (
  <CardHeader>
    <CardTitle className='flex items-center justify-between'>
      <span>{title}</span>
      <Button onClick={onAddClick}>
        <Plus className='w-4 h-4 mr-2' />
        게시물 추가
      </Button>
    </CardTitle>
  </CardHeader>
);

export default PostsHeader;
