import { RexPool, Stat, Global4 } from "utils/interfaces"
import { core, client } from "utils/config"
import { Asset, Int64 } from "@greymass/eosio"

export function parse_core_sym( chain: string )
{
    if (chain == "eos") return Asset.Symbol.from("4,EOS");
    if (chain == "wax") return Asset.Symbol.from("8,WAX");
    if (chain == "telos") return Asset.Symbol.from("4,TLOS");
    if (chain == "ux") return Asset.Symbol.from("4,UX");
    return Asset.Symbol.from("4,EOS");
}

export function parse_core_asset( chain: string, amount = 0 )
{
    const sym = parse_core_sym( chain );
    if (chain == "eos") return new Asset( Int64.from(amount), sym );
    return new Asset( Int64.from(amount), sym );
}

export function get_genesis_date( chain: string )
{
    if (chain == "eos") return "2018-06-12";
    return "";
}

export function get_rex_date( chain: string )
{
    if (chain == "eos") return "2019-05-03";
    return "";
}

export function get_rex_block_num( chain: string )
{
    if (chain == "eos") return 56111528;
    return 0;
}

export function get_balance_block_num( chain: string )
{
    if (chain == "eos") return 93823;
    return 0;
}

export function get_inflation_date( chain: string )
{
    if (chain == "eos") return "2020-01-04";
    return "";
}

export async function get_blockNum(time: string | Date, chain: string) {
    const result = await client[chain].fetchBlockIdByTime(time, "gt");
    return result.block.num.valueOf();
}

export async function get_inflation(blockNum: number, chain: string): Promise<Global4> {
    const code = "eosio";
    const table = "global4"
    try {
        const result = await client[chain].stateTable<any>(code, code, table, {json: true, blockNum});
        return (result.rows[0].json) as any
    } catch (e) {
        return { continuous_rate: 0.05, inflation_pay_factor: 500, votepay_factor: 400 };
    }
}

export async function get_staked(owner: string, blockNum: number, chain: string): Promise<Asset> {
    const code = "eosio";
    const table = "voters";
    const scope = "eosio";
    const result = await client[chain].stateTableRow<any>(code, scope, table, owner, {json: true, blockNum});
    const staked = get_core_asset(chain);
    if (result.row.json) staked.units = Int64.from(result.row.json.staked);
    return staked;
}

export async function get_balance(owner: string, code: string, symcode: string, blockNum: number, chain: string): Promise<Asset> {
    const table = "accounts"
    const scope = owner
    const result = await client[chain].stateTableRow<any>(code, scope, table, symcode, {json: true, blockNum});
    if (result.row.json) return Asset.from(result.row.json.balance);
    return get_core_asset(chain);
}

export async function get_supply(code: string, symcode: string, blockNum: number, chain: string): Promise<Stat> {
    const table = "stat"
    const result = await client[chain].stateTable<any>(code, symcode, table, {json: true, blockNum});
    return (result.rows[0].json) as any
}

export async function is_rexpool(blockNum: number, chain: string): Promise<boolean> {
    const code = "eosio";
    const table = "rexpool"
    try {
        await client[chain].stateTable<RexPool>(code, code, table, {json: true, blockNum});
        return true;
    } catch (e) {
        return false;
    }
}

export async function is_inflation(blockNum: number, chain: string): Promise<boolean> {
    const code = "eosio";
    const table = "global4"
    try {
        await client[chain].stateTable<RexPool>(code, code, table, {json: true, blockNum});
        return true;
    } catch (e) {
        return false;
    }
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
