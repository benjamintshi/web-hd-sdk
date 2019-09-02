
class BtcUtil{
    private  HD_HARDENED:number;
    constructor(){
        this.HD_HARDENED = 0x80000000
    }
    private toHardened (n) {
        return (n | this.HD_HARDENED) >>> 0;
    }
    private  fromHardened  (n) {
        return (n & ~this.HD_HARDENED) >>> 0;
    }
    public getHDPath (path) {
        var parts = path.toLowerCase().split('/');
        if (parts[0] !== 'm')
            throw "PATH_NOT_VALID";
        return parts.filter(function (p) {
            return p !== 'm' && p !== '';
        })
            .map(function (p) {
                var hardened = false;
                if (p.substr(p.length - 1) === "'") {
                    hardened = true;
                    p = p.substr(0, p.length - 1);
                }
                var n = parseInt(p);
                if (isNaN(n)) {
                    console.log('Not a valid path.');
                }
                else if (n < 0) {
                    console.log('Path cannot contain negative values.');
                }
                if (hardened) { // hardened index
                    n = this.toHardened(n);
                }
                return n;
            });
    }

}

// //返回路径数组
// BtcUtil.pathArray = function (path) {
//     let depth = 3;
//     path = path.replace(new RegExp("'", 'gm'), "");
//     let depthArray = path.split("/");
//     //第一位是m时从路径数组中移除
//     if (Number.isNaN(Number.parseInt(depthArray[0]))) {
//         depthArray.splice(0, 1);
//     }
//     let pathArray = [];
//     depthArray.forEach(data => {
//         pathArray.push(Number.parseInt(data));
//     });
//     for (let i = 0; i < depth; i++) {
//         pathArray[i] = pathArray[i] | 0x80000000;
//     }
//     return pathArray;
// };




export {
    BtcUtil
};
