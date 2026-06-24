import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'

import type { ContentLocale } from '@/i18n/config'
import { normalizeLocale } from '@/i18n/routing'
import {
  buildInquiryAdminEmail,
  buildInquiryCustomerEmail,
} from '@/utilities/email/templates'

type SubmittedAddress = {
  addressLine1?: string
  addressLine2?: string
  city?: string
  company?: string
  country?: string
  firstName?: string
  lastName?: string
  phone?: string
  postalCode?: string
  state?: string
  title?: string
}

type NormalizedBillingAddress = {
  addressLine1: string
  addressLine2?: string
  city: string
  company?: string
  country: string
  firstName: string
  lastName: string
  phone?: string
  postalCode: string
  state?: string
  title?: string
}

type SubmittedItem = {
  productId?: string
  quantity?: number
  variantId?: string | null
}

type InquiryRequestBody = {
  billingAddress?: SubmittedAddress
  customerEmail?: string
  items?: SubmittedItem[]
  locale?: string
  shippingAddress?: SubmittedAddress
  shippingAddressSameAsBilling?: boolean
}

const getRelationID = (value: unknown) => {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'id' in value && typeof value.id === 'string') {
    return value.id
  }

  return null
}

const formatPrice = (amount: number, locale: ContentLocale) =>
  new Intl.NumberFormat(locale, {
    currency: 'EUR',
    style: 'currency',
  }).format(amount)

const normalizeStoredPrice = (amount: number) => Number((amount / 100).toFixed(2))

const formatAddressHTML = (address?: SubmittedAddress) => {
  if (!address) return ''

  const parts = [
    [address.title, address.firstName, address.lastName].filter(Boolean).join(' '),
    address.company,
    address.phone,
    [address.addressLine1, address.addressLine2].filter(Boolean).join(', '),
    [address.city, address.state, address.postalCode].filter(Boolean).join(', '),
    address.country,
  ].filter(Boolean)

  return parts.join('<br />')
}

const normalizeText = (value?: string) => value?.trim() || undefined

const normalizeBillingAddress = (address?: SubmittedAddress): NormalizedBillingAddress | null => {
  const normalized = {
    addressLine1: normalizeText(address?.addressLine1),
    addressLine2: normalizeText(address?.addressLine2),
    city: normalizeText(address?.city),
    company: normalizeText(address?.company),
    country: normalizeText(address?.country),
    firstName: normalizeText(address?.firstName),
    lastName: normalizeText(address?.lastName),
    phone: normalizeText(address?.phone),
    postalCode: normalizeText(address?.postalCode),
    state: normalizeText(address?.state),
    title: normalizeText(address?.title),
  }

  if (
    !normalized.firstName ||
    !normalized.lastName ||
    !normalized.addressLine1 ||
    !normalized.city ||
    !normalized.postalCode ||
    !normalized.country
  ) {
    return null
  }

  return normalized as NormalizedBillingAddress
}

const normalizeSubmittedAddress = (address?: SubmittedAddress): SubmittedAddress | undefined => {
  if (!address) return undefined

  const normalized = {
    addressLine1: normalizeText(address.addressLine1),
    addressLine2: normalizeText(address.addressLine2),
    city: normalizeText(address.city),
    company: normalizeText(address.company),
    country: normalizeText(address.country),
    firstName: normalizeText(address.firstName),
    lastName: normalizeText(address.lastName),
    phone: normalizeText(address.phone),
    postalCode: normalizeText(address.postalCode),
    state: normalizeText(address.state),
    title: normalizeText(address.title),
  }

  return Object.values(normalized).some(Boolean) ? normalized : undefined
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as InquiryRequestBody
    const locale = normalizeLocale(body?.locale)
    const items = Array.isArray(body?.items) ? body.items : []
    const billingAddress = normalizeBillingAddress(body?.billingAddress)
    const shippingAddressSameAsBilling = body?.shippingAddressSameAsBilling !== false
    const shippingAddress = shippingAddressSameAsBilling
      ? undefined
      : normalizeSubmittedAddress(body?.shippingAddress)
    const customerEmail = body?.customerEmail?.trim()
    const customerName = [billingAddress?.firstName, billingAddress?.lastName]
      .filter(Boolean)
      .join(' ')
      .trim()

    if (!customerEmail || !billingAddress) {
      return NextResponse.json(
        { error: 'Missing customer contact details.' },
        { status: 400 },
      )
    }

    if (!items.length) {
      return NextResponse.json({ error: 'No items were submitted.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })
    const adminUsers = await payload.find({
      collection: 'users',
      depth: 0,
      limit: 100,
      overrideAccess: true,
      pagination: false,
      where: {
        roles: {
          contains: 'admin',
        },
      },
    })
    const adminRecipients = adminUsers.docs
      .map((user) => user.email)
      .filter((email): email is string => Boolean(email))

    const normalizedItems = []

    for (const item of items) {
      if (!item?.productId || !item?.quantity || item.quantity < 1) {
        return NextResponse.json({ error: 'Invalid item payload.' }, { status: 400 })
      }

      const product = await payload.findByID({
        collection: 'products',
        id: item.productId,
        depth: 0,
      })

      let variant: any = null

      if (item.variantId) {
        variant = await payload.findByID({
          collection: 'variants',
          id: item.variantId,
          depth: 1,
        })

        const variantProductID = getRelationID(variant?.product)

        if (variantProductID && variantProductID !== product.id) {
          return NextResponse.json(
            { error: 'Variant does not belong to the selected product.' },
            { status: 400 },
          )
        }
      }

      const unitPriceMinor =
        typeof variant?.priceInEUR === 'number'
          ? variant.priceInEUR
          : typeof product?.priceInEUR === 'number'
            ? product.priceInEUR
            : null

      if (typeof unitPriceMinor !== 'number') {
        return NextResponse.json(
          { error: 'Unable to determine item price.' },
          { status: 400 },
        )
      }

      const unitPrice = normalizeStoredPrice(unitPriceMinor)

      const variantLabel =
        variant?.options
          ?.map((option: any) => (typeof option === 'object' ? option?.label : null))
          .filter(Boolean)
          .join(', ') || null

      normalizedItems.push({
        product: product.id,
        productTitle: product.title,
        quantity: item.quantity,
        unitPrice,
        lineTotal: Number((unitPrice * item.quantity).toFixed(2)),
        variant: variant?.id || undefined,
        variantLabel,
      })
    }

    const totalProductAmount = Number(
      normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2),
    )

    const inquiry = await payload.create({
      collection: 'inquiries',
      data: {
        billingAddress,
        currency: 'EUR',
        customerEmail,
        customerName,
        customerPhone: billingAddress.phone,
        items: normalizedItems,
        locale,
        shippingAddress,
        shippingAddressSameAsBilling,
        status: 'new',
        totalProductAmount,
      },
      overrideAccess: true,
    })

    const formattedTotal = formatPrice(totalProductAmount, locale)
    const itemsHTML = normalizedItems
      .map((item) => {
        const variantLine = item.variantLabel ? `<br />Вариант: ${item.variantLabel}` : ''

        return `
          <div style="margin:0 0 14px;padding:0 0 14px;border-bottom:1px solid rgba(216,186,150,0.16);">
            <div style="margin:0 0 6px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#cdb39a;">
              ${item.productTitle}
            </div>
            <div style="font-size:15px;line-height:1.75;color:#f4e8da;">
              Количество: ${item.quantity}${variantLine}<br />
              Цена: ${formatPrice(item.unitPrice, locale)}<br />
              Общо: ${formatPrice(item.lineTotal, locale)}
            </div>
          </div>
        `
      })
      .join('')

    const addressHTML = formatAddressHTML(billingAddress)
    const shippingHTML =
      shippingAddressSameAsBilling || !shippingAddress
        ? 'Съвпада с адреса за фактуриране.'
        : formatAddressHTML(shippingAddress)

    const adminEmail = buildInquiryAdminEmail({
      billingAddressHTML: addressHTML,
      customerEmail,
      customerName,
      customerPhone: billingAddress.phone,
      inquiryReference: inquiry.reference || inquiry.id,
      itemsHTML,
      locale,
      shippingAddressHTML: shippingHTML,
      total: formattedTotal,
    })

    const customerEmailData = buildInquiryCustomerEmail({
      customerName,
      inquiryReference: inquiry.reference || inquiry.id,
      itemsHTML,
      locale,
      total: formattedTotal,
    })

    if (adminRecipients.length > 0) {
      await payload.sendEmail({
        html: adminEmail.html,
        subject: adminEmail.subject,
        to: adminRecipients,
      })
    } else {
      console.warn('No admin users found for inquiry notification. Skipping admin notification.')
    }

    await payload.sendEmail({
      html: customerEmailData.html,
      subject: customerEmailData.subject,
      to: customerEmail,
    })

    return NextResponse.json({
      inquiryID: inquiry.id,
      reference: inquiry.reference || inquiry.id,
      success: true,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: 'Unable to submit inquiry right now.' },
      { status: 500 },
    )
  }
}
