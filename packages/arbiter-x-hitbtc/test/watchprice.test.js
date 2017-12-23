import {
	authListener,
	otherListener,
	tickerListener,
	orderListener
} from 'arbiter-utils';

import ArbiterExchange from '../src';

import creds from '../credentials.json';

async function main(){
	const exchangeInstance = new ArbiterExchange();

	exchangeInstance
		// .on('auth', authListener)
		// .on('other', otherListener)
		.on('ticker', tickerListener)
		.on('order', orderListener)

	await exchangeInstance.open();

	exchangeInstance.authenticate(creds);

	exchangeInstance.subscribeToReports()
	exchangeInstance.subscribeToTicker()
}

main();
