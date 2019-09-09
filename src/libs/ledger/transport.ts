import "babel-polyfill";
import { CoinType } from '../model/utils';
import { writeInfoLog } from "../common/logger";
const TransportWebUSB = require('@ledgerhq/hw-transport-webusb').default;
const TransportU2F = require('@ledgerhq/hw-transport-u2f').default;
const platform = require('platform');
const Btc = require('@ledgerhq/hw-app-btc').default;
const Eth = require('@ledgerhq/hw-app-eth').default;
class LedgerTransport {
    private OPEN_TIMEOUT: number = 10000;
    private LISTENER_TIMEOUT: number = 30000;
    private coin_type: string;
    /**
     * 硬件连接对象
     * @param coinType 
     */
    constructor(coinType: string) {
        this.coin_type = coinType;
        writeInfoLog(`初始化硬件连接对象.`);
    }
    /**
     * 是否支持webusb链接
     */
    private async isWebUsbSupported(): Promise<boolean> {
        const isSupport = await TransportWebUSB.isSupported();
        writeInfoLog(`当前系统：${platform.name}，是否支持webusb链接:${isSupport && platform.os.family !== 'Windows' && platform.name !== 'Opera'}`);
        return (
            isSupport && platform.os.family !== 'Windows' && platform.name !== 'Opera'
        );
    }
    /**
     * 获取Ledger硬件链接对象
     */
    public async getTransport(): Promise<any> {
        try {
            writeInfoLog(`获取${this.coin_type}硬件链接对象.`)
            const support: boolean = await this.isWebUsbSupported();
            let transport: any = support ? await TransportWebUSB.create() : await TransportU2F.create(this.OPEN_TIMEOUT, this.LISTENER_TIMEOUT);
            if (this.coin_type === CoinType.ETH) {
                return new Eth(transport);
            } else {
                return new Btc(transport);
            }
        } catch (error) {
            throw new Error(`获取Ledger硬件链接对象失败，错误信息：${error.message}`);
        }
    }
}
export {
    LedgerTransport
}