import "babel-polyfill";
import { CoinType } from '../common/utils';
const TransportWebUSB = require('@ledgerhq/hw-transport-webusb').default;
const TransportU2F = require('@ledgerhq/hw-transport-u2f').default;
const platform = require('platform');
const Btc = require('@ledgerhq/hw-app-btc').default;
const Eth = require('@ledgerhq/hw-app-eth').default;
class LedgerTransport {
    private OPEN_TIMEOUT: number = 10000;
    private LISTENER_TIMEOUT: number = 30000;
    private coin_type: string;
    constructor(coinType: string) {
        this.coin_type = coinType;
    }
    private async isWebUsbSupported(): Promise<boolean> {
        debugger
        const isSupport = await TransportWebUSB.isSupported();
        return (
            isSupport && platform.os.family !== 'Windows' && platform.name !== 'Opera'
        );
    }
    public async getTransport(): Promise<any> {
        debugger
        const support: boolean = await this.isWebUsbSupported();
        let transport: any;
        if (support) {
            transport = await TransportWebUSB.create();
        } else {
            transport = await TransportU2F.create(this.OPEN_TIMEOUT, this.LISTENER_TIMEOUT);
        }
        if (this.coin_type === CoinType.ETH) {
            return new Eth(transport);
        } else {
            return new Btc(transport);
        }
    }
}
export {
    LedgerTransport
}