// config.jsは自作しよう
var config = require('./config');

module.exports = {
    // 本番環境ならfalse
    dev: config.dev,
    // 本番環境なら、SSL証明書のkeyファイルとcrtファイルを配置
    key: config.key,
    crt: config.crt
}
