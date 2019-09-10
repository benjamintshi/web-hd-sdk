import { CoinType } from '../model/utils';
import { LedgerTransaction } from './transaction';
import { LedgerLogic } from './logic';
import { LedgerExport } from './export';
import { AddressParam } from '../model/hd';
import { writeInfoLog } from '../common/logger';
class LedgerControler {
    private coin_type: string;
    private derivation_path: string;
    private network_type: string;
    private transaction?: LedgerTransaction;
    private export?: LedgerExport;
    private logic?: LedgerLogic;
    /**
     * 控制器：交易签名、地址导出
     * @param coinType 
     * @param derivationPath 账户级path
     * @param networkType 主网：mainnet，测试网：testnet
     */
    constructor(coinType: string, derivationPath: string, networkType: string) {
        this.coin_type = coinType;
        this.derivation_path = derivationPath;
        this.network_type = networkType;
        writeInfoLog(`初始化ledger控制器：交易签名、地址导出`);
    }
    /**
     * 交易签名暴露接口函数根据币种类型对应签名
     * @param data 
     */
    public async signTransaction(data: any): Promise<any> {
        writeInfoLog(`ledger交易签名统一入口.`);
        this.logic = new LedgerLogic(this.coin_type);
        const entity: any = await this.logic.getLedgerEntity(data);
        this.transaction = new LedgerTransaction(this.coin_type);
        switch (this.coin_type) {
            case CoinType.ETH:
                return await this.transaction.signEth(data.input.path, entity);
            case CoinType.BTC:
            case CoinType.BCH:
            case CoinType.LTC:
                return await this.transaction.signBtcSeries(entity,data.utxos);
        }
    }
    /**
     * 地址推导暴露接口函数根据币种类型
     * @param param 
     */
    public async getCoinAddressList(param: AddressParam): Promise<any> {
        writeInfoLog(`ledger地址导出统一入口.`);
        this.export = new LedgerExport(this.derivation_path, this.coin_type, this.network_type);
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
    LedgerControler
} 