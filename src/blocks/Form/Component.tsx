'use client'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import type { ContentLocale } from '@/i18n/config'

import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { RichText } from '@/components/RichText'
import { Button } from '@/components/ui/button'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { buildInitialFormState } from './buildInitialFormState'
import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'
import { DefaultDocumentIDType } from 'payload'

export type Value = unknown

export interface Property {
  [key: string]: Value
}

export interface Data {
  [key: string]: Property | Property[]
}

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType | string
  introContent?: SerializedEditorState
  locale?: ContentLocale
}

export const FormBlock: React.FC<
  FormBlockType & {
    id?: DefaultDocumentIDType
  }
> = (props) => {
  const {
    enableIntro,
    form: formFromProps,
    introContent,
    locale,
  } = props

  const initialForm =
    formFromProps && typeof formFromProps === 'object' ? (formFromProps as FormType) : null
  const [resolvedForm, setResolvedForm] = useState<FormType | null>(initialForm)
  const [isFormLoading, setIsFormLoading] = useState(false)

  const formID =
    typeof formFromProps === 'string'
      ? formFromProps
      : resolvedForm?.id || (typeof formFromProps === 'object' ? formFromProps.id : undefined)

  const confirmationMessage = resolvedForm?.confirmationMessage
  const confirmationType = resolvedForm?.confirmationType
  const redirect = resolvedForm?.redirect
  const submitButtonLabel = resolvedForm?.submitButtonLabel
  const formFields = useMemo(() => resolvedForm?.fields ?? [], [resolvedForm?.fields])
  const initialValues = useMemo(() => buildInitialFormState(formFields), [formFields])
  const resetSignature = useMemo(() => {
    if (!resolvedForm?.id) return null

    return JSON.stringify({
      fields: formFields.map((field) => ({
        blockType: field.blockType,
        defaultValue: 'defaultValue' in field ? field.defaultValue : undefined,
        name: 'name' in field ? field.name : undefined,
      })),
      id: resolvedForm.id,
    })
  }, [formFields, resolvedForm?.id])
  const lastResetSignature = useRef<string | null>(null)

  const formMethods = useForm({
    defaultValues: initialValues,
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const shouldFetchForm = useMemo(() => {
    if (!formID) return false
    if (!resolvedForm) return true
    return !Array.isArray(resolvedForm.fields)
  }, [formID, resolvedForm])

  useEffect(() => {
    if (!shouldFetchForm || !formID) return

    let isMounted = true

    const loadForm = async () => {
      setIsFormLoading(true)

      try {
        const params = new URLSearchParams()
        params.set('depth', '2')

        if (locale) {
          params.set('locale', locale)
        }

        const req = await fetch(`${getClientSideURL()}/api/forms/${formID}?${params.toString()}`)
        const res = await req.json()

        if (!req.ok) {
          throw new Error(res?.errors?.[0]?.message || 'Unable to load form.')
        }

        if (isMounted) {
          setResolvedForm(res.doc || res)
        }
      } catch (err) {
        console.warn(err)

        if (isMounted) {
          setError({
            message: 'Формата не можа да бъде заредена.',
            status: '500',
          })
        }
      } finally {
        if (isMounted) {
          setIsFormLoading(false)
        }
      }
    }

    void loadForm()

    return () => {
      isMounted = false
    }
  }, [formID, locale, shouldFetchForm])

  useEffect(() => {
    if (!resetSignature || lastResetSignature.current === resetSignature) return

    reset(initialValues)
    lastResetSignature.current = resetSignature
  }, [initialValues, reset, resetSignature])

  const onSubmit = useCallback(
    (data: Data) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const params = new URLSearchParams()

          if (locale) {
            params.set('locale', locale)
          }

          const requestURL = `${getClientSideURL()}/api/form-submissions${
            params.size ? `?${params.toString()}` : ''
          }`

          const req = await fetch(requestURL, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  return (
    <div className="container lg:max-w-3xl">
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
      )}
      <div className="p-4 lg:p-6 border border-border rounded-[0.8rem]">
        <FormProvider {...formMethods}>
          {!isLoading && hasSubmitted && confirmationType === 'message' && (
            <RichText data={confirmationMessage} />
          )}
          {(isLoading || isFormLoading) && !hasSubmitted && <p>Loading, please wait...</p>}
          {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
          {!hasSubmitted && resolvedForm && (
            <form id={formID} onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4 last:mb-0">
                {formFields.map((field, index) => {
                    const Field: React.FC<any> | undefined =
                      fields?.[field.blockType as keyof typeof fields]

                    if (Field) {
                      return (
                        <div className="mb-6 last:mb-0" key={index}>
                          <Field
                            form={formFromProps}
                            {...field}
                            {...formMethods}
                            control={control}
                            errors={errors}
                            register={register}
                          />
                        </div>
                      )
                    }
                    return null
                  })}
              </div>

              <Button form={formID} type="submit" variant="default">
                {submitButtonLabel || 'Изпрати'}
              </Button>
            </form>
          )}
        </FormProvider>
      </div>
    </div>
  )
}
