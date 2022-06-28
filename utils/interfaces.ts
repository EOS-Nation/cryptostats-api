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