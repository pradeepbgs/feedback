'use client'

import React, {useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {useDebounceCallback} from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { signupSchema } from '@/schema/signupSchema'
import axios,{AxiosError} from 'axios'
import { apiResponse } from '@/types/apiResponse'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'


function SignUpPage() {
  const [username, setUsername] = useState('')
  const [usernameMessage,setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting]= useState(false)
  const debounced = useDebounceCallback(setUsername, 500)
  const {toast} = useToast()
  const router = useRouter()
  
  // zod implementation
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues:{
      username:'',
      email:'',
      password:''
    }
  })

  useEffect(()=>{
    const checkUsernameUniqueness = async () => {
      if (username){
        setIsCheckingUsername(true)
        setUsernameMessage('')
      }
      try {
       const res =  await axios
       .get(`/api/check-username-unique?username=${username}`)
        setUsernameMessage(res.data.message)
      } catch (error:any) {
        const axiosError = error as AxiosError<apiResponse>
        setUsernameMessage(axiosError.response?.data.message ?? 'error checking username')
      } finally {
        setIsCheckingUsername(false)
      }
    }
    checkUsernameUniqueness()
  },[username])

  console.log(username)
  const onSubmit = async (data:z.infer<typeof signupSchema>) => {
    setIsSubmitting(true)
    try {
     const res = await axios.post<apiResponse>('/api/signup',data)
     toast({
      title: 'Success',
      description: res.data.message,
     })
     router.push(`/verify/${username}`)
     setIsSubmitting(false)
    } catch (error:any) {
      console.log("error in signup user")
      const axiosError = error as AxiosError<apiResponse>
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'An error occurred',
        variant: 'destructive',
      })
      setIsSubmitting(false) 
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Welcome Back to True Feedback
        </h1>
        <p className="mb-4">Sign up to continue your secret conversations</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <Input 
                placeholder='Username'
                {...field} 
                onChange={(e) => {
                  field.onChange(e) 
                  debounced(e.target.value)
                }}
                />
                {
                    isCheckingUsername && <Loader2 className='animate-spin'/>
                }
                <p className={`text-sm ${usernameMessage === "Username is available" ?  "text-green-500" : "text-red-500"}`}>
                     {usernameMessage}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input 
                type='email'
                placeholder='Email'
                {...field} 
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <Input type="password" 
                placeholder='Password'
                {...field} 
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
          className='w-full' type="submit">
            {
              isSubmitting ? (
                <>
                <Loader2 className='mr-2 h-3 w-3 animate-spin' /> please wait
                </>
              ) : 'Sign Up'
            }
            </Button>
        </form>
      </Form>
      <div className="text-center mt-4">
        <p>
          Already a member {' '}
          <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  </div>
  )
}

export default SignUpPage