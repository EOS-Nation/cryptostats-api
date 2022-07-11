export interface GetTableRows<T> {
    rows: T[];
    more: boolean;
    next_key?: '',
    next_key_bytes?: ''
}

export interface ErrorMessage {
    code: number;
    message: string;
}

export interface RexPool {
    loan_num: number;
    namebid_proceeds: string;
    total_lendable: string;
    total_lent: string;
    total_rent: string;
    total_rex: string;
    total_unlent: string;
    version: number;
}

export interface Stat {
    supply: string;
    max_supply: string;
    issuer: string;
}

export interface Global4 {
    continuous_rate: number;
    inflation_pay_factor: number;
    votepay_factor: number;
}