const trezor = require('trezor-connect');
/**
 ExTrezorManager 扩展对象
 钱包:Ledger
 */
trezor.manifest({
    email: 'xiongjie@invault.io',
    appUrl: 'https://localhost'
});

export {
    trezor
};