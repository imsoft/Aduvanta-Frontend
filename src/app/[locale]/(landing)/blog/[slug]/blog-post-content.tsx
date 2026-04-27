'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CalendarBlank, Clock, ArrowLeft } from '@phosphor-icons/react';
import type { BlogPost } from '@/features/blog/api/blog.api';

type Props = {
  post: BlogPost;
  locale: string;
  backLabel: string;
  readingTimeLabel: string;
  baseUrl: string;
};

function formatDate(isoDate: string, locale: string): string {
  return new Date(isoDate).toLocaleDateString(
    locale === 'es-MX' ? 'es-MX' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' },
  );
}

export function BlogPostContent({ post, locale, backLabel, readingTimeLabel, baseUrl }: Props) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <header className="mb-10">
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} />
          {backLabel}
        </Link>

        {post.coverImageUrl && (
          <div className="relative mt-4 mb-8 aspect-video w-full overflow-hidden rounded-2xl">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
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
            {readingTimeLabel}
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
