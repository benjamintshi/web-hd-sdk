import { CoinType } from '../model/utils';
import { LedgerTransaction } from './transaction';
import { LedgerLogic } from './logic';
import { LedgerExport } from './export';
import { AddressParam } from '../model/hd';
class LedgerControler {
    private coin_type: string;
    private derivation_path: string;
    private network_type: string;
    private transaction?: LedgerTransaction;
    private export?: LedgerExport;
    private logic?: LedgerLogic;
    constructor(coinType: string, derivationPath: string, networkType: string) {
        this.coin_type = coinType;
        this.derivation_path = derivationPath;
        this.network_type = networkType;
    }
    public async signTransaction(data: any): Promise<any> {
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
    public async getCoinAddressList(param: AddressParam): Promise<any> {
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