// Admin utility to analyze attendance for fraud detection

export const analyzeAttendanceForFraud = (attendanceRecords) => {
  const deviceUsageMap = {};
  const matricMap = {};
  const fraudAlerts = [];

  attendanceRecords.forEach((record) => {
    const device = record.device_fingerprint;
    const matric = record.matric_no;

    // Track device usage
    if (!deviceUsageMap[device]) {
      deviceUsageMap[device] = [];
    }
    deviceUsageMap[device].push(matric);

    // Track matric usage
    if (!matricMap[matric]) {
      matricMap[matric] = [];
    }
    matricMap[matric].push(device);
  });

  // Check for multiple students from same device
  Object.entries(deviceUsageMap).forEach(([device, matrics]) => {
    const uniqueMatrics = new Set(matrics);
    if (uniqueMatrics.size > 1) {
      fraudAlerts.push({
        type: 'MULTIPLE_STUDENTS_SAME_DEVICE',
        severity: 'HIGH',
        device,
        students: Array.from(uniqueMatrics),
        message: `Device ${device} used by ${uniqueMatrics.size} different students`,
      });
    }
  });

  // Check for same student using multiple devices
  Object.entries(matricMap).forEach(([matric, devices]) => {
    const uniqueDevices = new Set(devices);
    if (uniqueDevices.size > 1) {
      fraudAlerts.push({
        type: 'SAME_STUDENT_MULTIPLE_DEVICES',
        severity: 'MEDIUM',
        matric,
        devices: Array.from(uniqueDevices),
        message: `Student ${matric} marked attendance from ${uniqueDevices.size} different devices`,
      });
    }
  });

  return {
    totalRecords: attendanceRecords.length,
    uniqueDevices: Object.keys(deviceUsageMap).length,
    fraudAlerts,
    deviceUsageMap,
    matricMap,
  };
};

// Generate fraud report
export const generateFraudReport = (classData) => {
  const analysis = analyzeAttendanceForFraud(classData.attendance || []);
  
  return {
    classId: classData.course_id,
    className: classData.course_title,
    date: classData.date,
    totalAttendees: analysis.totalRecords,
    uniqueDevices: analysis.uniqueDevices,
    suspiciousActivity: analysis.fraudAlerts.length > 0,
    alerts: analysis.fraudAlerts,
    riskScore: calculateRiskScore(analysis.fraudAlerts),
  };
};

// Calculate risk score (0-100)
const calculateRiskScore = (alerts) => {
  let score = 0;
  
  alerts.forEach((alert) => {
    if (alert.type === 'MULTIPLE_STUDENTS_SAME_DEVICE') {
      score += (alert.students.length * 20); // 20 points per extra student
    } else if (alert.type === 'SAME_STUDENT_MULTIPLE_DEVICES') {
      score += (alert.devices.length * 10); // 10 points per extra device
    }
  });

  return Math.min(score, 100); // Cap at 100
};
