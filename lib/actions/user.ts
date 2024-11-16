import User from "../models/User";
import { connectToDB } from "../mongodb/mongoose";

export const createOrUpdateUser = async (
    id: string,
    first_name: string,
    last_name: string,
    username: string,
    email_addresses: { email_address: string }[],
    image_url: string
) => {
    try {
        await connectToDB();

        const user = await User.findOneAndUpdate(
            { clerkId: id },
            {
                $set: {
                    firstName: first_name,
                    lastName: last_name,
                    username: username,
                    email: email_addresses[0].email_address,
                    profilePhoto: image_url,
                },
            },
            { upsert: true, new: true }
        );

        await user.save();

        return user;
    } catch (error) {
        console.error(error);
    }
};

export const deleteUser = async (id: string) => {
    try {
        await connectToDB();
        await User.findOneAndDelete({ clerkId: id });
    } catch (error) {
        console.error(error);
    }
}