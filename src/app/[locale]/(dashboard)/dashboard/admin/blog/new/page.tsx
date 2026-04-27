'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useCreatePost } from '@/features/blog/hooks/use-blog';
import { BlogPostForm } from '@/features/blog/components/blog-post-form';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from '@phosphor-icons/react';
import { Link } from '@/i18n/navigation';
import { toast } from 'sonner';
import type { CreateBlogPostPayload } from '@/features/blog/api/blog.api';

export default function NewBlogPostPage() {
  const t = useTranslations('blog.admin');
  const router = useRouter();
  const createPost = useCreatePost();

  const handleSubmit = async (payload: CreateBlogPostPayload) => {
    await createPost.mutateAsync(payload);
    toast.success(t('postCreated'));
    router.push('/dashboard/admin/blog');
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <Link
          href="/dashboard/admin/blog"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} />
          {t('backToBlog')}
        </Link>

        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{t('newPost')}</h1>
          <Badge variant="destructive" className="text-[10px]">Super Admin</Badge>
        </div>
      </div>

      <BlogPostForm onSubmit={handleSubmit} isPending={createPost.isPending} />
    </div>
  );
}
