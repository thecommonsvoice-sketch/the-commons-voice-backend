import mongoose, { Document, Schema } from "mongoose";

// Define the User interface
export interface IUser extends Document {
    name: string;
    email: string; 
}

// Create schema
const userSchema = new Schema<IUser>({
    name: { type: String, required: true }, // You can add validation as needed
    email: { type: String, required: true, unique: true }, // Example of adding uniqueness
});

// Create model using schema
const User = mongoose.model<IUser>("User", userSchema);

export default User;
