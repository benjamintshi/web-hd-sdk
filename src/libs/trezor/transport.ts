import TrezorConnect from 'trezor-connect';
import { writeInfoLog } from '../common/logger';


writeInfoLog(`初始化硬件连接对象.`);

TrezorConnect.manifest({
    email: 'xiongjie@invault.io',
    appUrl: 'https://localhost'
});

export {
    TrezorConnect
};