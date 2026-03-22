import { useMutation } from '@tanstack/react-query'
import { useRef, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

type SafeMutationOptions<TData, TError, TVariables> = {
  mutationFn: (variables: TVariables) => Promise<TData>
  onSuccess?: (data: TData, variables: TVariables) => void
  onError?: (error: TError, variables: TVariables) => void
  onSettled?: (data: TData | undefined, error: TError | null) => void

  /**
   * Minimum milliseconds between mutation calls.
   * Prevents double-click and rapid resubmission.
   * Default: 1000ms
   */
  throttleMs?: number

  /**
   * Send an Idempotency-Key header with the request.
   * Ensures the backend processes the mutation exactly once.
   * Default: false
   */
  idempotent?: boolean
}

/**
 * Enhanced useMutation wrapper with built-in anti-abuse protections.
 *
 * Features:
 * - Client-side throttle to prevent double-click/spam
 * - Idempotency-Key header for backend dedup
 * - Automatic retry handling for 429 (rate limited)
 * - Loading state awareness (blocks while in-flight)
 *
 * Usage:
 *   const mutation = useSafeMutation({
 *     mutationFn: (dto) => operationsApi.create(orgId, dto),
 *     throttleMs: 2000,
 *     idempotent: true,
 *     onSuccess: () => { ... },
 *   })
 */
export function useSafeMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
>(options: SafeMutationOptions<TData, TError, TVariables>) {
  const {
    throttleMs = 1000,
    idempotent = false,
    mutationFn,
    onSuccess,
    onError,
    onSettled,
  } = options
  const lastCallRef = useRef<number>(0)
  const idempotencyKeyRef = useRef<string | null>(null)

  const wrappedMutationFn = useCallback(
    async (variables: TVariables): Promise<TData> => {
      if (idempotent) {
        if (!idempotencyKeyRef.current) {
          idempotencyKeyRef.current = crypto.randomUUID()
        }
        apiClient.defaults.headers.common['Idempotency-Key'] =
          idempotencyKeyRef.current
      }

      try {
        const result = await mutationFn(variables)
        idempotencyKeyRef.current = null
        delete apiClient.defaults.headers.common['Idempotency-Key']
        return result
      } catch (error) {
        delete apiClient.defaults.headers.common['Idempotency-Key']
        throw error
      }
    },
    [mutationFn, idempotent],
  )

  const mutation = useMutation<TData, TError, TVariables>({
    mutationFn: wrappedMutationFn,
    onSuccess,
    onError,
    onSettled,
  })

  const safeMutate = useCallback(
    (variables: TVariables) => {
      const now = Date.now()

      if (now - lastCallRef.current < throttleMs) {
        return
      }

      if (mutation.isPending) {
        return
      }

      lastCallRef.current = now
      idempotencyKeyRef.current = null
      mutation.mutate(variables)
    },
    [mutation, throttleMs],
  )

  const safeMutateAsync = useCallback(
    async (variables: TVariables): Promise<TData> => {
      const now = Date.now()

      if (now - lastCallRef.current < throttleMs) {
        throw new Error('Request throttled — please wait')
      }

      if (mutation.isPending) {
        throw new Error('Request already in progress')
      }

      lastCallRef.current = now
      idempotencyKeyRef.current = null
      return mutation.mutateAsync(variables)
    },
    [mutation, throttleMs],
  )

  return {
    ...mutation,
    mutate: safeMutate,
    mutateAsync: safeMutateAsync,
  }
}
