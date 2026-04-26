'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { usePublishedPosts } from '@/features/blog/hooks/use-blog';
import { Reveal } from '@/components/ui/reveal';
import { StaticPageHero } from '@/components/landing/static-page-hero';
import { Button } from '@/components/ui/button';
import { CalendarBlank, Clock, ArrowRight } from '@phosphor-icons/react';

function formatDate(isoDate: string, locale: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString(locale === 'es-MX' ? 'es-MX' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const PAGE_LIMIT = 9;

export default function BlogIndexPage() {
  const locale = useLocale();
  const t = useTranslations('blog');
  const [page, setPage] = useState(1);

  const { data, isLoading } = usePublishedPosts(page, PAGE_LIMIT);

  const posts = data?.posts ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_LIMIT);

  return (
    <>
      <StaticPageHero
        title={t('title')}
        subtitle={t('subtitle')}
        width="md"
        align="left"
      />

      <section className="mx-auto max-w-5xl px-6 pb-20">
        {isLoading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-2xl border border-border/50 bg-muted/20 animate-pulse"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-16 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              {t('noPosts')}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={60 * i} className="h-full">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                  >
                    {post.coverImageUrl && (
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={post.coverImageUrl}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {t('readingTime', { minutes: post.readingTimeMinutes })}
                        </span>
                        {post.publishedAt && (
                          <span className="flex items-center gap-1">
                            <CalendarBlank size={12} />
                            {formatDate(post.publishedAt, locale)}
                          </span>
                        )}
                      </div>

                      <h2 className="mt-3 text-lg font-semibold transition-colors group-hover:text-primary line-clamp-2">
                        {post.title}
                      </h2>

                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {t('by')} {post.authorName}
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-transform group-hover:translate-x-0.5">
                          {t('readMore')} <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
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
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
