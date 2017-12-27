import {
	Order as DefaultOrder,
	OrderSide,
	OrderType,
	OrderStatus
} from 'arbiter-model'

const OrderTypeMap = {
	'EXCHANGE LIMIT': OrderType.LIMIT,
	'EXCHANGE MARKET': OrderType.MARKET,
}

const OrderStatusMap = {
	...OrderStatus,
	EXECUTED: OrderStatus.FILLED
}

/*
	bitfinex order
*/
export class Order extends DefaultOrder {
	constructor([
        id, gid, cid, symbol, creation, updateTime,
        quantity, originalQuantity, rawType, previousType,
        flags, rawStatus, price, averagePrice, trailingPrice,
        notifyFlag, hidden, placeId
    ]) {
		const side = quantity[0] !== '-' ? OrderSide.BUY : OrderSide.SELL

		const type = OrderTypeMap[rawType]

		const status = OrderStatusMap[rawStatus] || OrderStatus.OTHER

		const timestamp = Number(updateTime)

		super({
			id,
			symbol,
			type,
			side,
			status,
			quantity,
			price,
			timestamp
		})
	}
}
