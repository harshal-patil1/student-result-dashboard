const express = require('express');
const router = express.Router();
const Student = require('./studentModel');

// Main Dashboard Route
router.get('/', async (req, res) => {
  try {
    // Saare students fetch karo
    const students = await Student.find().sort({ srNo: 1 });

    // Total students
    const totalStudents = students.length;

    // Pass / Fail count
    const totalPassed = students.filter(s => s.passFail === 'PASS').length;
    const totalFailed = students.filter(s => s.passFail === 'FAIL').length;

    // Category wise count
    const distinction = students.filter(s => s.resultClass === 'First Class with Distinction').length;
    const firstClass = students.filter(s => s.resultClass === 'First Class').length;
    const secondClass = students.filter(s => s.resultClass === 'Second Class').length;
    const thirdClass = students.filter(s => s.resultClass === 'Third Class').length;
    const failClass = students.filter(s => s.resultClass === 'Fail').length;

    // Caste list nikalo (unique)
    const casteList = [...new Set(students.map(s => s.caste))].sort();

    // Caste wise analysis
    const casteAnalysis = casteList.map(caste => {
      const casteStudents = students.filter(s => s.caste === caste);
      const castePassed = casteStudents.filter(s => s.passFail === 'PASS').length;
      const casteFailed = casteStudents.filter(s => s.passFail === 'FAIL').length;
      return {
        caste,
        total: casteStudents.length,
        passed: castePassed,
        failed: casteFailed,
      };
    });

    // Top 5 students
    const top5 = [...students]
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);

    // EJS ko data bhejo
    res.render('index', {
      students,
      totalStudents,
      totalPassed,
      totalFailed,
      distinction,
      firstClass,
      secondClass,
      thirdClass,
      failClass,
      casteAnalysis,
      top5,
    });
  } catch (err) {
    console.log('Route error:', err.message);
    res.status(500).send('Server Error: ' + err.message);
  }
});

module.exports = router;