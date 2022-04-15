import Web3 from 'web3'

/*
* 1. Check for injected web3 (mist/metamask)
* 2. If metamask/mist create a new web3 instance and pass on result
* 3. Get networkId - Now we can check the user is connected to the right network to use our dApp
* 4. Get user account from metamask
* 5. Get user balance
*/

let getWeb3 = new Promise(async function (resolve, reject) {
  // Check for injected web3 (mist/metamask)
  var ethereum = window.ethereum
  if (typeof ethereum !== 'undefined') {
    try {
      // Request account access if needed
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      // const accounts = await ethereum.request({ method: 'eth_accounts' })
      // Acccounts now exposed
      console.log('accounts', accounts)
    } catch (error) {
      // User denied account access...
    }
    var web3 = new Web3(ethereum)
    resolve({
      injectedWeb3: web3.isConnected(),
      web3 () {
        return web3
      }
    })

    // var params = [
    //   {
    //     from: '0x9eF4289A58a29818C2fBBf504A18D69D098502B6',
    //     to: '0x9eF4289A58a29818C2fBBf504A18D69D098502B6',
    //     gas: '0x76c0', // 30400
    //     gasPrice: '0x9184e72a000', // 10000000000000
    //     // value: '0x9184e72a', // 2441406250
    //     value: '0x74000000000000',
    //     data:
    //       '0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675'
    //   }
    // ]
    // ethereum
    //   .request({
    //     method: 'eth_sendTransaction',
    //     params
    //   })
    //   // .then((result) => {
    //   //   // The result varies by RPC method.
    //   //   // For example, this method will return a transaction hash hexadecimal string on success.
    //   // })
    //   .catch((error) => {
    //     // If the request fails, the Promise will reject with an error.
    //     console.log(error)
    //   })
  } else {
    // web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545')) GANACHE FALLBACK
    reject(new Error('Unable to connect to Metamask'))
  }
})
  .then(result => {
    return new Promise(function (resolve, reject) {
      // Retrieve network ID
      result.web3().version.getNetwork((err, networkId) => {
        if (err) {
          // If we can't find a networkId keep result the same and reject the promise
          reject(new Error('Unable to retrieve network ID'))
        } else {
          // Assign the networkId property to our result and resolve promise
          result = Object.assign({}, result, {networkId})
          resolve(result)
        }
      })
    })
  })
  .then(result => {
    return new Promise(function (resolve, reject) {
      // Retrieve coinbase
      result.web3().eth.getCoinbase((err, coinbase) => {
        if (err) {
          reject(new Error('Unable to retrieve coinbase'))
        } else {
          result = Object.assign({}, result, { coinbase })
          resolve(result)
        }
      })
    })
  })
  .then(result => {
    return new Promise(function (resolve, reject) {
      // Retrieve balance for coinbase
      result.web3().eth.getBalance(result.coinbase, (err, balance) => {
        if (err) {
          reject(new Error('Unable to retrieve balance for address: ' + result.coinbase))
        } else {
          result = Object.assign({}, result, { balance })
          resolve(result)
        }
      })
    })
  })

export default getWeb3
