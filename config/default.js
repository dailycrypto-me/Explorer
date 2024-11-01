module.exports = {
  nodeConfigPath: process.env.NODE_CONFIG_PATH || '/opt/daily/conf/daily.json',
  faucet: {
    enabled: process.env.NEXT_PUBLIC_FAUCET_ENABLED === 'false',
    maxUnconfirmed: Number(process.env.MAX_UNCONFIRMED) || 5000,
    //default address 0xde2b1203d72d3549EE2f733b00b2789414C7Cea5
    dripInterval: Number(process.env.DRIP_INTERVAL_MS) || 500,
    privateKey:
      process.env.FAUCET_PRIV_KEY ||
      '0x853d833ba84c5fc50980956cdb94926a1519876fda2c2ffb1b5e9899f8bf0d5f',
  },
  delegate: {
    trustedAddress:
      process.env.DELEGATE_TRUSTED_ADDRESS || '0x5df3b8e6b96e59099d16252a55f87ac34767806c',
    ownNodes: process.env.DELEGATION_OWN_NODES || null,
  },
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/explorer',
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      keepAlive: true,
      useFindAndModify: false,
      autoIndex: false,
    },
  },
  daily: {
    node: {
      http: process.env.RPC_HTTP_PROVIDER || 'http://localhost:7777',
      ws: process.env.RPC_WS_PROVIDER || 'ws://localhost:8777',
    },
  },
  appsignal: {
    name: process.env.APPSIGNAL_PROJECT_NAME,
    pushApiKey: process.env.APPSIGNAL_PUSH_API_KEY,
    active:
      Boolean(process.env.APPSIGNAL_PROJECT_NAME) && Boolean(process.env.APPSIGNAL_PUSH_API_KEY),
  },
  jobQueue: {
    maxConcurrency: 20,
    defaultConcurrency: 5,
    db: { address: process.env.MONGO_URI || 'mongodb://0.0.0.0:27017/explorer' },
  },
};
