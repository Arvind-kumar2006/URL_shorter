import {z} from 'zod';

export const shortenSchema = z.object({
      url : z.string().url(),
      customCode : z.string().max(20).regex(/^[a-zA-Z0-9]+$/).optional(),
      expriesIn : z.number().int().positive().optional(),
})