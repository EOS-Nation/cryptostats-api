export const name = 'EOS Fees';
export const version = '0.1.1';
export const license = 'MIT';

export function setup(sdk: Context) {
  const getFees = async () => {
    const [communityFunds, price] = await Promise.all([
      sdk.http.get("https://eosauthority.com/api/spa/rex/communityfunds?network=eos", { headers: { 'user-agent': "CryptoStats" }}),
      sdk.coinGecko.getCurrentPrice('eos'),
    ])
    const fees = Number(communityFunds.statistics["24h"].earnings);
    return fees * price;
  }

  sdk.register({
    id: 'eos',
    queries: {
      oneDayTotalFees: getFees,
      networkFeesByDayUSD: getFees,
    },
    metadata: {
      name: 'EOS',
      category: 'l1',
      icon: sdk.ipfs.getDataURILoader('QmZHzJNSGrQM5CcNUjLSqr5iogcoXwgGMmsnN9VRSeQAna', 'image/svg+xml'),
      description: 'EOS is a high-throughput smart-contract blockchain',
      feeDescription: 'EOS fees are paid to REX stakers',
      source: 'EOS Authority',
      tokenTicker: 'EOS',
      tokenCoingecko: 'eos',
      website: 'https://eosnetwork.com'
    },
  })
}
