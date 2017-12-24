// Generic ticker for Arbiter
export class Balance {
	constructor({
		currency,
		available,
		reserved
	}) {
		this.currency = currency;
		this.available = Number(available);
		this.reserved = Number(reserved);
	}

    isFunded() {
        return this.available > 0 || this.reserved > 0
    }
}
