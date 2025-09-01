import * as z from "zod";

export const passwordSchema = z.object({
  oldpassword: z.string().min(8, "password must be atleast 8 characters long"),
  newpassword: z.string().min(8, "password must be atleast 8 characters long"),
  confirmpassword: z.string().min(8, "password must be atleast 8 characters long"),
}).refine((a)=>a.newpassword===a.confirmpassword,{
    message:"passwords must be same",
    path:['confirmpassword']
}).refine((b)=>b.oldpassword!==b.newpassword,{
    message:'new password cant be the same as old',
   path:['newpassword']
});
