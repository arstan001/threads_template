import ThreadCard from "@/components/cards/ThreadCard"
import { fetchPosts } from "@/lib/actions/thread.action"
import { currentUser } from "@clerk/nextjs"

export default async function Home() {
  const user = await currentUser()
  const result = await fetchPosts(1,30)
  return (
    <>
      <h1 className="text-light-1">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result?.posts.length === 0 ? (
          <p className="no-result">No Threads found</p>
        ):(
          <>
            {result?.posts.map(post=>(
              <ThreadCard
                key={post._id} 
                id={post.id} 
                content={post.text}
                currentUserId={user?.id || ''} 
                parentId={post.parentId}
                author={post.author}
                community={post.community}
                createdAt={post.createAt}
                comments={post.children}
              />))}
          </>
        )}
      </section>
    </>
  )
}