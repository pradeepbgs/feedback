'use client'
import { useState } from 'react';
import axios, { AxiosError } from 'axios'; // Assuming axios is used for API calls
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { verifySchema } from '@/schema/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { apiResponse } from '@/types/apiResponse';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react';

const VerificationForm = () => {
  const router = useRouter()
  const {username} = useParams()
  const {toast} = useToast()
  const [isLoading,setIsLoading] = useState(false)


  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  })
  const onSubmit = async (data:z.infer<typeof verifySchema>) => {
    setIsLoading(true)
    try {
      const code = data.code;
      console.log(code , username)
      const response = await axios.post(`/api/verify-code?username=${username}&code=${code}`);
      toast({
        title: 'Success',
        description: response.data.message,
      });
      router.push('/sign-in')
      setIsLoading(false)
    } catch (error:any) {
      setIsLoading(false)
      console.error('Verification Error:', error);
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className='text-center'>
            <h1 className='text-3xl font-bold
            tracking-tight lg:text-5xl mb-6'>
              Verify Your Account
            </h1>
            <p className='mb-4'>Enter the Verification code sent to your email</p>
        </div>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input 
                placeholder="Enter OTP" 
                {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
        {isLoading ? (<Loader2 />) : 'Verify'}
        </Button>
      </form>
    </Form>
      </div>
    </div>
  );
};

export default VerificationForm;
