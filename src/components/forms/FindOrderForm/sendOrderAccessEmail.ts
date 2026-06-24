'use server'

import configPromise from '@payload-config'
import { defaultLocale, type ContentLocale } from '@/i18n/config'
import { getLocalizedHref } from '@/i18n/routing'
import { buildOrderAccessEmail } from '@/utilities/email/templates'
import { getPayload } from 'payload'
import { getServerSideURL } from '@/utilities/getURL'

type SendOrderAccessEmailArgs = {
  email: string
  locale?: ContentLocale
  orderID: string
}

type SendOrderAccessEmailResult = {
  success: boolean
  error?: string
}

export async function sendOrderAccessEmail({
  email,
  locale = defaultLocale,
  orderID,
}: SendOrderAccessEmailArgs): Promise<SendOrderAccessEmailResult> {
  const payload = await getPayload({ config: configPromise })

  try {
    const { docs: orders } = await payload.find({
      collection: 'orders',
      where: {
        and: [{ id: { equals: orderID } }, { customerEmail: { equals: email } }],
      },
      limit: 1,
      depth: 0,
    })

    const order = orders[0]

    if (!order || !order.accessToken) {
      return { success: true }
    }

    const serverURL = getServerSideURL()
    const orderURL = `${serverURL}${getLocalizedHref(
      locale,
      `/orders/${order.id}`,
    )}?email=${encodeURIComponent(email)}&accessToken=${order.accessToken}`

    const orderAccessEmail = buildOrderAccessEmail({
      locale,
      orderID: String(order.id),
      orderURL,
    })

    await payload.sendEmail({
      to: email,
      subject: orderAccessEmail.subject,
      html: orderAccessEmail.html,
    })

    return { success: true }
  } catch (err) {
    payload.logger.error({ msg: 'Failed to send order access email', err })
    return { success: true }
  }
}
