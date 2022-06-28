import { NextApiRequest, NextApiResponse } from 'next'

/**
 * Wraps a Next.js route in order to return a friendly 500 error in case
 * an error happens
 *
 * @param endpoint function handling next.js req and res
 * @param req next.js req parameter
 * @param res next.js res parameter
 * @param filename filename of the caller, use __filename
 * @returns endpoint result or friendly 500 error if an error happens
 */
export const errorWrapper = async (
  endpoint: Function,
  req: NextApiRequest,
  res: NextApiResponse,
  filename: String
) => {
  try {
    return await endpoint(req, res)
  } catch (err: any) {
    const label = filename.split('server/')[1]
    const errorReason = err.message || err;

    console.log('------')
    console.error(`🛑 ${label} error`)
    console.error(errorReason)
    console.log('------')

    return res.status(500).send({ error: errorReason })
  }
}