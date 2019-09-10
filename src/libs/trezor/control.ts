import { TrezorLogic } from "./logic";
import { TrezorTransaction } from "./transaction"
import { CoinType } from "../model/utils"
import { TrezorExport } from './export';
import { AddressParam } from '../model/hd';
import { writeInfoLog } from "../common/logger";
class TrezorControler {
    private transaction: TrezorTransaction;
    private coin_type: string;
    private logic?: TrezorLogic;
    private derivation_path: string;
    private export?: TrezorExport;
    private network_type: string;
    constructor(coinType: string, derivationPath: string, networkType: string) {
        this.transaction = new TrezorTransaction(coinType);
        this.coin_type = coinType;
        this.derivation_path = derivationPath;
        this.network_type = networkType;
        writeInfoLog(`初始化ledger控制器：交易签名、地址导出`);
    }

    public async signTransaction(data: any): Promise<any> {
        writeInfoLog(`trezor交易签名统一入口.`);
        this.logic = new TrezorLogic(this.coin_type);
        const entity: any = await this.logic.getTrezorEntity(data);
        switch (this.coin_type) {
            case CoinType.ETH:
                return await this.transaction.EthSign(entity);
            case CoinType.BTC:
            case CoinType.BCH:
            case CoinType.LTC:
                return await this.transaction.BtcSeriesSign(entity, data.utxos);
            default:
                return await this.transaction.BtcSeriesSign(entity, data.utxos);
        }
    }
    public async getCoinAddressList(param: AddressParam): Promise<any> {
        writeInfoLog(`trezor地址导出统一入口.`);
        this.export = new TrezorExport(this.derivation_path, this.coin_type, this.network_type);
        switch (this.coin_type) {
            case CoinType.ETH:
                return await this.export.exportEthAddress(param);
            case CoinType.BTC:
            case CoinType.BCH:
            case CoinType.LTC:
                return await this.export.exportBtcSeriesAddress(param);
        }
    }
}

export {
    TrezorControler
}
