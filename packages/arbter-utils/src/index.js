export async function wait(duration) {
	return new Promise(function(resolve, reject) {
		setTimeout(() => {
			resolve();
		}, duration);
	});
}

export function taggedLog(tag, info) {
	console.log(` --- --- --- --- ${tag} --- --- --- --- ----`);
	console.log(info);
}

export function tickerListener ({ask, bid, symbol, timestamp}) {
	taggedLog(`TICKER - ${symbol}`, `ASK: ${ask} - BID: ${bid} - TIME: ${timestamp}`)
}

export function orderListener(data) {
	taggedLog(`ORDER - `, data)
}

export function authListener(respJSON) {
	taggedLog(`AUTH`, respJSON)
}

export function otherListener(respJSON) {
	taggedLog(`OTHER`, respJSON)
}
