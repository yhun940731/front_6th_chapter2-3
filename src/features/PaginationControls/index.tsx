import * as SelectPrimitive from '@radix-ui/react-select';
import React from 'react';

import { Button, SelectContent, SelectItem, SelectTrigger } from '../../shared/ui';

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export type PaginationControlsProps = {
  limit: number;
  skip: number;
  total: number;
  onLimitChange: (limit: number) => void;
  onPrev: () => void;
  onNext: () => void;
};

const PaginationControls: React.FC<PaginationControlsProps> = ({
  limit,
  skip,
  total,
  onLimitChange,
  onPrev,
  onNext,
}) => {
  return (
    <div className='flex justify-between items-center'>
      <div className='flex items-center gap-2'>
        <span>표시</span>
        <Select
          value={limit.toString()}
          onValueChange={(value: string) => onLimitChange(Number(value))}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='10' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='10'>10</SelectItem>
            <SelectItem value='20'>20</SelectItem>
            <SelectItem value='30'>30</SelectItem>
          </SelectContent>
        </Select>
        <span>항목</span>
      </div>
      <div className='flex gap-2'>
        <Button disabled={skip === 0} onClick={onPrev}>
          이전
        </Button>
        <Button disabled={skip + limit >= total} onClick={onNext}>
          다음
        </Button>
      </div>
    </div>
  );
};

export default PaginationControls;
