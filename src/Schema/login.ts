import * as z from "zod"

const loginSchema=z.object({

    email:z.email("enter valid email"),
    password:z.string().min(8,'password must be atleast 8 characters long')
})

export default loginSchema