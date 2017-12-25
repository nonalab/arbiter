import {
	authListener,
	otherListener,
	tickerListener,
	orderListener,
	balanceListener,
	errorListener,
	wait,
	taggedLog
} from 'arbiter-utils';

import ArbiterExchange from '../src';

import creds from '../credentials.json';

async function main() {
	const exchangeInstance = new ArbiterExchange();

	exchangeInstance
		// .on('auth', authListener)
		// .on('other', otherListener)
		// .on('ticker', tickerListener)
		.on('order', orderListener)
		.on('balance', balanceListener)
		.on('error', errorListener)

	try {
		await exchangeInstance.open();

		await exchangeInstance.authenticate(creds);

		exchangeInstance.subscribeToReports()

		exchangeInstance.requestTradingBalance()

		exchangeInstance.subscribeToTicker()

		await exchangeInstance.requestBuyOrder()

		await wait(2000);

		// exchangeInstance.requestCancelOrder(clientOrderId)

		await exchangeInstance.requestSellOrder()

	} catch(e) {
		taggedLog('ERROR', e);
	}
}

main();
