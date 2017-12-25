import {
	Balance as DefaultBalance
} from 'arbiter-model';

export class Balance extends DefaultBalance {
	constructor([type, currency, available]) {
		super({
    		currency,
    		available
    	})
	}
}
