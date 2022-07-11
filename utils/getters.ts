import { RexPool, Stat, Global4 } from "utils/interfaces"
import { core, client } from "utils/config"

export async function get_blockNum(time: string | Date, chain: string) {
    const result = await client[chain].fetchBlockIdByTime(time, "lt");
    return result.block.num.valueOf();
}

export async function get_inflation(blockNum: number, chain: string): Promise<Global4> {
    const code = "eosio";
    const table = "global4"
    const result = await client[chain].stateTable<any>(code, code, table, {json: true, blockNum});
    return (result.rows[0].json) as any
}

export async function get_supply(code: string, symcode: string, blockNum: number, chain: string): Promise<Stat> {
    const table = "stat"
    const result = await client[chain].stateTable<any>(code, symcode, table, {json: true, blockNum});
    return (result.rows[0].json) as any
}

export async function get_rexpool(blockNum: number, chain: string): Promise<RexPool> {
    const code = "eosio";
    const table = "rexpool"
    const result = await client[chain].stateTable<RexPool>(code, code, table, {json: true, blockNum});
    return (result.rows[0].json) as any
}

export function asset_to_number( asset: string ) {
    return Number(asset.split(" ")[0]);
}

export function rex_rate( rexpool: RexPool ) {
    const total_lendable = asset_to_number(rexpool.total_lendable);
    const total_rex = asset_to_number(rexpool.total_rex);
    return total_lendable / total_rex;
}

export function get_rexpool_delta(start: RexPool, end: RexPool) {
    const total_lendable = asset_to_number(start.total_lendable);
    const start_rex_rate = rex_rate( start );
    const end_rex_rate = rex_rate( end );
    const delta = 1 - (start_rex_rate / end_rex_rate);
    return delta * total_lendable;
}

export async function get_info(chain: string) {
    return core[chain].v1.chain.get_info();
}
