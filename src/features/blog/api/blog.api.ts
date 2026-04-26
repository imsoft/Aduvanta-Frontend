import axios from 'axios';
import { apiClient } from '@/lib/api-client';

const publicApiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  status: 'DRAFT' | 'PUBLISHED';
  authorId: string;
  authorName: string;
  readingTimeMinutes: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogListResponse {
  posts: BlogPost[];
  total: number;
}

export interface CreateBlogPostPayload {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  status: 'DRAFT' | 'PUBLISHED';
}

export interface UpdateBlogPostPayload {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImageUrl?: string;
  status?: 'DRAFT' | 'PUBLISHED';
}

// Public API — no auth required, use a plain axios instance
const publicClient = axios.create({
  baseURL: publicApiBaseUrl,
});

export async function fetchPublishedPosts(
  page: number,
  limit: number,
): Promise<BlogListResponse> {
  const { data } = await publicClient.get('/blog/posts', {
    params: { page, limit },
  });
  return data as BlogListResponse;
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost> {
  const { data } = await publicClient.get(`/blog/posts/${slug}`);
  return data as BlogPost;
}

// Admin API — requires system admin session
export async function fetchAllPostsAdmin(
  page: number,
  limit: number,
  status?: 'DRAFT' | 'PUBLISHED',
): Promise<BlogListResponse> {
  const { data } = await apiClient.get('/blog/admin/posts', {
    params: { page, limit, ...(status ? { status } : {}) },
  });
  return data as BlogListResponse;
}

export async function createPost(
  payload: CreateBlogPostPayload,
): Promise<BlogPost> {
  const { data } = await apiClient.post('/blog/admin/posts', payload);
  return data as BlogPost;
}

export async function updatePost(
  id: string,
  payload: UpdateBlogPostPayload,
): Promise<BlogPost> {
  const { data } = await apiClient.patch(`/blog/admin/posts/${id}`, payload);
  return data as BlogPost;
}

export async function deletePost(id: string): Promise<void> {
  await apiClient.delete(`/blog/admin/posts/${id}`);
}
