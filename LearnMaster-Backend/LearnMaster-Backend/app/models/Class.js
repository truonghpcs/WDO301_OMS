const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ClassSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    urlLearn: {
      type: String,
      default:
        "https://us05web.zoom.us/j/89010248066?pwd=NufnNQURtrsXoGJxQb5Wub0ui5HLzy.1",
    },
    dateLearn: {
      type: String,
      default: "",
    },
    timeStart: {
      type: String,
      default: "",
    },
    timeEnd: {
      type: String,
      default: "",
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
  },
  { timestamps: true }
);

ClassSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("class", ClassSchema);
