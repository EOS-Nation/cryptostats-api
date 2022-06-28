export const name = 'BSC Fees';
export const version = '0.1.0';
export const license = 'MIT';

export function setup(sdk: Context) {
  async function getBSCData(date: string): Promise<number> {
    const query = `query txFees($startOfDay: Int!, $endOfDay: Int!){
      startOfDay: fee(id: "1", block: { number: $startOfDay }) {
        totalFees
      }
      endOfDay: fee(id: "1", block: { number: $endOfDay }) {
        totalFees
      }
    }`;

    const data = await sdk.graph.query('dmihal/bsc-validator-rewards', query, {
      variables: {
        startOfDay: await sdk.chainData.getBlockNumber(date, 'bsc'),
        endOfDay: await sdk.chainData.getBlockNumber(sdk.date.offsetDaysFormatted(date, 1), 'bsc'),
      },
    })

    const bnbFees = data.endOfDay.totalFees - data.startOfDay.totalFees;

    const bnbPrice = await sdk.coinGecko.getHistoricalPrice('binancecoin', date);

    return bnbFees * bnbPrice;
  }

  sdk.register({
    id: 'bsc',
    queries: {
      oneDayTotalFees: getBSCData,
      networkFeesByDayUSD: getBSCData,
    },
    metadata: {
      icon: sdk.ipfs.getDataURILoader('QmNVJfveVQVBR5vw298by22h6M1PCw44mvQV4GdkZrmb1n', 'image/svg+xml'),
      category: 'l1',
      name: 'Binance Smart Chain',
      shortName: 'BSC',
      description: 'Binance Smart Chain is an inexpensive, EVM-compatible chain',
      feeDescription: 'Transaction fees are paid to validators',
      blockchain: 'BSC',
      source: 'Etherscan',
      website: 'https://binance.org',
      tokenTicker: 'BNB',
      tokenCoingecko: 'binancecoin',
      protocolLaunch: '2020-09-11',
    },
  });
}
