import * as z from 'zod'

const fileSchema = z.object({
  file: z.string().min(1, "file is required"),
  deadline: z.string().nullable().optional(),
  important: z.boolean().optional().catch(false),
  hidden: z.boolean().optional().catch(false),
  category: z.string().nonempty( "please select a category"),
 department:z.array(z.uuid()),
  sender: z.string().nullable(),
  receiver: z.string().nullable(),
  types: z.string(),
});




export default fileSchema;