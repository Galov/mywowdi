'use client'

import { Media } from '@/components/Media'
import { Message } from '@/components/Message'
import { Price } from '@/components/Price'
import { CheckoutAddresses } from '@/components/checkout/CheckoutAddresses'
import { getCheckoutCopy } from '@/components/checkout/copy'
import { AddressItem } from '@/components/addresses/AddressItem'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import { FormItem } from '@/components/forms/FormItem'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getLocalizedHref } from '@/i18n/routing'
import { useCurrentLocale } from '@/i18n/useCurrentLocale'
import { Address, Product, Variant } from '@/payload-types'
import { useAuth } from '@/providers/Auth'
import { useAddresses, useCart } from '@payloadcms/plugin-ecommerce/client/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

type GalleryItem = NonNullable<Product['gallery']>[number]
type VariantSelection = NonNullable<Variant['options']>[number]

type SubmittedInquiry = {
  inquiryID?: string
  reference: string
}

export const CheckoutPage: React.FC = () => {
  const locale = useCurrentLocale()
  const copy = getCheckoutCopy(locale)
  const { user } = useAuth()
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const { addresses } = useAddresses()
  const [error, setError] = useState<null | string>(null)
  const [email, setEmail] = useState('')
  const [emailEditable, setEmailEditable] = useState(true)
  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>()
  const [billingAddress, setBillingAddress] = useState<Partial<Address>>()
  const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(true)
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false)
  const [submittedInquiry, setSubmittedInquiry] = useState<null | SubmittedInquiry>(null)

  const cartIsEmpty = !cart || !cart.items || !cart.items.length

  const canSubmitInquiry = Boolean(
    (email || user?.email) && billingAddress && (billingAddressSameAsShipping || shippingAddress),
  )

  useEffect(() => {
    if (!shippingAddress && addresses && addresses.length > 0) {
      const defaultAddress = addresses[0]

      if (defaultAddress) {
        setBillingAddress(defaultAddress)
      }
    }
  }, [addresses, shippingAddress])

  useEffect(() => {
    return () => {
      setShippingAddress(undefined)
      setBillingAddress(undefined)
      setBillingAddressSameAsShipping(true)
      setEmail('')
      setEmailEditable(true)
      setError(null)
      setSubmittedInquiry(null)
    }
  }, [])

  const submitInquiry = useCallback(async () => {
    if (!cart?.items?.length || !billingAddress) return

    setIsSubmittingInquiry(true)
    setError(null)

    try {
      const response = await fetch('/api/inquiries', {
        body: JSON.stringify({
          billingAddress,
          customerEmail: user?.email || email,
          items: cart.items
            .map((item) => {
              const product =
                item.product && typeof item.product === 'object' ? item.product.id : null
              const variant =
                item.variant && typeof item.variant === 'object' ? item.variant.id : null

              if (!product || !item.quantity) return null

              return {
                productId: product,
                quantity: item.quantity,
                variantId: variant,
              }
            })
            .filter(Boolean),
          locale,
          shippingAddress: billingAddressSameAsShipping ? null : shippingAddress,
          shippingAddressSameAsBilling: billingAddressSameAsShipping,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const result = (await response.json()) as
        | { error?: string; inquiryID?: string; reference?: string }
        | undefined

      if (!response.ok || !result?.reference) {
        throw new Error(result?.error || copy.inquiryError)
      }

      await clearCart()

      setSubmittedInquiry({
        inquiryID: result.inquiryID,
        reference: result.reference,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : copy.inquiryError

      setError(message)
      toast.error(message)
    } finally {
      setIsSubmittingInquiry(false)
    }
  }, [
    billingAddress,
    billingAddressSameAsShipping,
    cart?.items,
    clearCart,
    copy.inquiryError,
    email,
    locale,
    shippingAddress,
    user?.email,
  ])

  if (submittedInquiry) {
    return (
      <div className="py-12 w-full">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-primary/5 p-8 md:p-10">
          <div className="space-y-5">
            <h2 className="text-3xl font-medium">{copy.inquirySuccessTitle}</h2>
            <p className="text-base leading-7 text-primary/72">{copy.inquirySuccessDescription}</p>
            <div className="rounded-2xl border border-white/10 bg-primary/5 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.26em] text-primary/50">
                {copy.inquiryReferenceLabel}
              </p>
              <p className="mt-2 text-lg font-medium">{submittedInquiry.reference}</p>
            </div>
            <Button asChild variant="default">
              <Link href={getLocalizedHref(locale, '/')}>{copy.continueShopping}</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (cartIsEmpty && isSubmittingInquiry) {
    return (
      <div className="py-12 w-full items-center justify-center">
        <div className="prose mb-8 max-w-none self-center text-center">
          <p>{copy.loading}</p>
        </div>
        <LoadingSpinner />
      </div>
    )
  }

  if (cartIsEmpty) {
    return (
      <div className="prose w-full items-center py-12">
        <p>{copy.emptyCart}</p>
        <Link href={getLocalizedHref(locale, '/')}>{copy.continueShopping}</Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-stretch justify-stretch my-8 grow gap-10 md:flex-row md:gap-6 lg:gap-8">
      <div className="basis-full flex flex-col gap-8 justify-stretch lg:basis-2/3">
        <h2 className="font-medium text-3xl">{copy.contact}</h2>

        {!user && (
          <div className="flex w-full items-center rounded-lg bg-accent p-4">
            <div className="prose">
              <Button asChild className="no-underline text-inherit" variant="outline">
                <Link href={getLocalizedHref(locale, '/login')}>{copy.logIn}</Link>
              </Button>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-base">
                <span>{copy.loginPrompt}</span>
                <Link href={getLocalizedHref(locale, '/create-account')}>{copy.createAccount}</Link>
              </div>
            </div>
          </div>
        )}

        {user ? (
          <div className="rounded-lg bg-accent p-4">
            <div>
              <p>{user.email}</p>
              <p>
                {copy.notYou}{' '}
                <Link className="underline" href={getLocalizedHref(locale, '/logout')}>
                  {copy.logOut}
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-accent p-4">
            <div>
              <p className="mb-4">{copy.guestCheckoutPrompt}</p>

              <FormItem className="mb-6">
                <Label htmlFor="email">{copy.emailAddress}</Label>
                <Input
                  disabled={!emailEditable}
                  id="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                />
              </FormItem>

              <Button
                disabled={!email || !emailEditable}
                onClick={(e) => {
                  e.preventDefault()
                  setEmailEditable(false)
                }}
                variant="default"
              >
                {copy.continueAsGuest}
              </Button>
            </div>
          </div>
        )}

        <h2 className="font-medium text-3xl">{copy.address}</h2>

        {billingAddress ? (
          <div>
            <AddressItem
              actions={
                <Button
                  disabled={isSubmittingInquiry}
                  onClick={(e) => {
                    e.preventDefault()
                    setBillingAddress(undefined)
                  }}
                  variant="outline"
                >
                  {copy.remove}
                </Button>
              }
              address={billingAddress}
            />
          </div>
        ) : user ? (
          <CheckoutAddresses heading={copy.billingAddress} setAddress={setBillingAddress} />
        ) : (
          <CreateAddressModal
            callback={(address) => {
              setBillingAddress(address)
            }}
            disabled={!email || Boolean(emailEditable)}
            skipSubmission={true}
          />
        )}

        <div className="flex items-center gap-4">
          <Checkbox
            checked={billingAddressSameAsShipping}
            disabled={Boolean(!user && (!email || Boolean(emailEditable))) || isSubmittingInquiry}
            id="shippingTheSameAsBilling"
            onCheckedChange={(state) => {
              setBillingAddressSameAsShipping(state as boolean)
            }}
          />
          <Label htmlFor="shippingTheSameAsBilling">{copy.shippingSameAsBilling}</Label>
        </div>

        {!billingAddressSameAsShipping && (
          <>
            {shippingAddress ? (
              <div>
                <AddressItem
                  actions={
                    <Button
                      disabled={isSubmittingInquiry}
                      onClick={(e) => {
                        e.preventDefault()
                        setShippingAddress(undefined)
                      }}
                      variant="outline"
                    >
                      {copy.remove}
                    </Button>
                  }
                  address={shippingAddress}
                />
              </div>
            ) : user ? (
              <CheckoutAddresses
                description={copy.shippingDescription}
                heading={copy.shippingAddress}
                setAddress={setShippingAddress}
              />
            ) : (
              <CreateAddressModal
                callback={(address) => {
                  setShippingAddress(address)
                }}
                disabled={!email || Boolean(emailEditable)}
                skipSubmission={true}
              />
            )}
          </>
        )}

        <div className="space-y-4">
          <div className="rounded-lg border border-white/10 bg-primary/5 p-4 text-sm leading-6 text-primary/70">
            {copy.inquiryNotice}
          </div>
          <p className="text-base leading-7 text-primary/78">{copy.inquiryQuestion}</p>
          <Button
            className="self-start"
            disabled={!canSubmitInquiry || isSubmittingInquiry}
            onClick={(e) => {
              e.preventDefault()
              void submitInquiry()
            }}
          >
            {copy.inquirySubmit}
          </Button>
        </div>

        {error && (
          <div className="my-8">
            <Message error={error} />

            <Button
              onClick={(e) => {
                e.preventDefault()
                router.refresh()
              }}
              variant="default"
            >
              {copy.tryAgain}
            </Button>
          </div>
        )}
      </div>

      <div className="basis-full rounded-lg border-none bg-primary/5 p-8 lg:basis-1/3 lg:pl-8 flex flex-col gap-8">
        <h2 className="text-3xl font-medium">{copy.summaryCart}</h2>
        {cart?.items?.map((item, index) => {
          if (typeof item.product !== 'object' || !item.product) {
            return null
          }

          const {
            product,
            product: { meta, title, gallery },
            quantity,
            variant,
          } = item

          if (!quantity) return null

          let image = gallery?.[0]?.image || meta?.image
          let price = product?.priceInEUR

          if (variant && typeof variant === 'object') {
            price = variant.priceInEUR

            const imageVariant = product.gallery?.find((galleryItem: GalleryItem) => {
              if (!galleryItem.variantOption) return false

              const variantOptionID =
                typeof galleryItem.variantOption === 'object'
                  ? galleryItem.variantOption.id
                  : galleryItem.variantOption

              return variant.options?.some((option: VariantSelection) =>
                typeof option === 'object' ? option.id === variantOptionID : option === variantOptionID,
              )
            })

            if (imageVariant && typeof imageVariant.image !== 'string') {
              image = imageVariant.image
            }
          }

          return (
            <div className="flex items-start gap-4" key={index}>
              <div className="flex h-20 w-20 items-stretch justify-stretch rounded-lg border p-2">
                <div className="relative h-full w-full">
                  {image && typeof image !== 'string' && (
                    <Media fill className="" imgClassName="rounded-lg" resource={image} />
                  )}
                </div>
              </div>
              <div className="flex grow items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-medium">{title}</p>
                  {variant && typeof variant === 'object' && (
                    <p className="font-mono text-sm tracking-widest text-primary/50">
                      {variant.options
                        ?.map((option: VariantSelection) =>
                          typeof option === 'object' ? option.label : null,
                        )
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  )}
                  <div>
                    {copy.quantityPrefix}
                    {quantity}
                  </div>
                </div>

                {typeof price === 'number' && <Price amount={price} />}
              </div>
            </div>
          )
        })}
        <hr />
        <div className="rounded-lg border border-white/10 bg-primary/5 p-4 text-sm leading-6 text-primary/70">
          {copy.deliveryNoticeShort}
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="uppercase">{copy.total}</span>
          <Price amount={cart?.subtotal || 0} className="text-3xl font-medium" />
        </div>
      </div>
    </div>
  )
}
