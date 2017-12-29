export function getExchangeClass(exchange) {
	const exchangeClass = require(`arbiter-x-${exchange}`)
	return exchangeClass.default
}

export function getExchangeMacro(name) {
	const macro = require(`./exchange-macro/${name}`)
	return macro.default
}
