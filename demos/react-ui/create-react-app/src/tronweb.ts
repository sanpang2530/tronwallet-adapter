// @ts-ignore
import TronWeb from 'tronweb';

export const tronWeb: any = new TronWeb({
    fullHost: 'https://api.shasta.trongrid.io', //'https://api.nileex.io',
});
(window as any).tronWeb1 = tronWeb;
