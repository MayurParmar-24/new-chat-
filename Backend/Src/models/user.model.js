import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {  // ✅ Fixed typo (fulName → fullName)
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        profilePic: {  // ✅ Fixed typo (porfilePic → profilePic)
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,  // ✅ Automatically adds createdAt & updatedAt
    }
);

// ✅ Export the User model
const User = mongoose.model("User", userSchema);
export default User;
