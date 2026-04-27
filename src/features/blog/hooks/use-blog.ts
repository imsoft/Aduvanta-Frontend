import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchPublishedPosts,
  fetchPostBySlug,
  fetchAllPostsAdmin,
  fetchPostByIdAdmin,
  createPost,
  updatePost,
  deletePost,
  uploadCoverImage,
  translatePost,
  type CreateBlogPostPayload,
  type UpdateBlogPostPayload,
  type TranslatePostPayload,
} from '../api/blog.api';

export function usePublishedPosts(page: number, limit: number) {
  return useQuery({
    queryKey: ['blog', 'published', page, limit],
    queryFn: () => fetchPublishedPosts(page, limit),
    staleTime: 1000 * 60 * 5,
  });
}

export function usePostBySlug(slug: string) {
  return useQuery({
    queryKey: ['blog', 'post', slug],
    queryFn: () => fetchPostBySlug(slug),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(slug),
  });
}

export function useAllPostsAdmin(
  page: number,
  limit: number,
  status?: 'DRAFT' | 'PUBLISHED',
) {
  return useQuery({
    queryKey: ['blog', 'admin', 'all', page, limit, status],
    queryFn: () => fetchAllPostsAdmin(page, limit, status),
    staleTime: 1000 * 30,
  });
}

export function useAdminPost(id: string) {
  return useQuery({
    queryKey: ['blog', 'admin', 'post', id],
    queryFn: () => fetchPostByIdAdmin(id),
    staleTime: 1000 * 30,
    enabled: Boolean(id),
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBlogPostPayload) => createPost(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['blog'] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBlogPostPayload }) =>
      updatePost(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['blog'] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['blog'] });
    },
  });
}

export function useUploadCoverImage() {
  return useMutation({
    mutationFn: (file: File) => uploadCoverImage(file),
  });
}

export function useTranslatePost() {
  return useMutation({
    mutationFn: (payload: TranslatePostPayload) => translatePost(payload),
  });
}
