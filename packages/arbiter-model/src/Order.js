// Generic ticker for Arbiter
export class Order {
	constructor({
		id,
		symbol,
		type,
		side,
		status,
		quantity,
		price,
		timestamp = Date.now()
	}) {
		this.id = id;

		this.symbol = symbol;
		this.type = type;
		this.side = side.toUpperCase();
		this.status = status.toUpperCase();

		this.quantity = Number(quantity);
		this.price = Number(price);
		this.timestamp = new Date(timestamp);

		this.total = this.quantity * this.price;
	}

	toString() {
		return `
STATUS: ${this.status} - PRICE: ${this.price} - QUANTITY: ${this.quantity} - TOTAL: ${this.total}
    - TIME: ${this.timestamp}
`
	}

}
