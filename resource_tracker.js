const storageTracker = require('./diskSpace.js');
// const memoryTracker = require('./memory.js');

class ResourceTracker {
  constructor(updateDelay) {
    this.intervalId = undefined;
    this.updateDelay = updateDelay;
    this.trackedValues = {
      memory: {
        
      },
      cpu: {
        
      },
      network: undefined,
      disk: undefined,
      storage: {
        devices: []
      },
      battery: {
        
      },
      energy: undefined,
      peripherals: undefined  
    };
  }
  
  changeDelay(updateDelay) {
    this.updateDelay = updateDelay;
  }
  
  start() {
    if (this.intervalId) {
      throw new Error('Tried to start tracking when starting already happened.');
      // return;
    }
    
    this.intervalId = setInterval(updateValues, this.updateDelay);
  }
  
  stop() {
    if (typeof this.intervalId !== 'number') {
      throw new Error('Tried to top tracking before it had been started.');
      // return;
    }
    
    clearInterval(this.intervalId);
  }
  
  handleDiskSpace(results) {
    this.trackedValues.storage.devices = results;
  }
  
  updateValues() {
    storageTracker.getDiskSpace(this.handleDiskSpace.bind(this));
  }
}

module.exports = new ResourceTracker();