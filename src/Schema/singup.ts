import * as z from "zod"

const signupSchema=z.object({
    name: z.string("name is required").min(2,'name must me atleast 2 characters').max(25,"name can't exceed 25 characters"),
    email:z.email("enter valid email"),
    password:z.string().min(8,'password must be atleast 8 characters long')
})

export default signupSchema