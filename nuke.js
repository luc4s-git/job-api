require('dotenv').config()

const connectDB = require('./db/connect')
const User = require('./models/User')

const nuke = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        await User.deleteMany()
        console.log('all db saves were deleted.')
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

nuke()
