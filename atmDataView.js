atm = new require("./atmData");
if(atm.atmControl.initialize()) console.log("Initialised");
console.table(atm.atmControl.getFullLog());
console.table(atm.atmControl.getAccounts());