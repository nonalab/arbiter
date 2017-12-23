
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
