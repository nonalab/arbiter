import test from 'ava';

import {
	otherListener,
	errorListener,
	taggedLog
} from 'arbiter-util';

import ArbiterExchange from '../src';

import creds from '../credentials.json';

const exchangeInstance = new ArbiterExchange();

test.before(async t => {
	exchangeInstance
		// .on('other', otherListener)
		.on('error', () => {
			t.fail()
		})

	await exchangeInstance.open()

	await exchangeInstance.authenticate(creds)

	exchangeInstance.subscribeToReports()
});

test.after(async t => {
	await exchangeInstance.close()
});

test('Create and cancel BUY order', async t => {
	await exchangeInstance.requestBuyOrder({
		price: 10
	})

	const order = await exchangeInstance.waitFor('order')

	t.is(order.status, 'ACTIVE')

	exchangeInstance.requestCancelOrder(order.id)

	const canceledOrder = await exchangeInstance.waitFor('order')

	t.is(canceledOrder.status, 'CANCELED')

	t.is(order.id, canceledOrder.id)
});


test('Create and cancel SELL order', async t => {
	await exchangeInstance.requestSellOrder({
		price: 10000
	})

	const order = await exchangeInstance.waitFor('order')

	t.is(order.status, 'ACTIVE')

	exchangeInstance.requestCancelOrder(order.id)

	const canceledOrder = await exchangeInstance.waitFor('order')

	t.is(canceledOrder.status, 'CANCELED')

	t.is(order.id, canceledOrder.id)
});
