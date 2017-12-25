import {
	authListener,
	otherListener,
	tickerListener,
	orderListener,
	taggedLog
} from 'arbiter-util';

import ArbiterExchange from '../src';

import creds from '../credentials.json';

async function main() {
	const exchangeInstance = new ArbiterExchange();

	exchangeInstance
		// .on('auth', authListener)
		// .on('order', orderListener)
		.on('other', otherListener)
		.on('ticker', tickerListener)

	try {

		await exchangeInstance.open();

		// exchangeInstance.authenticate(creds);

		exchangeInstance.subscribeToTicker()

	} catch(e) {
		taggedLog('ERROR', e)
	}
}

main();
