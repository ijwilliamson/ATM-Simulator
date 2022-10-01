//Important - the atmControl must be initialized before use.

class Account {
    constructor (accName, accNumber, pin, balance) {
        this.accName = accName;
        this.accNumber = accNumber;
        this.pin = pin;
        this.balance = balance;
    }
};

class Log{
    constructor (accNumber, timeStamp, action, oldBalance, newBalance){
        this.accNumber = accNumber;
        this.timeStamp = timeStamp;
        this.action = action;
        this.oldBalance = oldBalance;
        this.newBalance = newBalance;
    }
};

// atmControl including Data and Control Functions
exports.atmControl = {
    // Account data - populated from json file
    accounts: [],

    // ATM Log data - declared empty and populates through use
    atmLog: [],



    // -----------------------------------------------------
    //ATM Functions
    // -----------------------------------------------------


    //load accounts from atmJsonData.json.
    //Note: for some reason using require automatically
    //parses the json file to an object without the need
    //to use JSON.parse.
    loadAccountsFromJson() {
        let json = require("./atmJsonData.json");
        json.forEach((element) => 
                        this.accounts.push(new Account(
                            element.accName,
                            element.accNumber,
                            element.pin,
                            element.balance
                        ))
        );
                        
        this.logInsert(new Log(
            accNumber = 99999999,
            timeStamp = new Date(),
            action = "Accounts Loaded",
            oldBalance = -1,
            newBalance = -1
        ));                        
    },
    // ------------------------------------------------

    // Load logs from Json
    loadLogFromJson() {
        try {
             let json = require("./atmJsonLog.json");
        json.forEach((element) => 
                        this.atmLog.push(new Log(
                            element.accNumber,
                            element.timeStamp,
                            element.action,
                            element.oldBalance,
                            element.newBalance
                        )));
        } catch (error) {
            console.log(error);
        }
       
        
        this.logInsert(new Log(
            accNumber = 99999999,
            timeStamp = new Date(),
            action = "Log Loaded",
            oldBalance = -1,
            newBalance = -1
        ));                        
    },
    
    // return an array of all accounts
    getAccounts() {
        return this.accounts;
    },

    // ------------------------------------------------

    insertCardSim() {},
    
    // Check if their is a match for account and pin
    checkPin(accNumber, pin) {
        selectedAccount = this.getAccount(accNumber);
        if (typeof(selectedAccount)=="undefined"){
            return false;
        }
        else{
            if(selectedAccount.pin == pin){
                return true;
            }
            else
            {
                return false;
            }
        }
        
    },

    // ----------------------------------------------------
    //Return the balance for a specific account
    checkBalance(accNumber) {
        selectedAccount = this.getAccount(accNumber);
        return selectedAccount.balance;
    },
    //---------------------------------------------------

    //Change the balance of an account 
    adjustBalance(accountNumber, amount) {
        temp = this.getAccount(accountNumber);
        oldBal = temp.balance;
        newBal = temp.balance += amount;
         
        i = this.accounts.indexOf(temp);
        
        if (i == -1)
        {console.log("Error finding acount index")}

        
        this.accounts[i].balance = newBal,
        
        this.saveAccounts();

        this.logInsert(new Log(
            accNumber = temp.accNumber,
            timeStamp = new Date(),
            action = `Balance Adjustment - (${amount})`,
            oldBalance = oldBal,
            newBalance = newBal
            
        ));
        
    },
    //Save the accounts to json
    saveAccounts() {

        let json = JSON.stringify(this.accounts);
        let fs = require('fs')
        fs.writeFile("./atmJsonData.json", json, 'utf8',  (err) => {
            if (err)
            {
                console.error(err);
            }
            else
            {
                return; 
            }

        });
    },
    //--------------------------------------------------

    //Return the account that has the privided account number
     getAccount(accNumber) {
        return(this.accounts.find((acc) =>
             acc.accNumber == accNumber
             ));
    },

    //--------------------------------------------------

    //Insert new log record into the log and save to file
    logInsert(logRecord) {
        this.atmLog.push(logRecord);
        
        // save log to a json file
        let json = JSON.stringify(this.atmLog);
        let fs = require('fs')
        fs.writeFile("./atmJsonLog.json", json, 'utf8',  (err) => {
            if (err)
            {
                console.error(err);
            }
            else
            {
                return; 
            }

        });
    },
    //--------------------------------------------------

    //Return the full log as an array
    getFullLog() {
        return this.atmLog;

    },

    //---------------------------------------------------

    //Return the log for a specific account
    getAccountLog(accountNumber) {
        return this.atmLog.filter((element) =>
                        element.accNumber == accountNumber)
    },
    //---------------------------------------------------

    // Initialise the ATM by loading account data and logs from Json
    initialize() {
        
        this.loadLogFromJson();
        this.loadAccountsFromJson();
        return true;
    }

    //-------------------------------------------------------
}









    