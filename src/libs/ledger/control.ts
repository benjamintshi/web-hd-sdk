
import { CoinType } from '../common/utils';
import { LedgerTransport } from './transport'
import { LedgerTransaction } from './transaction'
import { LedgerLogic } from './logic';

class LedgerControler {
    private coin_type: string;
    private transport: LedgerTransport;
    private transaction: LedgerTransaction;
    private logic: LedgerLogic;
    constructor(coinType: string) {
        this.coin_type = coinType;
        this.transport = new LedgerTransport(coinType);
        this.transaction = new LedgerTransaction();
        this.logic = new LedgerLogic(coinType);
    }
    public async signTransaction(data: any): Promise<any> {
        const transport: any = await this.transport.getTransport();
        const entity: any = await this.logic.getLedgerEntity(data);
        switch (this.coin_type) {
            case CoinType.ETH:
                return await this.transaction.signEth(data.input.path, entity, transport);
            case CoinType.BTC:

                return await this.transaction.signBtc(entity, transport);
        }
    }
}
export {
    LedgerControler
} 