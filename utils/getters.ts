import { RexPool } from "utils/interfaces"
import { core, client } from "utils/config"

export async function get_blockNum(time: string | Date) {
    const result = await client['eos'].fetchBlockIdByTime(time, "lt");
    return result.block.num.valueOf();
}

export async function get_rexpool(blockNum: number): Promise<RexPool> {
    const code = "eosio";
    const table = "rexpool"
    const result = await client['eos'].stateTable<RexPool>(code, code, table, {json: true, blockNum});
    return (result.rows[0].json) as any
}

function asset_to_number( asset: string ) {
    return Number(asset.split(" ")[0]);
}

function rex_rate( rexpool: RexPool ) {
    console.log(rexpool);
    const total_lendable = asset_to_number(rexpool.total_lendable);
    const total_rex = asset_to_number(rexpool.total_rex);
    return total_lendable / total_rex;
}

export async function get_rexpool_delta(start_blockNum: number, end_blockNum: number) {
    console.log({start_blockNum})
    const start = await get_rexpool( start_blockNum );
    console.log({end_blockNum})
    const end = await get_rexpool( end_blockNum );
    const total_lendable = asset_to_number(start.total_lendable);
    const start_rex_rate = rex_rate( start );
    const end_rex_rate = rex_rate( end );
    const delta = 1 - (start_rex_rate/end_rex_rate);
    return delta * total_lendable;
}

export async function get_info() {
    return core["eos"].v1.chain.get_info();
}
