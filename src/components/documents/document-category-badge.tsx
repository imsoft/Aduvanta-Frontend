import { Badge } from '@/components/ui/badge';
import type { DocumentCategory } from '@/features/document-categories/types/document-category.types';

interface DocumentCategoryBadgeProps {
  category: Pick<DocumentCategory, 'name' | 'code'> | null | undefined;
}

export function DocumentCategoryBadge({ category }: DocumentCategoryBadgeProps) {
  if (!category) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  return (
    <Badge variant="outline" className="font-mono text-xs">
      {category.code}
    </Badge>
  );
}
