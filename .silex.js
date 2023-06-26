const dash = require('@silexlabs/silex-dashboard')
module.exports = async function (config) {
    await config.addPlugin(dash)
}