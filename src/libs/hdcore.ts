
/**
 * 
 */
import { Result, HDType } from './model/utils';
import { LedgerControler } from './ledger/index';
import { TrezorControler } from './trezor/index';
import { AddressParam } from './model/hd';

export class HdCore {
    private device_name: string;
    private ledger: LedgerControler;
    private trezor: TrezorControler;
    constructor(deviceName: string, coinType: string, derivationPath: string) {
        this.device_name = deviceName;
        this.ledger = new LedgerControler(coinType, derivationPath);
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
    public async getWalletAddress(param:AddressParam): Promise<Result> {
        let resp: Result = {};
        switch (this.device_name) {
            case HDType.LEDGER:
                resp = await this.ledger.getCoinAddressList(param);
                break;
            case HDType.TREZOR:

                break;
        }
        return resp;
    }
}


