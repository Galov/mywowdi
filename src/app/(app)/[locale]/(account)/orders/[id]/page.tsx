import OrderPage, {
  generateMetadata as generateOrderMetadata,
} from '../../../../(account)/orders/[id]/page'

export const dynamic = 'force-dynamic'

export default OrderPage
export const generateMetadata = generateOrderMetadata
