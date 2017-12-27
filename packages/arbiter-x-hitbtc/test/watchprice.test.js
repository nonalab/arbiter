import {
	authListener,
	otherListener,
	tickerListener,
	orderListener,
	balanceListener,
	errorListener,
	wait,
	taggedLog
} from 'arbiter-util';

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

		taggedLog('AUTH', 'SUCCESS');

		exchangeInstance.subscribeToReports()

		exchangeInstance.requestTradingBalance()

		exchangeInstance.subscribeToTicker()

		await exchangeInstance.requestBuyOrder({
			price: 300
		})

		const buyOrder = await exchangeInstance.waitFor('order')

		exchangeInstance.requestCancelOrder(buyOrder.id)

		// await exchangeInstance.requestSellOrder()

	} catch(e) {
		taggedLog('ERROR', e);
	}
}

main();
