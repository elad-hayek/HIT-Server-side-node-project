// ProjectMember model
const mongoose = require("mongoose");

const projectMemberSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

const ProjectMember = mongoose.model("ProjectMember", projectMemberSchema);

module.exports = ProjectMember;
