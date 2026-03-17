import UserModel from "../models/User.model";
import { NotFoundException } from "../utils/appError";

const updateProfile = async (
  userId: string,
  username: string,
  currency: string,
) => {
  try {
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    user.username = username;
    user.currency = currency;
    await user.save();

    return {
      message: "User updated successfully",
      data: user,
    };
  } catch (error) {
    throw error;
  }
};

export default {
  updateProfile,
};
