let outside_byteSize; // scoped "global" variable for efficiency
let byteLogDivisor;

function convert(byteSize, value) {
  if (typeof value !== 'number') {
    throw new Error('Value input was not a number:' + String(value));
  }
  if (outside_byteSize !== byteSize) {
    outside_byteSize = byteSize;
    byteLogDivisor = 1 / Math.log(outside_byteSize);
  }
  
  const unit = Math.floor(Math.log(value) * byteLogDivisor);
  value = value / Math.pow(outside_byteSize, unit);
  
  return {
    value: value,
    unit: unit
  };
}

module.exports = convert;