'use client'

import { authClient } from "./auth-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { signinSchema } from '@/schemas/signinSchema'
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Signin = () => {

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = async (values: z.infer<typeof signinSchema>) => {
    setIsLoading(true)
    const res = authClient.signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: "/"
    },
      {
        onerror(ctx: any) {
          toast.error(ctx.error.message)
        },
        onSuccess() {
          router.push('/')
        }
      })
    setIsLoading(false)
  }

  return (
    <div>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>Welcome back</CardTitle>
          <CardDescription>Signin to Continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" className='w-full my-4'>
            <Image alt='Google' src="/logo/google.png" width="30" height="30" />
            Continue with Google
            </Button>
          <Button variant="secondary" className='w-full my-4'>
            <Image alt='Github' src="/logo/github.png" width="30"  height="30"/>
            Continue with GitHub
            </Button>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >Email</FormLabel>
                    <FormControl>
                      <Input placeholder='me@example.com' {...field} />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder='********' {...field} />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />
              <Button className='w-full' disabled={isLoading}>Sign in</Button>
            </form>
          </Form>
          <p className='text-center my-3'>Don't have an account? <Link href="/signup" className='underline'>Signup</Link></p>
        </CardContent>
      </Card>
    </div >
  )
}

export default Signin