import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { BASE_URL } from '@/lib/seo';
import { BlogPostContent } from './blog-post-content';
import type { BlogPost } from '@/features/blog/api/blog.api';

type Props = { params: Promise<{ locale: string; slug: string }> };

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_BASE}/blog/posts/${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<BlogPost>;
  } catch {
    return null;
  }
}

async function getAllSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE}/blog/posts?page=1&limit=200`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { posts: Array<{ slug: string }> };
    return (data.posts ?? []).map((p) => p.slug);
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  const locales = ['es-MX', 'en-US'];
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPost(slug);

  if (!post) return { title: 'Post not found' };

  const url = `${BASE_URL}/${locale}/blog/${slug}`;
  const ogImage = post.coverImageUrl ?? `${BASE_URL}/og-image.png`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: url,
      languages: {
        'en-US': `${BASE_URL}/en-US/blog/${slug}`,
        'es-MX': `${BASE_URL}/es-MX/blog/${slug}`,
        'x-default': `${BASE_URL}/en-US/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: 'article',
      siteName: 'Aduvanta',
      locale: locale === 'es-MX' ? 'es_MX' : 'en_US',
      alternateLocale: locale === 'es-MX' ? 'en_US' : 'es_MX',
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: [post.authorName],
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const [post, t] = await Promise.all([
    getPost(slug),
    getTranslations({ locale, namespace: 'blog' }),
  ]);

  if (!post) notFound();

  const url = `${BASE_URL}/${locale}/blog/${slug}`;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImageUrl ?? `${BASE_URL}/og-image.png`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: locale,
    url,
    author: { '@type': 'Person', name: post.authorName },
    publisher: {
      '@type': 'Organization',
      name: 'Aduvanta',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/brand/aduvanta-logo.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Aduvanta', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/${locale}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BlogPostContent
        post={post}
        locale={locale}
        backLabel={t('backToBlog')}
        readingTimeLabel={t('readingTime', { minutes: post.readingTimeMinutes })}
        baseUrl={BASE_URL}
      />
    </>
  );
}
