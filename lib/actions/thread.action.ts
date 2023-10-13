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
export async function fetchThreadById(id:string){
    try {
        connectToDB();
        
        const thread = await Thread.findById(id)
            .populate({
                path:'author',
                model:User,
                select:"_id id name image"
            })
            .populate({
                path:'children',
                populate:[
                    {
                        path:'author',
                        model:User,
                        select:"_id id name parentId image"
                    },
                    {
                        path:'children',
                        model:Thread,
                        populate:[
                            {
                                path:'author',
                                model:User,
                                select:"_id id name parentId image"
                            }
                        ]
                    }
                ]
            })
            .exec()
        return thread
    } catch (error) {
        console.log('fectching the thread', error)
    }   
}
export async function addComment(threadId:string, commentText:string, userId:string, path:string){
    connectToDB()
    try {
        const originalThread = await Thread.findById(threadId)
        if(!originalThread) {
            throw new Error("Thread not found")
        }
        const commentThread = new Thread({
            text:commentText,
            author:userId,
            parentId:threadId
        })

        const savedComment = await commentThread.save()

        originalThread.children.push(savedComment._id)

        await originalThread.save()

        revalidatePath(path)

    } catch (error) {
        console.log('error in adding comment', error)
    }
}