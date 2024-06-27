'use client'


import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { Message } from '@/models/user.model'
import { useToast } from './ui/use-toast'
import { apiResponse } from '@/types/apiResponse'
import axios, { AxiosError } from 'axios'
  
type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageid:string) => void
}
  
const MessageCard = ({message, onMessageDelete}:MessageCardProps) => {
    const {toast} = useToast()

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<apiResponse>(
                `/api/delete-message/${message._id}`
              );
              toast({
                title: response.data.message,
              });
              // onMessageDelete(message._id)  
        } catch (error:any) {
            const axiosError = error as AxiosError<apiResponse>;
            toast({
              title: 'Error',
              description:
                axiosError.response?.data.message ?? 'Failed to delete message',
              variant: 'destructive',
            });
          }  
        }
    // }

  return (
    <Card>
    <CardHeader>
      <CardTitle>Card Title</CardTitle>
      <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive"> <X className='w-5 h-5'/> </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            message and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
      <CardDescription>Card Description</CardDescription>
    </CardHeader>
    <CardContent>
    </CardContent>
    <CardFooter>
      <p>Card Footer</p>
    </CardFooter>
  </Card>
  
  )
} 

export default MessageCard