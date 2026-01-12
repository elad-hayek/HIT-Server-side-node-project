// User model module - Mongoose schema and model for user profiles
// Defines structure for storing user information with validation rules

// Import MongoDB/Mongoose for schema definition and model creation
const mongoose = require("mongoose");

// Define Mongoose schema for user documents with validation rules
const userSchema = new mongoose.Schema(
  {
    // User ID - unique identifier for the user, must be numeric, indexed for fast lookups
    id: {
      type: Number,
      required: [true, "Field 'id' is required and must be a number"],
      unique: true,
      index: true,
    },
    // User's first name - required string field, whitespace trimmed
    first_name: {
      type: String,
      required: [true, "Field 'first_name' is required and must be a string"],
      trim: true,
    },
    // User's last name - required string field, whitespace trimmed
    last_name: {
      type: String,
      required: [true, "Field 'last_name' is required and must be a string"],
      trim: true,
    },
    // User's birthday - required valid date, validated to ensure proper date format
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
    // Automatically add createdAt and updatedAt timestamp fields
    timestamps: true,
  }
);

// Create User model from schema
const User = mongoose.model("User", userSchema);

// Export the User model for database operations
module.exports = User;
