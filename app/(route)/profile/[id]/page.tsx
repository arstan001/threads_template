import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Page(){

    const user = await currentUser()
    if(!user) return

    const userInfo = await fetchUser(user.id)

    if(!userInfo?.onboarded) redirect('/onboarding')
    return (
        <section>
            proofile
        </section>
    )
}