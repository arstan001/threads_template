"use server"

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.models";
import { connectToDB } from "../mongoose"

interface Params {
    text:string,
    author:string,
    communityId: string | null,
    path:string 
}
export async function createThread({text, author, communityId, path}:Params){
    try {
        connectToDB();
        const createdThread = await Thread.create({
            text,
            author,
            community: null
        });
    
        await User.findByIdAndUpdate(author,{
            $push: {threads: createdThread._id}
        })
    
        revalidatePath(path)
    } catch (error) {
        console.log(error)
    }
    
}
export async function fetchPosts(pageNumber=1, pageSize=20){
    try {
        connectToDB();
        
        const skipAmount = (pageNumber - 1)*pageSize
        const postQuery = Thread.find({parentId:{ $in: [null, undefined]}})
            .sort({createAt:'desc'})
            .skip(skipAmount)
            .limit(pageSize)
            .populate({ path: 'author', model:User})
            .populate({ 
                path: 'children',
                populate:{
                    path:'author',
                    model:User,
                    select: "_id name parentId image"
                }
            })
        const totalPostsCound = await Thread.countDocuments({parentId:{ $in: [null, undefined]}})

        const posts = await postQuery.exec();

        const isNext = totalPostsCound > skipAmount + posts.length
        
        return { posts, isNext }
    } catch (error) {
        console.log('heheh', error)
    }
    
}