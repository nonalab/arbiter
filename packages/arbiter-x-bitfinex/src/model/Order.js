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
	/*
	[
		3159460078, null, 24680610010, "tIOTUSD", 1500965481000, 1500965480000,
		-200, -200, "EXCHANGE LIMIT", null, null, null,
		0, "EXECUTED @ 190(50)", null, null, 50, 0,
		null, null, null, null, null, 0, 0, 0
	]
	px === place holder
	*/
	constructor([
        id, gid, cid, rawSymbol, creation, updateTime,
        quantity, originalQuantity, rawType, previousType, p1, p2,
        flags, rawStatus, p3, p4, price, averagePrice
    ]) {
		const side = quantity[0] !== '-' ? OrderSide.BUY : OrderSide.SELL

		const type = OrderTypeMap[rawType]

		// Grabbing just the first part of the status
		const status = OrderStatusMap[rawStatus.split(' @')[0]] || OrderStatus.OTHER

		const timestamp = Number(updateTime)

		const symbol = rawSymbol.slice(1)

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
