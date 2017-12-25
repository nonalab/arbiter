// Generic ticker for Arbiter
export class Balance {
	constructor({
		currency,
		available
	}) {
		this.currency = currency;
		this.available = Number(available);
	}

    isFunded() {
        return this.available > 0
    }
}
