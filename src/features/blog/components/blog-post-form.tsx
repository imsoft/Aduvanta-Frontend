'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CreateBlogPostPayload } from '@/features/blog/api/blog.api';

type BlogPostFormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  status: 'DRAFT' | 'PUBLISHED';
};

type Props = {
  initialValues?: Partial<BlogPostFormState>;
  onSubmit: (payload: CreateBlogPostPayload) => Promise<void>;
  isPending: boolean;
};

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const EMPTY_FORM: BlogPostFormState = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImageUrl: '',
  status: 'DRAFT',
};

export function BlogPostForm({ initialValues, onSubmit, isPending }: Props) {
  const t = useTranslations('blog.admin');
  const [form, setForm] = useState<BlogPostFormState>({
    ...EMPTY_FORM,
    ...initialValues,
  });
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(
    Boolean(initialValues?.slug),
  );

  useEffect(() => {
    if (!slugManuallyEdited && form.title) {
      setForm((f) => ({ ...f, slug: titleToSlug(form.title) }));
    }
  }, [form.title, slugManuallyEdited]);

  const set = <K extends keyof BlogPostFormState>(
    key: K,
    value: BlogPostFormState[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      status: form.status,
      ...(form.coverImageUrl ? { coverImageUrl: form.coverImageUrl } : {}),
    });
  };

  const isValid =
    form.title.length >= 3 &&
    form.slug.length > 0 &&
    form.excerpt.length > 0 &&
    form.content.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      <div className="space-y-2">
        <Label htmlFor="title">{t('titleField')}</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder={t('titlePlaceholder')}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">{t('slugField')}</Label>
        <Input
          id="slug"
          value={form.slug}
          onChange={(e) => {
            setSlugManuallyEdited(true);
            set('slug', e.target.value);
          }}
          placeholder="your-post-slug"
          pattern="^[a-z0-9-]+$"
          required
        />
        <p className="text-xs text-muted-foreground">{t('slugHint')}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">{t('excerptField')}</Label>
        <textarea
          id="excerpt"
          value={form.excerpt}
          onChange={(e) => set('excerpt', e.target.value)}
          placeholder={t('excerptPlaceholder')}
          rows={2}
          required
          className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      <div className="space-y-2">
        <Label>{t('contentField')}</Label>
        <RichTextEditor
          value={form.content}
          onChange={(markdown) => set('content', markdown)}
          placeholder={t('contentPlaceholder')}
          minHeight={420}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverImageUrl">{t('coverImageField')}</Label>
        <Input
          id="coverImageUrl"
          type="url"
          value={form.coverImageUrl}
          onChange={(e) => set('coverImageUrl', e.target.value)}
          placeholder={t('coverImagePlaceholder')}
        />
      </div>

      <div className="space-y-2">
        <Label>{t('statusField')}</Label>
        <Select
          value={form.status}
          onValueChange={(v) => set('status', v as BlogPostFormState['status'])}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DRAFT">{t('draft')}</SelectItem>
            <SelectItem value="PUBLISHED">{t('published')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={!isValid || isPending}>
          {isPending ? t('saving') : t('save')}
        </Button>
      </div>
    </form>
  );
}
