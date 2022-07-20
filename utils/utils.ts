
import type { NextApiResponse } from 'next'

export function timeout(ms: number) {
    return new Promise(resolve => setTimeout(() => resolve(true), ms))
}

export function setCache( res: NextApiResponse ) {
    const headers = {
        'Cache-Control': 's-maxage=1, stale-while-revalidate=59',
        'Access-Control-Allow-Origin': '*'
    }
    for ( const [key, value] of Object.entries(headers)) {
        res.setHeader(key, value);
    }
}
