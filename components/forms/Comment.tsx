"use client"
interface Props {
    threadId:string,
    currentUserImage:string,
    currentUserId:string
}
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from "zod"
import { usePathname, useRouter } from "next/navigation";
// import { updateUser } from "@/lib/actions/user.actions";
import { CommentValidation } from "@/lib/validations/thread";
import Image from "next/image";
import { addComment } from "@/lib/actions/thread.action";
// import { createThread } from "@/lib/actions/thread.action";
export default function Comment({threadId, currentUserImage, currentUserId}:Props){
    const router = useRouter()
    const pathname = usePathname()
    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread:'',
        }
    })
    const onSubmit = async(values: z.infer<typeof CommentValidation>) => {
        await addComment(threadId,values.thread,JSON.parse(currentUserId), pathname)

        form.reset()
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
            <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-3 w-full">
                            <FormLabel>
                                <Image src={currentUserImage} alt={'profile'} width={48} height={48} className="rounded-full object-cover"/>
                            </FormLabel>
                            <FormControl className="border-none bg-transparent">
                                <Input 
                                    type="text"
                                    placeholder="Comment..."
                                    className="no-focus text-light-1 outline-none"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="comment-form_btn bg-primary-500">Reply</Button>
            </form>
        </Form>
    )
}