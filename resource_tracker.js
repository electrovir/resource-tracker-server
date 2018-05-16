const storageTracker = require('./diskSpace.js');
const memoryTracker = require('./memory.js');

const DEFAULT_UPDATE_INTERVAL = 5000;
const MINIMUM_UPDATE_INTERVAL = 1000;
const SLOW_UPDATE_INTERVAL = 5;
const MAX_UPDATE_WITHOUT_REQUEST = 5;

class ResourceTracker {
  constructor(updateDelay = DEFAULT_UPDATE_INTERVAL) {
    this.intervalTimer = undefined;
    this.updateDelay = updateDelay;
    this.updateCounter = 0;
    this.updatesSinceLastRequest = 0;
    this._stats = {
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
  
  get trackedValues() {
    this.updatesSinceLastRequest = 0;
    return this._stats;
  }
  
  changeDelay(updateDelay) {
    if (updateDelay >= MINIMUM_UPDATE_INTERVAL) {
      this.updateDelay = updateDelay;
      console.info('Update period changed to ' + this.updateDelay + 'ms.');
      if (this.intervalTimer) {
        this.stopUpdating();
        this.startUpdating();
      }
    }
  }
  
  startUpdating() {
    if (this.intervalTimer) {
      throw new Error('Tried to start tracking when starting already happened:' + this.intervalTimer);
      // return;
    }
    
    this.intervalTimer = setInterval(this.updateValues.bind(this), this.updateDelay);
    console.info('Updating started with ' + this.updateDelay + 'ms delay.');
  }
  
  stopUpdating() {
    if (!this.intervalTimer) {
      throw new Error('Tried to stop tracking before it had been started.');
      // return;
    }
    
    clearInterval(this.intervalTimer);
    this.intervalTimer = false;
    console.info('Updating stopped.');
  }
  
  handleDiskSpace(results) {
    this._stats.storage.devices = results;
  }
  
  handleMemoryUsage(results) {
    this._stats.memory.usage = results;
    this._stats.memory.total = results.total;
    delete this._stats.memory.usage.total;
  }
  
  updateValues() {
    if (this.updatesSinceLastRequest > MAX_UPDATE_WITHOUT_REQUEST) {
      return;
    }
    else if (this.updatesSinceLastRequest === MAX_UPDATE_WITHOUT_REQUEST) {
      console.info('Pausing updates till further requests are made...');
    }
    
    if (this.updateCounter % SLOW_UPDATE_INTERVAL === 0) {
      storageTracker.getDiskSpace(this.handleDiskSpace.bind(this));
    }
    memoryTracker.getMemoryUsage(this.handleMemoryUsage.bind(this));
    this.updateCounter++;
    this.updatesSinceLastRequest++;
  }
}

module.exports = new ResourceTracker();