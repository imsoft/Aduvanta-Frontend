'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { GoogleIcon } from '@/components/ui/icons/google-icon';
import { signIn } from '@/lib/auth-client';

const isGoogleEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === 'true'

const createSignInSchema = (t: (k: string) => string) =>
  z.object({
    email: z.string().email(t('validation.invalidEmail')),
    password: z.string().min(1, t('validation.passwordRequired')),
  })

type SignInFormData = z.infer<ReturnType<typeof createSignInSchema>>

export default function SignInPage() {
  const t = useTranslations()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const schema = createSignInSchema((k) => t(k))

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({ resolver: standardSchemaResolver(schema) })

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        toast.error(result.error.message ?? t('toast.signInFailed'))
        return;
      }

      router.push('/dashboard');
    } catch {
      toast.error(t('toast.unexpectedError'))
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: `${window.location.origin}/dashboard`,
      });
    } catch {
      toast.error(t('toast.unexpectedError'))
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-1">
        <div className="mb-2 text-sm font-semibold tracking-widest text-primary uppercase">
          Aduvanta
        </div>
        <CardTitle className="text-2xl">{t('auth.signIn')}</CardTitle>
        <CardDescription>
          {t('auth.enterCredentials')}
        </CardDescription>
      </CardHeader>

      {isGoogleEnabled && (
        <CardContent className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isGoogleLoading}
            onClick={handleGoogleSignIn}
          >
            <GoogleIcon className="mr-2 h-4 w-4" />
            {isGoogleLoading ? t('auth.signingIn') : t('auth.continueWithGoogle')}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                {t('auth.orContinueWith')}
              </span>
            </div>
          </div>
        </CardContent>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pt-0">
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              ariaLabelShow={t('auth.showPassword')}
              ariaLabelHide={t('auth.hidePassword')}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 border-t-0">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('auth.signingIn') : t('auth.signIn')}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            {t('auth.dontHaveAccount')}{' '}
            <Link href="/sign-up" className="text-foreground underline-offset-4 hover:underline">
              {t('auth.signUp')}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
