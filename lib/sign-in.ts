import { authClient } from "./auth-client"

const { data, error } = await authClient.signIn.email({
    email,password,callbackURL: "/dashboard",
    rememberMe: false
}, {
//callbacks
})