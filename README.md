# Daily Block Explorer

This project uses [Next.js](https://nextjs.org/) to provide the following features:

- Server Side Rendering of React pages (SEO)
- Client Side Updating of React Pages
- API can be deployed as serverless function or Node.js container image
- Very fast UI

## Starting a Private Daily Testnet

This project uses docker images of the following:

- [Daily-Node](https://github.com/dailycrypto-me/daily-node)
- [MongoDB](https://www.mongodb.com)

Run Everything:

```
docker-compose up --build
```

Note: The Daily-config container must start up and write the config first before the other containers will start correctly. You may see some errors at first as services restart, until that config file is written.

1. This will generate a unique Daily config and start a Daily node
2. MongoDB will be running on port 27017
3. Daily Explorer will be running at [http://localhost:3000](http://localhost:3000)
4. Daily Explorer Blockchain Sync daemon will start syncing the chain data to MongoDB
5. Daily Explorer Websocket Service will start, providing real time data to the UI

## Generating blockchain transactions, blocks, etc

Daily does not create blocks if there are no transactions happening on the network. In order to see blocks or any other activity, you will need to create transactions on the network.

### Configure MetaMask or Brave Browser

- Create custom RPC named `Daily Testnet`, at `http://127.0.0.1:7777`
- Set chain id to `7777777`

### Using the faucet to generate transactions

You can paste the address from MetaMask or Brave into the faucet page of the Explorer and receive tokens every few seconds

### Configure Remix IDE

- Open [Remix IDE](https://remix.ethereum.org)
- Compile sample contract
- Configure environment `Injected Web3`
- Use funded MetaMask wallet to deploy contracts
