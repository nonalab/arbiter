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


	test(`${exchange} - Create and Cancel BUY order`, async t => {

		const order = await exchangeInstance.requestBuyOrder({
			pair: ['ETH', 'USD'],
			price: 0.1
		})

		t.is(order.status, 'ACTIVE')

		const canceledOrder = await exchangeInstance.requestCancelOrder(order.id)

		if (!canceledOrder) {
			t.fail()
		}

		t.is(canceledOrder.status, 'CANCELED')

		t.is(order.id, canceledOrder.id)
	});


	test(`${exchange} - Create and Cancel SELL order`, async t => {
		const order = await exchangeInstance.requestSellOrder({
			pair: ['EOS', 'ETH'],
			price: 10000
		})

		t.is(order.status, 'ACTIVE')

		const canceledOrder = await exchangeInstance.requestCancelOrder(order.id)

		if (!canceledOrder) {
			t.fail()
		}

		t.is(canceledOrder.status, 'CANCELED')

		t.is(order.id, canceledOrder.id)
	});
}
