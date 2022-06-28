export const name = 'Solana Issuance';
export const version = '0.3.0';
export const license = 'MIT';

export function setup(sdk: Context) {
  const getSolanaIssuance = async () => {
    const [supplyResult, inflationResult, solPrice] = await Promise.all([
      sdk.http.post('https://api.mainnet-beta.solana.com', { jsonrpc: "2.0", id: 1, method: "getSupply" }),
      sdk.http.post('https://api.mainnet-beta.solana.com', { jsonrpc: "2.0", id: 1, method: "getInflationRate" }),
      sdk.coinGecko.getCurrentPrice('solana'),
    ])

    return inflationResult.result.total * supplyResult.result.value.total / 1e9 / 365 * solPrice;
  }

  const getIssuanceRate = async () => {
    const inflationRate = await sdk.http.post('https://api.mainnet-beta.solana.com', { jsonrpc: "2.0", id: 1, method: "getInflationRate" });
    return inflationRate.result.total;
  }

  sdk.register({
    id: 'solana',
    queries: {
      issuance7DayAvgUSD: getSolanaIssuance,
      issuanceRateCurrent: getIssuanceRate,
    },
    metadata: {
      name: 'Solana',
      category: 'l1',
      icon: sdk.ipfs.getDataURILoader('QmXcXaQ5GGBBQb7cgrn6SySZVWoiniwYkc3DrjgUKVt5ky', 'image/svg+xml'),
      description: 'Solana is a high-throughput smart-contract blockchain',
      issuanceDescription: 'SOL is issued to validators',
      source: 'Solana.FM',
      tokenTicker: 'SOL',
      tokenCoingecko: 'solana',
      website: 'https://solana.com',
    },
  })
}
