import TPCExchangeHitBTC from '../src';

import creds from '../credentials.json';

function taggedLog(tag, info) {
	console.log(` --- --- --- --- ${tag} --- --- --- --- ----`);
	console.log(info);
}

function authListener(respJSON) {
	taggedLog(`AUTH`, respJSON)
}

function otherListener(respJSON) {
	taggedLog(`OTHER`, respJSON)
}

/*
{"channel":"ticker","type":"update","data":{"ask":"0.053440","bid":"0.053341","last":"0.053445","open":"0.049779","low":"0.046764","high":"0.054361","volume":"115040.853","volumeQuote":"5872.911384124","timestamp":"2017-11-13T02:45:14.146Z","symbol":"ETHBTC"}}
*/
function tickerListener ({ask, bid, symbol, time}) {
	taggedLog(`TICKER - ${symbol}`, `ASK: ${ask} - BID: ${bid} - TIME: ${time}`)
}

async function main(){
	const hitBTCInstance = new TPCExchangeHitBTC({
		tickerListener,
		authListener,
		otherListener
	});

	hitBTCInstance
		.on('auth', authListener)
		.on('other', otherListener)
		.on('ticker', tickerListener)

	await hitBTCInstance.open();

	hitBTCInstance.authenticate(creds);

	hitBTCInstance.subscribeToTicker()
}

main();
