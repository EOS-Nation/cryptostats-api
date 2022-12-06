export const version = "0.1.1";
export const title = "Antelope CryptoStats API";
export const description = "One neutral source of truth for crypto metrics. Used by everyone, managed by the community.";
export const homepage = "https://forum.cryptostats.community";

export const RPC_NODE_URL: {[key: string]: string} = {
    'eos': 'https://eos.api.eosnation.io',
    'wax': 'https://wax.api.eosnation.io',
    'telos': 'https://telos.api.eosnation.io',
}

export const RPC_CHAIN_ID: {[key: string]: string} = {
    'eos': 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    'wax': '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
    'telos': '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
}

export const RPC_ENDPOINTS = RPC_NODE_URL;

export const HISTORY_RPC_ENDPOINTS: {[key: string]: string} = {
    'eos': 'https://eos.greymass.com',
    'wax': 'https://wax.greymass.com',
    'telos': 'https://telos.greymass.com',
}