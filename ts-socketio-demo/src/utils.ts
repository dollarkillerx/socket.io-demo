import * as CryptoJS from 'crypto-js';

const util = {
    /**
     * 加密
     * @param handshake 密钥
     * @param encryp 要加密的内容
     * @return 返回加密后的 Base64 字符串
     */
    encryp: function (handshake: string, encryp: object | string): string | void {
        try {
            // 确保要加密的数据是字符串格式
            encryp = JSON.stringify(encryp);

            // 将 handshake 和要加密的数据转换为二进制格式
            const handshakeUtf8 = CryptoJS.enc.Utf8.parse(handshake);
            const encrypUtf8 = CryptoJS.enc.Utf8.parse(encryp);

            // 使用 AES 加密
            const encrypted = CryptoJS.AES.encrypt(encrypUtf8, handshakeUtf8, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            });

            // 将加密后的数据转换为 Base64 字符串
            return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
        } catch (e: any) {
            console.log("[error] 加密异常->", e.name, e.message);
        }
    },

    /**
     * 解密
     * @param handshake 密钥
     * @param decrypt 要解密的 Base64 字符串
     * @return 返回解密后的 UTF-8 字符串
     */
    decrypt: function (handshake: string, decrypt: string): string | void {
        try {
            // 将 handshake 转换为二进制格式
            const handshakeUtf8 = CryptoJS.enc.Utf8.parse(handshake);

            // 使用 AES 解密
            const decrypted = CryptoJS.AES.decrypt(decrypt, handshakeUtf8, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            });

            // 将解密后的数据转换为 UTF-8 字符串
            return decrypted.toString(CryptoJS.enc.Utf8);
        } catch (e: any) {
            console.log("[error] 解密异常->", e.name, e.message);
        }
    },

    /**
     * 生成 GUID
     * @return 返回一个随机生成的 GUID
     */
    guid: function (): string {
        return 'yxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
};

export default util;
