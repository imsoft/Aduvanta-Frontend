'use client';

import { use } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/i18n/navigation';
import { useUpdatePost } from '@/features/blog/hooks/use-blog';
import { BlogPostForm } from '@/features/blog/components/blog-post-form';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from '@phosphor-icons/react';
import { toast } from 'sonner';
import type { UpdateBlogPostPayload } from '@/features/blog/api/blog.api';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { BlogPost } from '@/features/blog/api/blog.api';

type Props = {
  params: Promise<{ id: string }>;
};

function useAdminPost(id: string) {
  return useQuery({
    queryKey: ['blog', 'admin', 'post', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/blog/admin/posts?page=1&limit=100`);
      const list = data as { posts: BlogPost[]; total: number };
      return list.posts.find((p) => p.id === id) ?? null;
    },
    staleTime: 1000 * 30,
    enabled: Boolean(id),
  });
}

export default function EditBlogPostPage({ params }: Props) {
  const { id } = use(params);
  const t = useTranslations('blog.admin');
  const router = useRouter();
  const updatePost = useUpdatePost();
  const { data: post, isLoading } = useAdminPost(id);

  const handleSubmit = async (payload: UpdateBlogPostPayload) => {
    await updatePost.mutateAsync({ id, payload });
    toast.success(t('postUpdated'));
    router.push('/dashboard/admin/blog');
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-4 animate-pulse">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="h-96 rounded-xl bg-muted" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full text-center py-20">
        <p className="text-sm text-muted-foreground">Post not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <Link
          href="/dashboard/admin/blog"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Back to blog
        </Link>

        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{t('editPost')}</h1>
          <Badge variant="destructive" className="text-[10px]">Super Admin</Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{post.title}</p>
      </div>

      <BlogPostForm
        initialValues={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImageUrl: post.coverImageUrl ?? '',
          status: post.status,
        }}
        onSubmit={handleSubmit}
        isPending={updatePost.isPending}
      />
    </div>
  );
}
