// import { Transaction } from './libs/transaction';
// import { EthEntity } from './libs/common/utils';
// import { toHex, numberToHex } from 'web3-utils';
// import { data } from './libs/data/eth';
// import { convert } from 'ethereumjs-units';

// (async function () {
//     const tx = new Transaction("ledger", "eth");
//     const entity: EthEntity = {
//         nonce: numberToHex(data.nonce),
//         gasPrice: numberToHex(data.gasPrice),
//         gasLimit: numberToHex(data.gasLimit),
//         to: toHex(data.toAddress),
//         value: numberToHex(convert('1', 'eth', 'wei')),
//         data: toHex(''),
//         chainId: numberToHex(data.chainId)
//     };
//     //console.log(entity);
//     const res = await tx.signTransaction(entity);
//     console.log(res);
// }());
export * from "./libs/hdcore";
export * from "./libs/common/utils";

// (async function () {
//     const tx = new Transaction("ledger", "eth", "m/44'/60'/72'/0/1");
//     const res = await tx.getOutputScript({
//         utxos: [
//             {
//                 coinNum: 0.13960399,
//                 index: 1,
//                 sequence: 0,
//                 txtId: "0073c6242c08d739635ed0b213b926a7926189b952079828cb05d0137a65ab19"
//             },
//             {
//                 coinNum: 0.13882886,
//                 index: 0,
//                 sequence: 1,
//                 txtId: "60347cc6928e6471d55f3a86d67ace6908fa3a762da43fc86780158dc77d41eb"
//             }
//         ]
//     });
//     console.log(res);
// }());