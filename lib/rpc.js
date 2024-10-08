const axios = require('axios');
const config = require('config');

function request(name, params = [], id = 0) {
  return {
    jsonrpc: '2.0',
    id,
    method: name,
    params: params,
  };
}

async function send(request) {
  const response = await axios.post(config.daily.node.http, request);
  return response.data?.result || {};
}

async function netVersion() {
  return send(request('net_version'));
}

async function netPeerCount() {
  return send(request('net_peerCount'));
}

async function getBlockByHash(hash, fullTransactions = false) {
  return send(request('eth_getBlockByHash', [hash, fullTransactions]));
}

async function getBlockByNumber(number, fullTransactions = false) {
  return send(request('eth_getBlockByNumber', [number.toString(16), fullTransactions]));
}

async function blockNumber() {
  return send(request('eth_blockNumber', []));
}

async function dagBlockLevel() {
  return send(request('daily_dagBlockLevel', []));
}

async function getDagBlockByHash(hash, fullTransactions = false) {
  return send(request('daily_getDagBlockByHash', [hash, fullTransactions]));
}

async function dagBlockPeriod() {
  return send(request('daily_dagBlockPeriod', []));
}

async function getDagBlocksByLevel(level, fullTransactions = false) {
  return send(request('daily_getDagBlockByLevel', [level.toString(16), fullTransactions]));
}

async function getScheduleBlockByPeriod(period) {
  return send(request('daily_getScheduleBlockByPeriod', [period.toString(16)]));
}

async function getTransactionByHash(hash) {
  return send(request('eth_getTransactionByHash', [hash]));
}

async function getTransactionReceipt(hash) {
  return send(request('eth_getTransactionReceipt', [hash]));
}

module.exports = {
  request,
  send,
  netVersion,
  netPeerCount,
  getBlockByHash,
  getBlockByNumber,
  blockNumber,
  dagBlockLevel,
  dagBlockPeriod,
  getDagBlockByHash,
  getDagBlocksByLevel,
  getScheduleBlockByPeriod,
  getTransactionByHash,
  getTransactionReceipt,
};
