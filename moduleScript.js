function init() {
  updateServerIP();
  requestStatus();
}

function moduleParameterChanged(param) {
  script.log(param.name + " parameter changed");

  if (param.isParameter()) {
    if (param.name === "ipAddress"){
      updateServerIP();
    } else if(param.name === "connected") {
      requestStatus();
    }
  }
}

function moduleValueChanged(value) {
  // script.log(value.name + " value changed");

  if (!value.isParameter()) {
    // if it is a trigger
    if (value.name === "powerOn") powerOn();
    else if (value.name === "standby") standby();
  }
}



// Here are the callback functions for the commands

function switchOn() {
  local.send('{"id":2, "src":"user_1", "method":"Switch.Set", "params":{"id":0, "on":true}}');
}

function switchOff() {
  local.send('{"id":2, "src":"user_1", "method":"Switch.Set", "params":{"id":0, "on":false}}');
}

function requestStatus(){
  local.send('{"id":2, "src":"user_1", "method":"Shelly.GetStatus"}');
}

// Callback function for data received

function wsMessageReceived(message){
  obj = JSON.parse(message);
  script.log(obj);
  // script.log(typeof(obj['params']['switch:0']['apower']));
  if (typeof(obj.src) !== 'undefined'){    
    local.values.shellyID.set(obj.src);
  } 

  if (typeof(obj['result']['switch:0']['output']) !== 'undefined'){    
    local.values.switchStatus.set(obj['result']['switch:0']['output']);
  } 
  if (typeof(obj['params']['switch:0']['output']) !== 'undefined'){    
    local.values.switchStatus.set(obj['params']['switch:0']['output']);
  }

  if (typeof(obj['result']['switch:0']['apower']) !== 'undefined'){    
    local.values.outputPower_W_.set(obj['result']['switch:0']['apower']);
  } 
  if (typeof(obj['params']['switch:0']['apower']) !== 'undefined'){    
    local.values.outputPower_W_.set(obj['params']['switch:0']['apower']);
  }

  if (typeof(obj['result']['switch:0']['voltage']) !== 'undefined'){    
    local.values.outputVoltage_V_.set(obj['result']['switch:0']['voltage']);
  } 
  if (typeof(obj['params']['switch:0']['voltage']) !== 'undefined'){    
    local.values.outputVoltage_V_.set(obj['params']['switch:0']['voltage']);
  }

  if (typeof(obj['result']['switch:0']['current']) !== 'undefined'){    
    local.values.outputCurrent_A_.set(obj['result']['switch:0']['current']);
  } 
  if (typeof(obj['params']['switch:0']['current']) !== 'undefined'){    
    local.values.outputCurrent_A_.set(obj['params']['switch:0']['current']);
  }

}

// utility functions

function updateServerIP(){
  var path = local.parameters.ipAddress.get() + "/rpc";
  local.parameters.serverPath.set(path);
}