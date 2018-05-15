const child_process = require('child_process');
const convertUnit = require('./byte_unit_converter.js');

function getDiskSpace(callback) {

  const diskInfo = child_process.exec('diskutil info -all', (error, stdout, stderr) => {
    if (error) {
      throw new Error('diskutil execution error:' + error);
      // return;
    }
    
    handleDiskInfo(stdout, callback);
  });
}

function handleDiskInfo(infoPrintOut, callback) {
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
  
  const results = devices.map(makeReadable).filter(device => device['Volume Name']).map(device => {
    return {
      totalSpace: device['Total Size'],
      freeSpace: device['Volume Free Space'],
      name: device['Volume Name'],
      parent: device['Part of Whole'],
      bootDisk: device['Mount Point'] === '/'
    };
  });
  
  callback(results);
}

const DESIRED_KEYS = [
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
  // why not 1024 you ask? idk! lol! for memory I have to use 1024
const BYTE_DIVISOR = 1000;

// THIS MUTATES THE OBJECT IT IS PASSED
// for the sake of performance
function makeReadable(info) {
  
  Object.keys(info).forEach(key => {
    if (DESIRED_KEYS.indexOf(key) === -1) {
      delete info[key];
    }
    else if ((key === 'Total Size' || key === 'Volume Free Space') && info[key]) {
      value = Number(/^.+?\((\d+) Bytes\).+$/.exec(info[key])[1]);
      
      info[key] = convertUnit(BYTE_DIVISOR, value);
    }
  });
  return info;
}

module.exports = {
  getDiskSpace: getDiskSpace
};