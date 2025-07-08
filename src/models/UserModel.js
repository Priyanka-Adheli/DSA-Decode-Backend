const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      immutable: true,
    },
    password: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

// Delete all ChatData when a User is deleted
userSchema.post('findOneAndDelete', async function (userInfo) {
  if (userInfo) {
    await mongoose.model('ChatData').deleteMany({ userId: userInfo._id });
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;