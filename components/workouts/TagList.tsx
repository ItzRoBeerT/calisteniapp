import React from 'react';

type TagListProps = {
  tags: string[];
}

export default function TagList({ tags }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span 
          key={tag}
          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}