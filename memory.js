const child_process = require('child_process');
const BYTE_DIVISOR = 1024;
const convertUnit = require('./byte_unit_converter.js').bind(null, BYTE_DIVISOR);

const UNIT_SIZES = [
  'B',
  'kB', 
  'MB',
  'GB',
  'TB',
  'PB',
  'EB' // this should be big enough...
];

let global_totalMemory;

// Ported into NodeJS from python: https://apple.stackexchange.com/a/4296/216714

function getMemoryUsage(callback, forceRecalculateTotalMemory = false) {
  child_process.exec('vm_stat', (vm_error, vms_stdout, vm_stderr) => {
    if (vm_error) {
      throw new Error('ps execution error:' + vm_error);
    }
    // only spend time calculating the total memory once
    if (!global_totalMemory || forceRecalculateTotalMemory) {
      child_process.exec('system_profiler SPHardwareDataType | awk \'/Memory:/ {print $2,$3;}\'', (sys_error, sys_stdout, sys_sterr) => {
        if (sys_error) {
          throw new Error('system_profiler error:' + sys_error);
        }
        
        const totalText = sys_stdout.split(' ');
        global_totalMemory = {
          value: Number(totalText[0].trim()),
          unit: UNIT_SIZES.indexOf(totalText[1].trim())
        };
      
        handleMemoryInfo(vms_stdout, global_totalMemory, callback);
      });
    }
    else {
      handleMemeoryInfo(vms_stdout, global_totalMemory, callback);
    }
  });
}

function handleMemoryInfo(stdout, totalMemory, callback) {
  const lines = stdout.split('\n').map(line => line.trim().split(':  ').map(item => item.trim()));
  
  const pageSize = Number(/page size of (\d+) bytes/.exec(lines[0])[1]);
  
  const byteSizes = lines.slice(1).reduce((obj, row) => {
    if (row.length < 2 || row[0].length === 0) {
      return obj;
    }
    obj[row[0]] = Number(row[1]) * pageSize;
    return obj;
  }, {});
  
  const memory = {
    wired: convertUnit(byteSizes['Pages wired down']),
    active: convertUnit(byteSizes['Pages active']),
    compressed: convertUnit(byteSizes['Pages occupied by compressor']),
    total: totalMemory
  };
  
  if (callback) {
    callback(memory);
  }
}

module.exports = {
  getMemoryUsage: getMemoryUsage
};