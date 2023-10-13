import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Page({params}: {params:{id:string}}){
    if(!params.id) return null

    const user = await currentUser()
    if(!user) return

    const userInfo = await fetchUser(user.id)

    if(!userInfo?.onboarded) redirect('/onboarding')

    const thread = await fetchThreadById(params.id)
    console.log('sss', thread)
    return (
        <section className="relative">
            <div>
                <ThreadCard
                    id={thread._id} 
                    content={thread.text}
                    currentUserId={user?.id || ''} 
                    parentId={thread.parentId}
                    author={thread.author}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            </div>
            <div className="mt-7">
                <Comment
                    threadId={thread.id}
                    currentUserImage={userInfo.image}
                    currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>
            <div className="mt-10">
                {thread.children.map((child:any)=>(
                    <ThreadCard
                        key={child._id}
                        id={child._id} 
                        content={child.text}
                        currentUserId={child?.id || ''} 
                        parentId={child.parentId}
                        author={child.author}
                        community={child.community}
                        createdAt={child.createdAt}
                        comments={child.children}
                        isComment
                    />
                ))}
            </div>
        </section>
    )
}