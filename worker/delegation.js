#!/usr/bin/env node

const config = require('config');
const BN = require('bn.js');
const Web3 = require('web3');
const RLP = require('rlp');
const { useDb } = require('../lib/db');
const { sleep } = require('../lib/timing');

const SLEEP_SECONDS = 10;

async function worker() {
  const { Delegate } = await useDb();

  const delegates = await Delegate.find({
    status: 'QUEUED',
  }).sort({
    createdAt: 1,
  });
  if (delegates.length === 0) {
    console.log('No delegation requests!');
    return await sleep(SLEEP_SECONDS);
  }

  for (let delegate of delegates) {
    console.log('Processing delegation', delegate);
    const hasCounterpart = delegate.counterpart !== '0x0000000000000000000000000000000000000000';

    const valueToAdd = new BN(delegate.valueToAdd);
    const valueToSubstract = new BN(delegate.valueToSubstract);

    let status = 'FINISHED';

    if (valueToAdd.gtn(0)) {
      console.log('Delegating to', delegate.node, 'value', valueToAdd.toString());

      try {
        if (hasCounterpart) {
          console.log('- own node', delegate.counterpart);
          await delegateTransaction(delegate.counterpart, valueToAdd.mul(new BN(2)));
        }
        console.log('- user node', delegate.node);
        await delegateTransaction(delegate.node, valueToAdd);
      } catch (e) {
        console.error(e);
        status = 'ERROR';
      }
    }

    if (valueToSubstract.gtn(0)) {
      console.log('Undelegating from', delegate.node, 'value', valueToSubstract.toString());

      try {
        if (hasCounterpart) {
          console.log('- own node', delegate.counterpart);
          await undelegateTransaction(delegate.counterpart, valueToSubstract.mul(new BN(2)));
        }
        console.log('- user node', delegate.node);
        await undelegateTransaction(delegate.node, valueToSubstract);
      } catch (e) {
        console.error(e);
        status = 'ERROR';
      }
    }

    await Delegate.findOneAndUpdate(
      { _id: delegate._id },
      {
        valueToAdd: '0',
        valueToSubstract: '0',
        status: status,
      },
    );
    await sleep(SLEEP_SECONDS);
  }
}

async function delegateTransaction(address, value) {
  await sendTransaction(`0x${bufferToHex(RLP.encode([[address, [value, 0]]]))}`);
}

async function undelegateTransaction(address, value) {
  await sendTransaction(`0x${bufferToHex(RLP.encode([[address, [value, 1]]]))}`);
}

async function sendTransaction(input) {
  const { FaucetNonce } = await useDb();
  const daily = new Web3(config.daily.node.http);
  const account = daily.eth.accounts.privateKeyToAccount(config.faucet.privateKey);
  const faucetNonce = await FaucetNonce.findOneAndUpdate(
    {},
    { $inc: { nonce: 1 } },
    { upsert: true, new: true },
  );
  const tx = await account.signTransaction({
    from: account.address,
    to: '0x00000000000000000000000000000000000000ff',
    value: 0,
    gas: 30000,
    gasPrice: 0,
    nonce: faucetNonce.nonce - 1,
    input,
  });

  await new Promise((resolve, reject) => {
    daily.eth
      .sendSignedTransaction(tx.rawTransaction)
      .on('transactionHash', (txHash) => {
        waitForTransaction(daily, txHash).then(() => {
          resolve(txHash);
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

function bufferToHex(buffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function waitForTransaction(web3, txnHash, options = null) {
  const interval = options && options.interval ? options.interval : 500;
  const transactionReceiptAsync = async function (txnHash, resolve, reject) {
    try {
      var receipt = web3.eth.getTransactionReceipt(txnHash);
      if (!receipt) {
        setTimeout(function () {
          transactionReceiptAsync(txnHash, resolve, reject);
        }, interval);
      } else {
        resolve(receipt);
      }
    } catch (e) {
      reject(e);
    }
  };

  return new Promise(function (resolve, reject) {
    transactionReceiptAsync(txnHash, resolve, reject);
  });
}

const main = async () => {
  console.log('Delegation worker started');
  while (true) {
    await worker();
  }
};

(async () => {
  try {
    await main();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
