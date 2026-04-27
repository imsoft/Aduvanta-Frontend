'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useRouter } from '@/i18n/navigation';
import { useAllPostsAdmin, useDeletePost } from '@/features/blog/hooks/use-blog';
import type { BlogPost } from '@/features/blog/api/blog.api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, PencilSimple, Trash, Article } from '@phosphor-icons/react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const PAGE_LIMIT = 10;

function StatusBadge({ status }: { status: BlogPost['status'] }) {
  const t = useTranslations('blog.admin');
  if (status === 'PUBLISHED') {
    return (
      <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
        {t('published')}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-muted-foreground">
      {t('draft')}
    </Badge>
  );
}

export default function AdminBlogPage() {
  const t = useTranslations('blog.admin');
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAllPostsAdmin(page, PAGE_LIMIT);
  const deletePost = useDeletePost();

  const posts = data?.posts ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_LIMIT);

  const handleDelete = async (id: string) => {
    await deletePost.mutateAsync(id);
    toast.success(t('postDeleted'));
  };

  return (
    <div className="w-full space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
            <Badge variant="destructive" className="text-[10px]">Super Admin</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('description')}
          </p>
        </div>

        <Button size="sm" asChild>
          <Link href="/dashboard/admin/blog/new">
            <Plus size={14} className="mr-1.5" />
            {t('newPost')}
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl border bg-muted/20 animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <Article size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">{t('emptyTitle')}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('emptyDescription')}
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('colTitle')}</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('colStatus')}</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('colAuthor')}</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('colDate')}</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">{t('colActions')}</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium line-clamp-1">{post.title}</p>
                        <p className="text-xs text-muted-foreground">{post.slug}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={post.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{post.authorName}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {format(new Date(post.createdAt), 'dd MMM yyyy')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          asChild
                        >
                          <Link href={`/dashboard/admin/blog/${post.id}/edit`}>
                            <PencilSimple size={13} />
                          </Link>
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                            >
                              <Trash size={13} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('deletePost')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('confirmDelete')}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => handleDelete(post.id)}
                              >
                                {t('delete')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {t('postsTotal', { total })}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  {t('previous')}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  {t('next')}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
