export const name = 'MakerDAO Treasury';
export const version = '0.1.0';
export const license = 'MIT';

const VAT_ADDRESS = '0x35d1b3f3d7966a1dfe207aa4514c12a259a0492b'
const PAUSE_ADDRESS = '0xbe8e3e3618f7474f8cb1d074a26affef007e98fb'

const vatABI = [
  'function dai(address holder) external view returns (uint256)',
  'function sin(address holder) external view returns (uint256)',
]

export async function setup(sdk: Context) {
  let pausePortfolioPromise: Promise<any> | null
  const getPausePortfolio = (): Promise<any> => {
    if (!pausePortfolioPromise) {
      pausePortfolioPromise = sdk.http.get(`https://zerion-api.vercel.app/api/portfolio/${PAUSE_ADDRESS}`)
        .then(result => {
          if (result.success) {
            return result.value
          }
          throw new Error(result.error)
        })
    }
    return pausePortfolioPromise
  }

  const getDaiSurplus = async () => {
    const vat = sdk.ethers.getContract(VAT_ADDRESS, vatABI)
    const [dai, sin] = await Promise.all([
      vat.dai('0xA950524441892A31ebddF91d3cEEFa04Bf454466'),
      vat.sin('0xA950524441892A31ebddF91d3cEEFa04Bf454466'),
    ])

    const daiSurplus = dai.sub(sin).toString() / 1e45
    return daiSurplus
  }
  const getBalance = async ( code: string, account: string, symbol: string ) => {
    const balance = await sdk.http.post('https://eos.api.eosnation.io/v1/chain/get_currency_balance', { code, account, symbol });
    return Number(balance.rows[0].split(" ")[0]);
  }

  const getTreasuryInUSD = async () => {
    const [currencyStats, global4, price] = await Promise.all([
      sdk.http.post('https://eos.api.eosnation.io/v1/chain/get_currency_balance', { code: "eosio.token", account: "eosio.saving", symbol: "EOS" }),
      sdk.coinGecko.getCurrentPrice('eos'),
    ])
    const [daiSurplus, pauseValue] = await Promise.all([
      getDaiSurplus(),
      getPausePortfolio(),
    ])

    return daiSurplus + pauseValue.totalValue
  }

  const getPortfolio = async () => {
    const [pausePortfolio, daiSurplus] = await Promise.all([
      getPausePortfolio(),
      getDaiSurplus(),
    ])

    return [
      ...pausePortfolio.portfolio,
      {
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        amount: daiSurplus,
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        icon: 'https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png',
        price: 1,
        value: daiSurplus
      },
    ]
  }

  sdk.register({
    id: 'makerdao',
    queries: {
      currentTreasuryUSD: getTreasuryInUSD,
      currentLiquidTreasuryUSD: getTreasuryInUSD,
      currentTreasuryPortfolio: getPortfolio,
      recentProposals: async () => [], // TODO: Fetch actual proposals
    },
    metadata: {
      icon: sdk.ipfs.getDataURILoader('QmNuxELX7oWXJtJKveaCFDC7niZ4APtkWgPn1NZm2FLSJV', 'image/svg+xml'),
      category: 'app',
      name: 'MakerDAO',
      website: 'https://makerdao.com',
      governanceSite: 'https://vote.makerdao.com',
      governanceForum: 'https://forum.makerdao.com',
      governanceModel: '',
      treasuries: [PAUSE_ADDRESS],
    },
  })
}
