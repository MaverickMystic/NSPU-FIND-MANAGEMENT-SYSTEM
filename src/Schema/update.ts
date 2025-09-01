import * as z from "zod";

const metadtaSchema = z.object({
  name: z.string().nonempty({ message: "Name can't be empty" }),
  deadline: z.string().nonempty({ message: "Deadline is required" }), // later you can refine with date
  types: z.string().nonempty({ message: "Inbox/Outbox is required" }),
  sender: z.string().nonempty({ message: "Sender can't be empty" }),
  receiver: z.string().nonempty({ message: "Receiver can't be empty" }),
  categoryid: z.string().nonempty({ message: "Category is required" }),
});

export type MetadataFormValues = z.infer<typeof metadtaSchema>;

export default metadtaSchema;
