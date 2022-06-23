export const name = 'EOS Issuance';
export const version = '0.1.0';
export const license = 'MIT';

export function setup(sdk: Context) {
  const getIssuance = async () => {
    const [currencyStats, global4, price] = await Promise.all([
      sdk.http.post('https://eos.api.eosnation.io/v1/chain/get_currency_stats', { code: "eosio.token", symbol: "EOS" }),
      sdk.http.post('https://eos.api.eosnation.io/v1/chain/get_table_rows', { code: "eosio", scope: "eosio", table: "global4", json: true }),
      sdk.coinGecko.getCurrentPrice('eos'),
    ])
    const supply = currencyStats.EOS.supply.split(" ")[0];
    return Number(global4.rows[0].continuous_rate) * supply / 365 * price;
  }

  const getIssuanceRate = async () => {
    const global4 = await sdk.http.post('https://eos.api.eosnation.io/v1/chain/get_table_rows', { code: "eosio", scope: "eosio", table: "global4", json: true })
    return Number(global4.rows[0].continuous_rate);
  }

  sdk.register({
    id: 'eos',
    queries: {
      issuance7DayAvgUSD: getIssuance,
      issuanceRateCurrent: getIssuanceRate,
    },
    metadata: {
      name: 'EOS',
      category: 'l1',
      icon: sdk.ipfs.getDataURILoader('QmZHzJNSGrQM5CcNUjLSqr5iogcoXwgGMmsnN9VRSeQAna', 'image/svg+xml'),
      description: 'EOS is a high-throughput smart-contract blockchain',
      issuanceDescription: 'EOS is issued to block producers & savings',
      source: 'https://eosnetwork.com',
      tokenTicker: 'EOS',
      tokenCoingecko: 'eos',
      website: 'https://eosnetwork.com',
    },
  })
}
