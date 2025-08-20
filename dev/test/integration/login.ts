import type { Payload } from 'payload'
import type { User } from 'payload-types.js'

import { devUser } from '../../helpers/credentials.js'

export const login = (args: { payload: Payload }): Promise<{ token?: string; user: User }> => {
  return args.payload.login({
    collection: 'users',
    data: { email: devUser.email, password: devUser.password },
  })
}
