'use client'

import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { Button } from '@/components/ui/button'
import {
  buildCreateOperationCommentSchema,
  type CreateOperationCommentFormData,
} from '@/features/operation-comments/schemas/operation-comment.schemas'

interface AddOperationCommentFormProps {
  onSubmit: (data: CreateOperationCommentFormData) => void
  isPending: boolean
}

export function AddOperationCommentForm({
  onSubmit,
  isPending,
}: AddOperationCommentFormProps) {
  const t = useTranslations('clients')
  const tv = useTranslations('validation')

  const schema = useMemo(
    () => buildCreateOperationCommentSchema((k) => tv(k)),
    [tv],
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateOperationCommentFormData>({
    resolver: standardSchemaResolver(schema),
  })

  const submit = (data: CreateOperationCommentFormData) => {
    onSubmit(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-2">
      <textarea
        rows={3}
        className="w-full rounded-none border bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        {...register('body')}
      />
      {errors.body && (
        <p className="text-xs text-destructive">{errors.body.message}</p>
      )}
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? t('posting') : t('postComment')}
        </Button>
      </div>
    </form>
  )
}
