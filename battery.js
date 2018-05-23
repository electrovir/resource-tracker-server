const fs = require('fs');
const child_process = require('child_process');

function handleBatteryInfo(input, callback) {
  const allData = input.split('\n').reduce((obj, line) => {
    const matches = /\s+"(.+)" = (.+)$/.exec(line);
    if (matches) {
      const key = matches[1];
      const value = matches[2];
      obj[key] = value;
    }
    return obj;
  }, {});
  
  let ordered = {};
  Object.keys(allData).sort().forEach(function(key) {
    ordered[key] = allData[key];
  });
  
  console.log(ordered);
  
  const result = {
    pluggedIn: allData.ExternalConnected === 'Yes',
    designCycleCount: Number(allData.DesignCycleCount9C),
    currentCharge: Number(allData.CurrentCapacity), // mAh
    maxCharge: Number(allData.MaxCapacity),         // mAh
    designCharge: Number(allData.DesignCapacity),
    full: allData.FullyCharged === 'Yes',
    charging: allData.isCharging === 'No',
    cycles: Number(allData.CycleCount),
    timeRemaining: Number(allData.TimeRemaining), // in minutes
    temperature: Number(allData.Temperature) / 1000, // C
    hasBattery: allData.BatteryInstalled === 'Yes'
  };
  // 
  // if (callback) {
  //   callback(result);
  // }
}

function getBatteryStats(callback) {
  child_process.exec('ioreg -rc AppleSmartBattery', (ioreg_error, ioreg_stdout, ioreg_stderr) => {
    if (ioreg_error) {
      throw new Error('system_ioreg execution error:' + ioreg_error);
    }
    
    handleBatteryInfo(ioreg_stdout, callback);
    
  });
}

getBatteryStats(console.log);

module.exports = {
  getBatteryStats: getBatteryStats
};