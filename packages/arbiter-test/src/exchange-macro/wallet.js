import test from 'ava';

export default function (exchange, exchangeInstance, store) {
	test.before(async t => {
		// exchangeInstance
		// 	.on('other', otherListener)
		// .on('error', console.error)
		// grab otherListener from arbiter-util if needed

		await exchangeInstance.open()

		const creds = await store.init();

		await exchangeInstance.authenticate(store.credential[exchange])

		exchangeInstance.subscribeToReports()
	});

	test.after(async t => {
		await exchangeInstance.close()
	});


	test(`${exchange} - Get ETH Deposit Wallet Address`, async t => {
		const data = await Promise.race([
			exchangeInstance.requestDepositAddress(),
			exchangeInstance.waitFor('error')
		])

		if(data.error) {
			t.fail(JSON.stringify(data))
		}

		t.not(data, null)
	});

	test(`${exchange} - Deposit ETH to LAB's Wallet`, async t => {
		const data = await Promise.race([
			exchangeInstance.requestWithdrawCrypto({
				// serious: true
			}),
			exchangeInstance.waitFor('error')
		])

		if (data.error) {
			t.fail(JSON.stringify(data))
		}

		t.not(data, null)
	});
}
