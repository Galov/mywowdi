'use client'

import type { ContentLocale } from '@/i18n/config'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getLocalizedHref } from '@/i18n/routing'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useCallback, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  password: string
  passwordConfirm: string
}

type Copy = {
  backToLogin: string
  buttonIdle: string
  buttonLoading: string
  confirmLabel: string
  errorMissingToken: string
  errorSubmit: string
  intro: string
  passwordLabel: string
  success: string
  title: string
}

const copyByLocale: Record<ContentLocale, Copy> = {
  bg: {
    backToLogin: 'Обратно към вход',
    buttonIdle: 'Запази новата парола',
    buttonLoading: 'Изпращане',
    confirmLabel: 'Потвърди новата парола',
    errorMissingToken: 'Линкът за смяна на паролата е невалиден или непълен.',
    errorSubmit: 'Не успяхме да сменим паролата. Моля, опитайте отново.',
    intro: 'Въведете нова парола за вашия профил. След успешно запазване ще можете да влезете с нея.',
    passwordLabel: 'Нова парола',
    success: 'Паролата беше сменена успешно. Вече можете да влезете с новата си парола.',
    title: 'Смяна на парола',
  },
  de: {
    backToLogin: 'Zuruck zum Login',
    buttonIdle: 'Neues Passwort speichern',
    buttonLoading: 'Wird gesendet',
    confirmLabel: 'Neues Passwort bestatigen',
    errorMissingToken: 'Der Link zum Zurucksetzen des Passworts ist unvollstandig oder ungunstig.',
    errorSubmit: 'Das Passwort konnte nicht geandert werden. Bitte versuchen Sie es erneut.',
    intro: 'Geben Sie ein neues Passwort fur Ihr Konto ein. Danach konnen Sie sich damit anmelden.',
    passwordLabel: 'Neues Passwort',
    success: 'Das Passwort wurde erfolgreich geandert. Sie konnen sich jetzt anmelden.',
    title: 'Passwort zurucksetzen',
  },
  en: {
    backToLogin: 'Back to login',
    buttonIdle: 'Save new password',
    buttonLoading: 'Submitting',
    confirmLabel: 'Confirm new password',
    errorMissingToken: 'This password reset link is invalid or incomplete.',
    errorSubmit: 'We could not reset your password. Please try again.',
    intro: 'Enter a new password for your account. Once saved, you will be able to sign in with it.',
    passwordLabel: 'New password',
    success: 'Your password was changed successfully. You can now sign in with your new password.',
    title: 'Reset password',
  },
  es: {
    backToLogin: 'Volver al acceso',
    buttonIdle: 'Guardar nueva contrasena',
    buttonLoading: 'Enviando',
    confirmLabel: 'Confirmar nueva contrasena',
    errorMissingToken: 'Este enlace para restablecer la contrasena no es valido o esta incompleto.',
    errorSubmit: 'No pudimos restablecer su contrasena. Intentelo de nuevo.',
    intro: 'Introduzca una nueva contrasena para su cuenta. Despues podra acceder con ella.',
    passwordLabel: 'Nueva contrasena',
    success: 'La contrasena se cambio correctamente. Ya puede iniciar sesion con la nueva contrasena.',
    title: 'Restablecer contrasena',
  },
  fr: {
    backToLogin: 'Retour a la connexion',
    buttonIdle: 'Enregistrer le nouveau mot de passe',
    buttonLoading: 'Envoi',
    confirmLabel: 'Confirmez le nouveau mot de passe',
    errorMissingToken: 'Ce lien de reinitialisation est invalide ou incomplet.',
    errorSubmit: "Nous n'avons pas pu reinitialiser votre mot de passe. Veuillez reessayer.",
    intro: 'Saisissez un nouveau mot de passe pour votre compte. Vous pourrez ensuite vous connecter avec celui-ci.',
    passwordLabel: 'Nouveau mot de passe',
    success: 'Le mot de passe a ete modifie avec succes. Vous pouvez maintenant vous connecter.',
    title: 'Reinitialiser le mot de passe',
  },
  it: {
    backToLogin: 'Torna al login',
    buttonIdle: 'Salva la nuova password',
    buttonLoading: 'Invio',
    confirmLabel: 'Conferma la nuova password',
    errorMissingToken: 'Il link per reimpostare la password non e valido o e incompleto.',
    errorSubmit: 'Non siamo riusciti a reimpostare la password. Riprova.',
    intro: 'Inserisca una nuova password per il suo account. Dopo il salvataggio potra accedere con essa.',
    passwordLabel: 'Nuova password',
    success: 'La password e stata cambiata con successo. Ora puo accedere con la nuova password.',
    title: 'Reimposta la password',
  },
}

export const ResetPasswordForm: React.FC<{
  locale: ContentLocale
  token?: string
}> = ({ locale, token }) => {
  const copy = copyByLocale[locale]
  const { resetPassword } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<null | string>(null)
  const [success, setSuccess] = useState(false)

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    watch,
  } = useForm<FormData>()

  const password = useRef('')
  password.current = watch('password', '')

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (!token) {
        setError(copy.errorMissingToken)
        return
      }

      try {
        await resetPassword({
          password: data.password,
          passwordConfirm: data.passwordConfirm,
          token,
        })

        setError(null)
        setSuccess(true)

        window.setTimeout(() => {
          router.push(getLocalizedHref(locale, '/login') || '/login')
        }, 1200)
      } catch {
        setError(copy.errorSubmit)
      }
    },
    [copy.errorMissingToken, copy.errorSubmit, locale, resetPassword, router, token],
  )

  return (
    <div className="max-w-xl mx-auto my-12">
      <h1 className="mb-4 text-[1.8rem]">{copy.title}</h1>
      <p className="mb-8 text-primary/75">{copy.intro}</p>

      <Message error={error || undefined} success={success ? copy.success : undefined} />

      {!success && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-8 mb-8">
            <FormItem>
              <Label htmlFor="password">{copy.passwordLabel}</Label>
              <Input
                id="password"
                type="password"
                {...register('password', { required: copy.passwordLabel })}
              />
              {errors.password && <FormError message={errors.password.message} />}
            </FormItem>

            <FormItem>
              <Label htmlFor="passwordConfirm">{copy.confirmLabel}</Label>
              <Input
                id="passwordConfirm"
                type="password"
                {...register('passwordConfirm', {
                  required: copy.confirmLabel,
                  validate: (value) =>
                    value === password.current || copy.confirmLabel,
                })}
              />
              {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
            </FormItem>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <Button disabled={isSubmitting} size="lg" type="submit">
              {isSubmitting ? copy.buttonLoading : copy.buttonIdle}
            </Button>

            <Link
              className="text-sm uppercase tracking-[0.22em] text-primary/65 hover:text-primary"
              href={getLocalizedHref(locale, '/login') || '/login'}
            >
              {copy.backToLogin}
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}
