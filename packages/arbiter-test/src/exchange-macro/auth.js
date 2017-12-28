import test from 'ava';

export default function (exchange, exchangeInstance, store) {
	test.before(async t => {
		exchangeInstance
			.on('error', console.error)
		// grab otherListener from arbiter-util if needed
		// .on('other', otherListener)

		await exchangeInstance.open()
	})

	test.after(async t => {
		await exchangeInstance.close()
	})

	test('Subscribe to ticker', async t => {
		exchangeInstance.subscribeToTicker('ETHUSD')

		const ticker = await exchangeInstance.waitFor('ticker')

		t.is(ticker.symbol, 'ETHUSD')
	});

	test('Authenticate and get balance', async t => {
		// Some exchange will return the balance immediatley after auth.
		// Setup a promise before auth ensure we can catch the balance before it
		// fall through
		const balance = exchangeInstance.waitFor('balance');

        const creds = await store.init();

		await exchangeInstance.authenticate(store.credential[exchange])

		exchangeInstance.requestTradingBalance()

		await t.notThrows(balance);
	});
}
