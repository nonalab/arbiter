import {
	wait
} from './utils';

/**
    Skeleton for a program that run forever
*/
export async function foreverProcess ({
	init	= async()=>	{},
	update	= async()=>	{},
	exit 	= async()=>	{},
}, updateInterval  = 500 ){
    process.on('SIGTERM', async ()=>{
        await exit();
    	process.exit(0);
    });

    process.on('SIGINT', async ()=>{
        await exit();
    	process.exit(0);
    });

    process.stdin.resume();

	try {
		await init();

		for(;'ever';) {
			await wait(updateInterval);

			await update();
		}
	} catch (e) {
		console.error(e);
		process.exit(2);
	}
}
