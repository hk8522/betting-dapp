import Web3 from 'web3'
import {store} from '../store/'

let pollWeb3 = function (state) {
  var ethereum = window.ethereum
  var web3 = new Web3(ethereum)

  setInterval(async () => {
    if (web3 && store.state.web3.web3Instance) {
      await web3.eth.getCoinbase((err, coinbase) => {
        if (err !== null) {
          console.log('err', err)
        } else {
          if (coinbase !== store.state.web3.coinbase) {
            let newCoinbase = coinbase
            web3.eth.getBalance(coinbase, function (err, newBalance) {
              if (err) {
                console.log(err)
              } else {
                store.dispatch('pollWeb3', {
                  coinbase: newCoinbase,
                  balance: parseInt(newBalance, 10)
                })
              }
            })
          } else {
            web3.eth.getBalance(store.state.web3.coinbase, (err, polledBalance) => {
              if (err) {
                console.log(err)
              } else if (parseInt(polledBalance, 10) !== store.state.web3.balance) {
                store.dispatch('pollWeb3', {
                  coinbase: store.state.web3.coinbase,
                  balance: polledBalance
                })
              }
            })
          }
        }
      })
    }
  }, 500)
}

export default pollWeb3
