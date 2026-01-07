// User model
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: [true, "Field 'id' is required and must be a number"],
      unique: true,
      index: true,
    },
    first_name: {
      type: String,
      required: [true, "Field 'first_name' is required and must be a string"],
      trim: true,
    },
    last_name: {
      type: String,
      required: [true, "Field 'last_name' is required and must be a string"],
      trim: true,
    },
    birthday: {
      type: Date,
      required: [true, "Field 'birthday' is required"],
      validate: {
        validator: function (value) {
          return value instanceof Date && !isNaN(value);
        },
        message: "Field 'birthday' must be a valid date",
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
