import test from 'ava';

import {
	Ticker
} from '../lib/Ticker';

test('Create ticker', t => {
	const data = {
		ask: 0,
		bid: 1,
		last: 2,
		low: 4,
		high: 5,
		symbol: 'A'
	};

	const tickerInstance = new Ticker(data);

	Object.keys(data)
		.map((key) => {
			t.is(tickerInstance[key], data[key]);
		})
});
