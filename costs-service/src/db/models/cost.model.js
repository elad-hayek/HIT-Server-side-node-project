const mongoose = require("mongoose");

const costSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Field 'description' is required and must be a string"],
      trim: true,
      minlength: [1, "Field 'description' must not be empty"],
    },
    category: {
      type: String,
      required: [true, "Field 'category' is required and must be a string"],
      trim: true,
      minlength: [1, "Field 'category' must not be empty"],
    },
    userid: {
      type: Number,
      required: [true, "Field 'userid' is required and must be a number"],
    },
    sum: {
      type: Number,
      required: [true, "Field 'sum' is required and must be a number"],
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: "Field 'sum' must be a positive number",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cost", costSchema);
