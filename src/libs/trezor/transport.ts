import TrezorConnect from 'trezor-connect';

/**
 ExTrezorManager 扩展对象
 钱包:Ledger
 */
TrezorConnect.manifest({
    email: 'xiongjie@invault.io',
    appUrl: 'https://localhost'
});

export {
    TrezorConnect
};