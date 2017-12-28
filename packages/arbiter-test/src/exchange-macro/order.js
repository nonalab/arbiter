import test from 'ava';

export default function (exchange, exchangeInstance, store) {
	test.before(async t => {
		exchangeInstance
			.on('error', console.error)
		// grab otherListener from arbiter-util if needed
		// .on('other', otherListener)

		await exchangeInstance.open()

        const creds = await store.init();

        await exchangeInstance.authenticate(store.credential[exchange])

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
}
