atm = new require("./atmData");
if(atm.atmControl.initialize()) console.log("Initialised");


console.log(atm.atmControl.checkPin("99999999","9999"))
console.log(atm.atmControl.checkBalance("99999999"))
