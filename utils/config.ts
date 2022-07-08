import { APIClient } from "@greymass/eosio"
import { DfuseClient, createDfuseClient, InMemoryApiTokenStore } from "@dfuse/client";

;(global as any).WebSocket = {}; // ws package not supported by edge functions

const apiKey = process.env.DFUSE_API_KEY;

export const core: {[chain: string]: APIClient} = {
    eos: new APIClient({ url: "https://eos.api.eosnation.io" }),
    wax: new APIClient({ url: "https://wax.api.eosnation.io" }),
    telos: new APIClient({ url: "https://telos.api.eosnation.io" }),
}

export const client: {[chain: string]: DfuseClient} = {
    eos: createDfuseClient({ apiKey, network: 'eos.dfuse.eosnation.io', apiTokenStore: new InMemoryApiTokenStore() }),
}
