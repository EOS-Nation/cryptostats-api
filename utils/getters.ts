import { RexPool } from "utils/interfaces"
import { core, client } from "utils/config"

export async function get_blockNum(time: string | Date, chain: string) {
    const result = await client[chain].fetchBlockIdByTime(time, "lt");
    return result.block.num.valueOf();
}

export async function get_rexpool(blockNum: number, chain: string): Promise<RexPool> {
    const code = "eosio";
    const table = "rexpool"
    const result = await client[chain].stateTable<RexPool>(code, code, table, {json: true, blockNum});
    return (result.rows[0].json) as any
}

function asset_to_number( asset: string ) {
    return Number(asset.split(" ")[0]);
}

function rex_rate( rexpool: RexPool ) {
    const total_lendable = asset_to_number(rexpool.total_lendable);
    const total_rex = asset_to_number(rexpool.total_rex);
    return total_lendable / total_rex;
}

export async function get_rexpool_delta(start_blockNum: number, end_blockNum: number, chain: string) {
    const start = await get_rexpool( start_blockNum, chain );
    const end = await get_rexpool( end_blockNum, chain);
    const total_lendable = asset_to_number(start.total_lendable);
    const start_rex_rate = rex_rate( start );
    const end_rex_rate = rex_rate( end );
    const delta = 1 - (start_rex_rate/end_rex_rate);
    return delta * total_lendable;
}

export async function get_info(chain: string) {
    return core[chain].v1.chain.get_info();
}
