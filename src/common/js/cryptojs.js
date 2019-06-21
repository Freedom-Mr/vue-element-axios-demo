import { debug } from 'util';
// import CryptoJS from 'crypto-js/crypto-js'
const CryptoJS = require('crypto-js')

//（对称加密）AES、DES        （非对称加密）RSA、DSA
// 默认的 KEY 与 iv 如果没有给
const KEY_M = CryptoJS.enc.Utf8.parse('abcdef0123456789')
const IV_M = CryptoJS.enc.Utf8.parse('abcdef0123456789')
/**
 * AES加密 ：字符串 key iv  返回base64
 */
export function Encrypt (word, keyStr, ivStr) {
  let key = KEY_M
  let iv = IV_M

  if (keyStr) {
    key = CryptoJS.enc.Utf8.parse(keyStr)
    iv = CryptoJS.enc.Utf8.parse(ivStr)
  }
  var context = JSON.stringify(word);
  var encrypted = CryptoJS.AES.encrypt(context, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC, // CBC是工作模式，DES一共有电子密码本模式（ECB）、加密分组链接模式（CBC）、加密反馈模式（CFB）和输出反馈模式（OFB）四种模式
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}
/**
 * AES 解密 ：字符串 key iv  返回base64
 *
 */
export function Decrypt (word, keyStr, ivStr) {
  let key = KEY_M
  let iv = IV_M

  if (keyStr) {
    key = CryptoJS.enc.Utf8.parse(keyStr)
    iv = CryptoJS.enc.Utf8.parse(ivStr)
  }
  var decrypted = CryptoJS.AES.decrypt(word, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
