import {
	Order as DefaultOrder,
	OrderSide,
	OrderType,
	OrderStatus
} from 'arbiter-model'

const OrderSideMap = {
	buy: OrderSide.BUY,
	sell: OrderSide.SELL
}

const OrderStatusMap = {
	new: OrderStatus.ACTIVE,
	filled: OrderStatus.FILLED,
	canceled: OrderStatus.CANCELED
}

const OrderTypeMap = {
	limit: OrderType.LIMIT,
	market: OrderType.MARKET
}

/*
	HitBTC Order
*/
export class Order extends DefaultOrder {
	constructor(order) {

		const id = order.clientOrderId

		const price = order.price || (Number(order.tradePrice) + Number(order.tradeFee)) || 0;

		const timestamp = order.updatedAt

		const side = OrderSideMap[order.side]

		const status = OrderStatusMap[order.status] || OrderStatus.OTHER

		const type = OrderTypeMap[order.type]

		super({
			...order,
			id,
			price,
			timestamp,

			side,
			status,
			type
		})
	}
}
