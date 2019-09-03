
class Utils {
    public static toHexInt(number: number): string {
        return (
            this.toHexDigit((number >> 24) & 0xff) +
            this.toHexDigit((number >> 16) & 0xff) +
            this.toHexDigit((number >> 8) & 0xff) +
            this.toHexDigit(number & 0xff)
        );
    }

    public static toHexDigit(number: number): string {
        const digits = '0123456789abcdef';
        return digits.charAt(number >> 4) + digits.charAt(number & 0x0f);
    }

    public static parseHexString(str: string): Array<any> {
        const result: Array<any> = new Array<any>();
        while (str.length >= 2) {
            result.push(parseInt(str.substring(0, 2), 16));
            str = str.substring(2, str.length);
        }
        return result
    }

    public static getCompressPublicKey(publicKey: string): string {
        let index: string;
        if (publicKey.substring(0, 2) !== "04") {
            return publicKey;
        }
        if (parseInt(publicKey.substring(128, 130), 16) % 2 !== 0) {
            index = "03";
        } else {
            index = "02";
        }
        return index + publicKey.substring(2, 66);
    }
    // public static getNetworkBySymbol(coinNum:string): any {
    //     //const networkId: any = Object.keys(networks).find((id: string): any => networks[id].unit === this.coin_type.toUpperCase())
    //     const networkId: any = Object.keys(networks).find((id: string): any => id === coinNum)
    //     return networks[networkId];
    // }
}

export {
    Utils
}
