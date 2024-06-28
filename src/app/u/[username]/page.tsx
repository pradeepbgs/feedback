'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from '@/components/ui/use-toast'
import { messageSchema } from '@/schema/messageSchema'
import { apiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const SendMessagePage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { username } = useParams()

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true)
    try {
      const res = await axios.post<apiResponse>('/api/send-messages', {
        username,
        message: data.content
      })

      if (res?.data.success) {
        toast({
          title: 'Success',
          description: res.data.message ?? 'Message sent successfully',
        })
        form.reset()
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<apiResponse>
      toast({
        title: 'Error',
        description: axiosError.response?.data?.message ?? 'Failed to send message',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded shadow-lg max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Write your anonymous message here"
                    className="w-full p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Button type="submit" disabled={isLoading} className="flex items-center">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Send It'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default SendMessagePage
