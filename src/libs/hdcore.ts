
/**
 * 
 */
import { Result, HDType } from './common/utils';
import { LedgerControler } from './ledger/index';
import { TrezorControler } from './trezor/index';

export class HdCore {
    private device_name: string;
    private ledger: LedgerControler;
    private trezor: TrezorControler;
    constructor(deviceName: string, coinType: string) {
        this.device_name = deviceName;
        this.ledger = new LedgerControler(coinType);
        this.trezor = new TrezorControler(coinType);
    }
    public async signTransaction(entity: any): Promise<Result> {
        let signed: Result = {};
        switch (this.device_name) {
            case HDType.LEDGER:
                signed = await this.ledger.signTransaction(entity);
                break;
            case HDType.TREZOR:

                break;
        }
        return signed;
    }
}


