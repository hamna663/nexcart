'use client'

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { signupSchema } from '@/schemas/signupSchema'
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: ""
    }
  })

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true)
    const res = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      callbackURL: "/"
    }, {
      onSuccess: () => router.push('/'),
      onError: (ctx) => { toast.error(ctx.error.message) }
    }
    )
    setIsLoading(false)
  }

  return (
    <div>
      <Card className='py-2'>
        <CardHeader className='text-center my-0'>
          <CardTitle className='text-2xl font-bold'>Welcome Here</CardTitle>
          <CardDescription>Signup to Start your journey</CardDescription>
        </CardHeader>
        <CardContent className='my-0'>
          <Button variant="secondary" className='w-full my-4'>
            <Image alt='Google' src="/logo/google.png" width="30" height="30" />
            Continue with Google
          </Button>
          <Button variant="secondary" className='w-full my-4'>
            <Image alt='Github' className='invert' src="/logo/github.png" width="30" height="30" />
            Continue with GitHub
          </Button>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2 mt-2'>
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='John Doe' {...field} />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />
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
              <FormField
                name="confirm_password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder='********' {...field} />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />
              <Button className='w-full' disabled={isLoading}>Sign up</Button>
            </form>
          </Form>
          <p className='text-center my-3'>Already have an account? <Link href="/signin" className='underline'>Signin</Link></p>
        </CardContent>
      </Card>
    </div >
  )
}

export default Signup