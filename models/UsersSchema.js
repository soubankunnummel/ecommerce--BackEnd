
const mongoos = require("mongoose")
const bcrypt = require("bcrypt")
const userSchema =  new mongoos.Schema({
    name:String,
    email:String,
    username:String,
    password:String,
    cart: [{type:mongoos.Schema.ObjectId, ref:"Product"}],
    wishlist:[{type:mongoos.Schema.ObjectId, ref:"Product"}],
    orders:[]

})
 
userSchema.pre("save", async function(next) {
    const user = this;
    if (!user.isModified("password")) return next()

    const hasedPasswoerd = await bcrypt.hash(user.password, 10)
    user.password= hasedPasswoerd
    next( )
})

module.exports = mongoos.model("User", userSchema)
