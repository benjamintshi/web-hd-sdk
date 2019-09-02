
import { CoinType } from '../model/utils';
import { LedgerTransaction } from './transaction';
import { LedgerLogic } from './logic';
import { LedgerAddress } from './address';
import { AddressParam } from '../model/hd';
class LedgerControler {
    private coin_type: string;
    private derivation_path: string;
    private transaction?: LedgerTransaction;
    private address?: LedgerAddress;
    private logic?: LedgerLogic;
    constructor(coinType: string, derivationPath: string) {
        this.coin_type = coinType;
        this.derivation_path = derivationPath;
    }
    public async signTransaction(data: any): Promise<any> {
        debugger
        this.logic = new LedgerLogic(this.coin_type);
        const entity: any = await this.logic.getLedgerEntity(data);
        this.transaction = new LedgerTransaction(this.coin_type);
        switch (this.coin_type) {
            case CoinType.ETH:
                return await this.transaction.signEth(data.input.path, entity);
            case CoinType.BTC:
                debugger
                return await this.transaction.signBtc(entity);
        }
    }
    public async getCoinAddressList(param: AddressParam): Promise<any> {
        this.address = new LedgerAddress(this.derivation_path, this.coin_type);
        switch (this.coin_type) {
            case CoinType.ETH:
                return await this.address.getEthAddress(param);
            case CoinType.BTC:
                return await this.address.getBtcAddress(param);
        }
    }

}
export {
    LedgerControler
} 