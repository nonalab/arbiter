import test from 'ava';

import {
	otherListener,
	errorListener,
	taggedLog
} from 'arbiter-util';

import ArbiterExchange from '../src';

import creds from '../credentials.json';

test.only('Create and cancel BUY order', async t => {

	const exchangeInstance = new ArbiterExchange();

	exchangeInstance
		// .on('other', otherListener)
		.on('error', errorListener)

	try {
		await exchangeInstance.open()

		await exchangeInstance.authenticate(creds)

		exchangeInstance.subscribeToReports()

		await exchangeInstance.requestBuyOrder({
			price: 10
		})

		const order = await exchangeInstance.waitFor('order')

		t.is(order.status, 'ACTIVE')

		exchangeInstance.requestCancelOrder(order.id)

		const canceledOrder = await exchangeInstance.waitFor('order')

		t.is(canceledOrder.status, 'CANCELED')

		t.is(order.id, canceledOrder.id)

		await exchangeInstance.close()
	} catch(e) {
		taggedLog('ERROR', e);
	}
});


test.serial('Create and cancel SELL order', async t => {

	const exchangeInstance = new ArbiterExchange();

	exchangeInstance
		// .on('other', otherListener)
		.on('error', errorListener)

	try {
		await exchangeInstance.open()

		await exchangeInstance.authenticate(creds)

		exchangeInstance.subscribeToReports()

		await exchangeInstance.requestSellOrder({
			price: 10000
		})

		const order = await exchangeInstance.waitFor('order')

		t.is(order.status, 'ACTIVE')

		exchangeInstance.requestCancelOrder(order.id)

		const canceledOrder = await exchangeInstance.waitFor('order')

		t.is(canceledOrder.status, 'CANCELED')

		t.is(order.id, canceledOrder.id)

		await exchangeInstance.close()
	} catch(e) {
		taggedLog('ERROR', e);
	}
});
