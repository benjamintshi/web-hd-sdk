### web-hd-sdk
> web-hd-sdk 主要集成了ledger和trezor两个硬件在web项目中签名，目前支持btc、eth （开发中.）。

#### Installing
For the latest stable version:
```
npm install web-hd-sdk

```
#### 使用是说明
### 一、ETH-签名
```
import {HdCore} from 'web-hd-sdk';
const hd = new HdCore(this.entity.deviceName, this.entity.coinName,source_data.input.path);
const data = {
  "chainId": "3",
  "gasLimit": 30000,
  "gasPrice": 1000000000,
  "input": {
    "address": "0x3d6501f741b00afb3efca3928b22d0551c77b785",
    "path": "m/44'/60'/72'/0/1"
  },
  "nonce": 5,
  "toAddress": "0x87da9eceb42a8a0c23e6058447ff301da5f5f8a9",
  "txnCoinNum": 1.2
};
try {
    const res = await hd.signTransaction(data);
    console.log(res)
} catch (e) {
    console.log(e.message);
}
```
####返回结果

```
res = {
    success: true,
    message: "",
    v: "",
    r: "",
    s: "",
};
```
### 二、BTC-签名
```
import {HdCore} from 'web-hd-sdk';
const hd = new HdCore(this.entity.deviceName, this.entity.coinName,source_data.input.path);
const data = {
  "input": {
    "address": "muJhWgBWKDaigLaoi3DLWQJZvDm2xZ7Zb7",
    "paths": [
      {
        "addressPublicKey": "",
        "addressType": "",
        "path": "m/44'/1'/72'/0/2",
        "xpub": ""
      }
    ],
    "requires": 1,
    "signIndex": 0
  },
  "outputs": [
    {
      "address": "muHguY8uX6xNStgCk48gummL841DVnFiFt",
      "coinNum": 0.2,
      "isScript": false,
      "outputType": 10,
      "sequence": 0
    },
    {
      "address": "muJhWgBWKDaigLaoi3DLWQJZvDm2xZ7Zb7",
      "coinNum": 0.07842285,
      "isScript": false,
      "outputType": 11,
      "sequence": 1
    }
  ],
  "utxos": [
    {
      "coinNum": 0.13960399,
      "index": 1,
      "sequence": 0,
      "txid": "0073c6242c08d739635ed0b213b926a7926189b952079828cb05d0137a65ab19"
    },
    {
      "coinNum": 0.13882886,
      "index": 0,
      "sequence": 1,
      "txid": "60347cc6928e6471d55f3a86d67ace6908fa3a762da43fc86780158dc77d41eb"
    }
  ]
};
try {
    const res = await hd.signTransaction(data);
    console.log(res)
} catch (e) {
    console.log(e.message);
}
```
####返回结果

```
res = {
    success: true,
    message: "",
    signatures: "",
    version: ""
};
```

