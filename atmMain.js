atm = new require("./atmData");
if(atm.atmControl.initialize()) console.log("Initialised");
console.log("ATM Loaded");
atm.atmControl.adjustBalance(12345678,-20.47);
console.log("done");
