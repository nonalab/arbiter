import {
	authListener,
	otherListener,
	tickerListener,
	orderListener,
	taggedLog,
	wait
} from 'arbiter-util';

import ArbiterExchange from '../src';

import creds from '../credentials.json';

async function main() {
	const exchangeInstance = new ArbiterExchange();

	exchangeInstance
		// .on('auth', authListener)
		.on('order', orderListener)
		.on('other', otherListener)
		.on('ticker', tickerListener)

	try {

		await exchangeInstance.open();

		await exchangeInstance.authenticate(creds);

		taggedLog('AUTH', 'SUCCESS');

		exchangeInstance.subscribeToTicker()

		await exchangeInstance.requestBuyOrder({
			price: 300
		})

		const buyOrder = await exchangeInstance.waitFor('order')

		exchangeInstance.requestCancelOrder(buyOrder.id)

		// await exchangeInstance.requestSellOrder({
		// 	price: 300
		// })

	} catch(e) {
		taggedLog('ERROR', e)
	}
}

main();
