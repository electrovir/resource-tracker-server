const child_process = require('child_process');
const fs = require('fs');

const diskInfo = child_process.exec('diskutil info -all', (error, stdout, stderr) => {
  if (error) {
    console.error('diskutil execution error:' + error);
    return;
  }
  
  handleDiskInfo(stdout);
});

function handleDiskInfo(infoPrintOut) {
  const lines = infoPrintOut.split('\n');
  
  let devices = [];
  let currentDevice = {};
  
  lines.forEach((line, index) => {
    if (line === '**********') {
      devices.push(currentDevice);
      currentDevice = {};
    }
    else if (line.trim().length > 0) {
      const matches = /^\s*(.+?):\s{2,}(.+?)\s*$/.exec(line);
      const key = matches[1];
      let value = matches[2];
      if (value.toLowerCase() === 'none' || value.toLowerCase() === 'no' || value.toLowerCase().substring(0, 14) === 'not applicable') {
        value = false;
      }
      else if (value.toLowerCase() === 'yes') {
        value = true;
      }
      currentDevice[key] = value;
    }
  });
  
  const results = devices.map(makeReadable);
  
  // TODO: do something with results
}

// THIS MUTATES THE OBJECT IT IS PASSED
function makeReadable(info) {
  const desiredKeys = [
    'Device Identifier',
    'Device Node',
    'Part of Whole',
    'Device / Media Name',
    'Volume Name',
    'Mount Point',
    'Partition Type',
    'Total Size',
    'Volume Free Space',
    'Device Location',
  ];
  
  Object.keys(info).forEach(key => {
    if (desiredKeys.indexOf(key) === -1) {
      delete info[key];
    }
    else if ((key === 'Total Size' || key === 'Volume Free Space') && info[key]) {
      info[key] = /^.+?\((\d+) Bytes\).+$/.exec(info[key])[1];
    }
  });
  return info;
}