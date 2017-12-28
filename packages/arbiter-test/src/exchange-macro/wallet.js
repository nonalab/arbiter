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


	test('Check wallet info', async t => {
		const balance = await exchangeInstance.get('trading/balance', JSON.stringify({}))

        console.log(balance);
	});
}
