const express = require("express");
const Attendance = require("../models/Attendance");
const router = express.Router();
const User = require("../models/User");

router.post("/", async (req, res) => {
  const { userId, status } = req.body;
  const attendance = new Attendance({ userId, status });
  await attendance.save();

  res.json({ message: "Attendance marked" });
});

router.get("/monthly", async (req, res) => {
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({ message: "Year and month are required" });
  }

  try {
    const y = parseInt(year);
    const m = parseInt(month);

    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 1); // 1st of next month (non-inclusive)

    // Fetch attendance records for the whole month
    const records = await Attendance.find({
      date: { $gte: startDate.toISOString(), $lt: endDate.toISOString() },
      status: "Present",
    });

    // Count present days per user
    const userPayMap = {};
    records.forEach((record) => {
      const id = record.userId.toString();
      userPayMap[id] = (userPayMap[id] || 0) + 1;
    });

    // Convert to array
    const result = Object.entries(userPayMap).map(([userId, presentDays]) => ({
      userId,
      presentDays,
    }));

    res.json(result);
  } catch (error) {
    console.error("Error calculating monthly attendance summary:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/:userId", async (req, res) => {
  const attendance = await Attendance.find({ userId: req.params.userId });
  res.json(attendance);
});

router.get("/summary/:userId", async (req, res) => {
  const { userId } = req.params;
  const { year, month } = req.query;

  try {
    if (!year || !month) {
      return res.status(400).json({ message: "Year and Month are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const startDate = new Date(`${year}-${month}-01`)
      .toISOString()
      .slice(0, 10);
    const endDate = new Date(`${year}-${month}-31`).toISOString().slice(0, 10);

    const attendanceRecords = await Attendance.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const presentDays = attendanceRecords.filter(
      (record) => record.status.trim().toLowerCase() === "present"
    ).length;
    const absentDays = attendanceRecords.filter(
      (record) => record.status.trim().toLowerCase() === "absent"
    ).length;
    const leaveDays = attendanceRecords.filter(
      (record) => record.status.trim().toLowerCase() === "leave"
    ).length;

    res.json({
      userName: user.name,
      userEmail: user.email,
      year,
      month,
      presentDays,
      absentDays,
      leaveDays,
    });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});


router.get("/details/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { year, month } = req.query;

    if (!userId || !year || !month) {
      return res
        .status(400)
        .json({ error: "Missing required query parameters" });
    }

    const y = parseInt(year, 10);
    const m = parseInt(month, 10);

    if (isNaN(y) || isNaN(m) || m < 1 || m > 12) {
      return res.status(400).json({ error: "Invalid year or month format" });
    }

    const startDate = `${y}-${String(m).padStart(2, "0")}-01`;
    const endDate = `${y}-${String(m + 1).padStart(2, "0")}-01`;

    console.log(`Querying MongoDB from: ${startDate} to ${endDate}`);

    const records = await Attendance.find({
      userId,
      date: { $gte: startDate, $lt: endDate },
    }).sort({ date: 1 });

    // console.log("Fetched Records:", records);

    res.json(records);
  } catch (error) {
    console.error("Server Error Fetching Attendance:", error);
    res.status(500).json({ error: "Failed to fetch attendance records" });
  }
});

module.exports = router;
