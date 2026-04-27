const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Student = require('./studentModel');

const uploadCSV = async () => {
  try {
    // Pehle purana data delete karo
    await Student.deleteMany({});
    console.log('Old data cleared!');

    const csvPath = path.join(__dirname, '../STUDENT RESULT.csv');
    const students = [];
    let rowIndex = 0;

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv({ headers: false, skipLines: 0 }))
        .on('data', (row) => {
          rowIndex++;

          // Pehli 2 rows skip karo (headers hain)
          if (rowIndex <= 2) return;

          const values = Object.values(row);

          // Empty rows skip karo
          if (!values[0] || isNaN(values[0])) return;

          // Name check karo
          const name = values[2] ? values[2].toString().trim() : '';
          if (!name) return;

          const toNum = (val) => {
            const n = parseFloat(val);
            return isNaN(n) ? 0 : n;
          };

          const student = {
            srNo: toNum(values[0]),
            caste: values[1] ? values[1].toString().trim().toUpperCase() : 'OPEN',
            name: name,
            dsPracInt: toNum(values[3]),
            dsPracExt: toNum(values[4]),
            dbmsPracInt: toNum(values[5]),
            dbmsPracExt: toNum(values[6]),
            mathPracInt: toNum(values[7]),
            mathPracExt: toNum(values[8]),
            dsInt: toNum(values[9]),
            dsExt: toNum(values[10]),
            dbmsInt: toNum(values[11]),
            dbmsExt: toNum(values[12]),
            mathInt: toNum(values[13]),
            mathExt: toNum(values[14]),
            oeInt: toNum(values[15]),
            oeExt: toNum(values[16]),
            engInt: toNum(values[17]),
            engExt: toNum(values[18]),
            total: toNum(values[19]),
            percentage: toNum(values[20]),
            passFail: values[21]
              ? values[21].toString().trim().toUpperCase()
              : 'FAIL',
          };

          students.push(student);
        })
        .on('end', async () => {
          try {
            // MongoDB mein save karo
            for (const studentData of students) {
              const student = new Student(studentData);
              await student.save();
            }
            console.log(`${students.length} students saved to MongoDB!`);
            resolve(students.length);
          } catch (err) {
            console.log('Save error:', err.message);
            reject(err);
          }
        })
        .on('error', (err) => {
          console.log('CSV read error:', err.message);
          reject(err);
        });
    });
  } catch (err) {
    console.log('uploadCSV error:', err.message);
    throw err;
  }
};

module.exports = uploadCSV;