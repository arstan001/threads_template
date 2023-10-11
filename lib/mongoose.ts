import mongoose from 'mongoose'
let isConnected = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery', true)

    if(!process.env.MONGODB_URL) return console.log('NO MONGODB_URL')
    if(isConnected) return console.log('Already connected')

    try {
        await mongoose.connect(process.env.MONGODB_URL)
        isConnected=true
        console.log('CONNECTED')
    } catch (error) {
        console.log('Error in connection to db', error)
    }
}