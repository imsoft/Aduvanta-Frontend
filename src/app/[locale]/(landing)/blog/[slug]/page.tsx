'use client';

import { use } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { usePostBySlug } from '@/features/blog/hooks/use-blog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CalendarBlank, Clock, ArrowLeft } from '@phosphor-icons/react';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

function formatDate(isoDate: string, locale: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString(locale === 'es-MX' ? 'es-MX' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogPostPage({ params }: Props) {
  const { slug } = use(params);
  const locale = useLocale();
  const t = useTranslations('blog');

  const { data: post, isLoading, isError } = usePostBySlug(slug);

  if (isLoading) {
    return (
      <article className="mx-auto max-w-3xl px-6 py-20">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 w-3/4 rounded bg-muted" />
          <div className="h-4 w-1/2 rounded bg-muted" />
          <div className="mt-8 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 rounded bg-muted" />
            ))}
          </div>
        </div>
      </article>
    );
  }

  if (isError || !post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <header className="mb-10">
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} />
          {t('backToBlog')}
        </Link>

        {post.coverImageUrl && (
          <div className="mt-4 mb-8 aspect-video w-full overflow-hidden rounded-2xl">
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{post.authorName}</span>
          {post.publishedAt && (
            <span className="flex items-center gap-1.5">
              <CalendarBlank size={14} />
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt, locale)}
              </time>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {t('readingTime', { minutes: post.readingTimeMinutes })}
          </span>
        </div>
      </header>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
