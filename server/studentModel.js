const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  srNo: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  caste: {
    type: String,
    trim: true,
    uppercase: true,
  },
  dsPracInt: { type: Number, default: 0 },
  dsPracExt: { type: Number, default: 0 },
  dbmsPracInt: { type: Number, default: 0 },
  dbmsPracExt: { type: Number, default: 0 },
  mathPracInt: { type: Number, default: 0 },
  mathPracExt: { type: Number, default: 0 },
  dsInt: { type: Number, default: 0 },
  dsExt: { type: Number, default: 0 },
  dbmsInt: { type: Number, default: 0 },
  dbmsExt: { type: Number, default: 0 },
  mathInt: { type: Number, default: 0 },
  mathExt: { type: Number, default: 0 },
  oeInt: { type: Number, default: 0 },
  oeExt: { type: Number, default: 0 },
  engInt: { type: Number, default: 0 },
  engExt: { type: Number, default: 0 },
  total: {
    type: Number,
    default: 0,
  },
  percentage: {
    type: Number,
    default: 0,
  },
  passFail: {
    type: String,
    uppercase: true,
    trim: true,
  },
  resultClass: {
    type: String,
  },
});

// Mongoose v8 mein async function use karo
studentSchema.pre('save', async function () {
  const pct = this.percentage;
  if (pct >= 75) {
    this.resultClass = 'First Class with Distinction';
  } else if (pct >= 60) {
    this.resultClass = 'First Class';
  } else if (pct >= 50) {
    this.resultClass = 'Second Class';
  } else if (pct >= 40) {
    this.resultClass = 'Third Class';
  } else {
    this.resultClass = 'Fail';
  }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;