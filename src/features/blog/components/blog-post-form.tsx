'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
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
import { useUploadCoverImage, useTranslatePost } from '@/features/blog/hooks/use-blog';
import { toast } from 'sonner';
import { Image as ImageIcon, X, ArrowsLeftRight } from '@phosphor-icons/react';
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
  const locale = useLocale();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<BlogPostFormState>({
    ...EMPTY_FORM,
    ...initialValues,
  });
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(
    Boolean(initialValues?.slug),
  );

  const uploadImage = useUploadCoverImage();
  const translate = useTranslatePost();

  useEffect(() => {
    if (!slugManuallyEdited && form.title) {
      setForm((f) => ({ ...f, slug: titleToSlug(form.title) }));
    }
  }, [form.title, slugManuallyEdited]);

  const set = <K extends keyof BlogPostFormState>(
    key: K,
    value: BlogPostFormState[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error(t('invalidImageType'));
      return;
    }
    try {
      const { url } = await uploadImage.mutateAsync(file);
      set('coverImageUrl', url);
    } catch {
      toast.error(t('uploadFailed'));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleImageFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) void handleImageFile(file);
  };

  const handleTranslate = async (target: 'es' | 'en') => {
    const source = target === 'en' ? 'es' : 'en';
    try {
      const result = await translate.mutateAsync({
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        source,
        target,
      });
      setForm((f) => ({
        ...f,
        title: result.title,
        excerpt: result.excerpt,
        content: result.content,
      }));
      toast.success(t('translated'));
    } catch {
      toast.error(t('translateFailed'));
    }
  };

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

  const isTranslating = translate.isPending;
  const isUploading = uploadImage.isPending;

  // Suggest the opposite language based on user locale
  const primaryTarget = locale.startsWith('es') ? 'en' : 'es';
  const secondaryTarget = primaryTarget === 'en' ? 'es' : 'en';

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      {/* Translate toolbar */}
      <div className="flex items-center gap-2 rounded-none border bg-muted/30 px-3 py-2">
        <ArrowsLeftRight size={14} className="shrink-0 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{t('translateHint')}</span>
        <div className="ml-auto flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-2.5 text-xs"
            disabled={isTranslating || !isValid}
            onClick={() => void handleTranslate(primaryTarget)}
          >
            {isTranslating ? t('translating') : `→ ${primaryTarget.toUpperCase()}`}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-2.5 text-xs"
            disabled={isTranslating || !isValid}
            onClick={() => void handleTranslate(secondaryTarget)}
          >
            {isTranslating ? t('translating') : `→ ${secondaryTarget.toUpperCase()}`}
          </Button>
        </div>
      </div>

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
          className="w-full rounded-none border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
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

      {/* Cover image upload */}
      <div className="space-y-2">
        <Label>{t('coverImageField')}</Label>

        {form.coverImageUrl ? (
          <div className="relative w-full overflow-hidden rounded-none border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.coverImageUrl}
              alt="Cover preview"
              className="h-48 w-full object-cover"
            />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-2 top-2 h-7 w-7 rounded-full"
              onClick={() => set('coverImageUrl', '')}
            >
              <X size={13} />
            </Button>
          </div>
        ) : (
          <div
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-none border border-dashed py-10 text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-muted/20"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {isUploading ? (
              <p className="text-sm">{t('uploadingImage')}</p>
            ) : (
              <>
                <ImageIcon size={28} />
                <p className="text-sm font-medium">{t('uploadImage')}</p>
                <p className="text-xs">{t('uploadImageHint')}</p>
              </>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={handleFileInputChange}
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
