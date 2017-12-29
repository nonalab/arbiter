import {
	getExchangeClass,
	getExchangeMacro
} from './util';

import ArbiterStore from 'arbiter-store';

import {
	authListener,
	otherListener,
	tickerListener,
	orderListener,
	balanceListener,
	errorListener,
	taggedLog
} from 'arbiter-util';

const store = new ArbiterStore(['credential'])

const exchange =
	'hitbtc'
// 'bitfinex'
// 'bitgrail'

const exchangeClass = getExchangeClass(exchange)

run()

async function run() {
	const exchangeInstance = new exchangeClass()

	exchangeInstance
		.on('balance', balanceListener)
		.on('other', otherListener)
		.on('error', console.error)
	// grab otherListener from arbiter-util if needed

	await exchangeInstance.open()

	const creds = await store.init();

	await exchangeInstance.authenticate(store.credential[exchange])

	exchangeInstance.subscribeToReports()

	// const buyOrder = await exchangeInstance.requestBuyOrder({
	// 	// price: 10
	// })
    //
	// if (!buyOrder || buyOrder.error) {
	// 	taggedLog('ERROR', 'BUY ORDER FAILED');
	// 	return process.exit(2);
	// }

	const sellOrder = await exchangeInstance.requestSellOrder({
		// price: 10
		quantity: 0.06
	})

	if (!sellOrder || sellOrder.error) {
		taggedLog('ERROR', 'SELL ORDER FAILED');
		return process.exit(2);
	}
}

async function testWithdraw(exchangeInstance) {
	const withdraw = await exchangeInstance.requestWithdrawCrypto({
		serious: true
	})

	if(!withdraw) {
		return
	}

	const transactionStatus = await exchangeInstance.waitForTransaction(withdraw.id)
	console.log('TRANSACTION COMPLETE!');
}
