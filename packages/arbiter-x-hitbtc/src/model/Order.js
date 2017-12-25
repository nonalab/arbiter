import {
	Order as DefaultOrder
} from 'arbiter-model'

export class Order extends DefaultOrder {
	constructor(order) {
		super({
			...order,
            id: order.clientOrderId,
			price: order.price || (Number(order.tradePrice) + Number(order.tradeFee)) || 0,
			timestamp: order.updatedAt
		})
	}
}
