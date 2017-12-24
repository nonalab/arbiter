import {
	authListener,
	otherListener,
	tickerListener,
	orderListener,
	balanceListener
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
		.on('balance', balanceListener)

	await exchangeInstance.open();

	await exchangeInstance.authenticate(creds);

	exchangeInstance.subscribeToReports()

	exchangeInstance.requestTradingBalance()

	// exchangeInstance.subscribeToTicker()
}

main();
