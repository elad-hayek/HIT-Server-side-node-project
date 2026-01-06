const mongoose = require("mongoose");

const monthlyReportSchema = new mongoose.Schema(
  {
    userid: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

monthlyReportSchema.index({ userid: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("MonthlyReport", monthlyReportSchema);
