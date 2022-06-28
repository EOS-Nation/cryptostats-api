
import axios from "axios";
import { RPC_ENDPOINTS } from "./constants"
import { GetTableRows, ErrorMessage } from "./interfaces"

export function timeout(ms: number) {
    return new Promise(resolve => setTimeout(() => resolve(true), ms))
}

export async function get_all_table_rows<T>( code: string, scope: string, table: string, key: string, chain: string = "eos" ): Promise<GetTableRows<T> | null> {
    // required
    const keys = new Set();
    const rows: T[] = [];
    let lower_bound: string = "";

    while ( true ) {
        const result = await get_table_rows<T>( code, scope, table, chain, { lower_bound, limit: 2500 });
        if ( !result ) break;
        for ( const row of result.rows ) {
            const id = (row as any)[key];
            if ( keys.has( id ) ) continue;
            keys.add(id);
            rows.push(row);
            lower_bound = id;
        }
        if ( result.more == false ) break;
    }
    return {
        rows,
        more: false
    };
}

export async function get_table_rows<T>( code: string, scope: string, table: string, chain: string = "eos", options: { upper_bound?: string, lower_bound?: string, limit?: number } = {} ): Promise<GetTableRows<T> | null> {
    // required
    const params: any = { code, scope, table, json: true, limit: 2500 };

    // optional params
    if ( options.limit ) params.limit = options.limit;
    if ( options.upper_bound ) params.upper_bound = options.upper_bound;
    if ( options.lower_bound ) params.lower_bound = options.lower_bound;

    try {
        const url = `${RPC_ENDPOINTS[chain]}/v1/chain/get_table_rows`;
        const response = await axios.post<GetTableRows<T>>(url, params );
        return response.data;
    } catch (e) {
        const msg: ErrorMessage = { code: 400, message: `failed to fetch [${chain}::get_table_rows] ${code}::${scope}:${table}` };
        console.error(msg);
        return null;
    }
}

