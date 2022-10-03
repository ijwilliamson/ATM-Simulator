const { atmControl } = require('./atmData');

atm = new require("./atmData");
if(atm.atmControl.initialize()) console.log("Initialised");

const prompt = require('prompt-sync')();

let AccountNumber = "";
let AccountName = "";
let error = "";
let cash = 0;

const Input = (options,screen) => {
    let userInput = "";
    
    do{
        screens[screen]();    
        userInput = prompt("Select an Option : ");

        if(options.indexOf(userInput)== -1) error = "Invalid Option, try again"


    } while(options.indexOf(userInput)== -1)

    return userInput;

}

const AccountCheck = () => {
    let userInput = "";

    do{
        screens.accNumberScreen();
        userInput = prompt("Enter Account Number :");
        if (userInput == "9") return 9;
        
        acc = typeof(atm.atmControl.getAccount(userInput))
        if (acc != "object") error = "Invalid Account Number";

    } while(acc != "object")
  
    
        AccountNumber = userInput;
        return userInput;

}

const PinCheck = () => {
    let userInput = "";

    do{
        screens.accPinScreen();
        userInput = prompt("Enter your Pin Number :");
        if (userInput == "9") return 9;

        pinResult = atm.atmControl.checkPin(AccountNumber,userInput);

        if (!pinResult) error = "Incorrect Pin Number"


    } while(!pinResult)

    AccountName =  atm.atmControl.getAccount(AccountNumber).accName;
    return true;

}

const withDrawOther = () => {
    let curBalance = 0;
    do{
        screens.accWithdrawAmountScreen();
        userInput = prompt("How much do you wish to withdraw :");
        if (userInput == "9") return 9;

        if (userInput%10 != 0)
        {
            error = "You must enter a multiple of £10"
        }
        curBalance = atm.atmControl.checkBalance(AccountNumber);
        if (curBalance < parseFloat(userInput)){
            error = `Insufficient funds. try again.`
        }

    } while(userInput%10 != 0 || curBalance < parseFloat(userInput))
    cash = userInput;
    
}

const depositAmount = () => {
    let curBalance = 0;
    do{
        screens.accDepositAmountScreen();
        userInput = prompt("How much are you depositing? :");
        if (userInput == "9") return 9;

        if (userInput%10 != 0)
        {
            error = "You must enter a multiple of £1"
        }
        
        if (userInput%1 != 0)
        {
            error = `You can only deposit Notes`
        }
        
 

    } while(userInput%10 != 0)
    cash = userInput;
    
}

screens = {

    //Note it is important to make a deep copy of the masterScreen to retain
    //its integrity so that the copies do not become corrupted with values
    //from the other screens.  I use JSON.stringify() and JSON.parse() to 
    //perfom the deep copy as per the method on mdn
    // https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy
    
    deepMasterCopy(){
       
        return JSON.parse(JSON.stringify(this.masterScreen)) ;
    },

    //Build the error line and return as a string for use on the screens
    errorLine(){
        if (error.length == 0) return "│                                           │";
        
        let errlen = error.length;
        let blanks = 37-errlen;
        let oddFix = "";
        if (blanks%2){oddFix = " "}
        
        let line = `│  *${" ".repeat(parseInt(blanks/2))}${error}${" ".repeat(parseInt(blanks/2))}${oddFix}*  │`
        return line;
        
    },

    masterScreen: [
        ("┌───────────────────────────────────────────┐"),
        ("│         Welcome to Snurgle Bank           │"),
        ("├───────────────────────────────────────────┤"),
        ("│                                           │"),
        ("│                                           │"),
        ("│                                           │"),
        ("│                                           │"),
        ("│                                           │"),
        ("│                                           │"),
        ("│                                           │"),
        ("│                                           │"),
        ("│                                           │"),
        ("└───────────────────────────────────────────┘")],

    
    introScreen(){
        temp = this.deepMasterCopy();
        temp[4] = ("│         1. Simulate Card Insert           │");
        temp[6] = ("│         9. Quit                           │");
        this.display(temp);
    },

    accNumberScreen(){
        temp = this.deepMasterCopy();
        temp[4] = ("│         Enter Your Account Number         │");
        temp[6] = ("│         9. Back                           │");
        this.display(temp);
    },

    accPinScreen(){
        temp = this.deepMasterCopy();
        temp[4] = ("│         Enter Your Pin                    │");
        temp[6] = ("│         9. Back                           │");
        this.display(temp);
    },

    accAccountOptionScreen(){
        temp = this.deepMasterCopy();
        temp[3] = (`│         Hello ${AccountName.padEnd(28)}│`);
        temp[5] = ("│  1. Check Balance      2. Withdraw Cash   │");
        temp[7] = ("│  3. Change Pin         4. Deposit Cash    │");
        temp[9] = ("│  5. Recent Activity    9. Back            │");

        this.display(temp);
    },

    accBalanceScreen(){
        temp = this.deepMasterCopy();
        temp[3] = (`│         Hello ${AccountName.padEnd(28)}│`);
        temp[5] = ("│         Your Current Balance              │");
        temp[7] = (`│         £${(atm.atmControl.checkBalance(AccountNumber)).toString().padEnd(33)}│`);
        temp[9] = ("│  1. Withdraw Cash      9. Back            │");
        this.display(temp);
    },

    accWithdrawScreen(){
        temp = this.deepMasterCopy();
        temp[3] = (`│         Hello ${AccountName.padEnd(28)}│`);
        temp[5] = ("│  1. £10                2. £20             │");
        temp[7] = ("│  3. £30                4. £40             │");
        temp[9] = ("│  5. Other Amount       9. Back            │");

        this.display(temp);
    },

    accWithdrawCompleteScreen(){
        temp = this.deepMasterCopy();
        temp[3] = (`│         Hello ${AccountName.padEnd(28)}│`);
        temp[5] = ("│  Remove your card                         │");
        temp[7] = (`│  Remove your £${parseFloat(cash).toFixed(2).padEnd(28)}│`);
        temp[9] = ("│                        9. Confirm         │");

        this.display(temp);
    },

    accDepositCompleteScreen(){
        temp = this.deepMasterCopy();
        temp[3] = (`│         Hello ${AccountName.padEnd(28)}│`);
        temp[5] = ("│  Place Deposit Envelope in the draw       │");
        temp[7] = (`│  Deposit amount £${parseFloat(cash).toFixed(2).padEnd(25)}│`);    
        temp[9] = ("│                        9. Confirm         │");

        this.display(temp);
    },

    accWithdrawAmountScreen(){
        temp = this.deepMasterCopy();
        temp[3] = (`│         Hello ${AccountName.padEnd(28)}│`);
        temp[5] = ("│     Enter amount to withdraw (max £250)   │");
        temp[7] = ("│     9. Back                               │");
        this.display(temp);
        
    },

    accDepositAmountScreen(){
        temp = this.deepMasterCopy();
        temp[3] = (`│         Hello ${AccountName.padEnd(28)}│`);
        temp[5] = ("│  Enter amount depositing  (max 50 notes)  │");
        temp[7] = ("│  9. Back                                  │");
        this.display(temp);
        
    },

    ErrScreen(){
        temp = this.deepMasterCopy();
        temp[4] = ("│         No Screen yet                     │");
        temp[6] = ("│         9. Back                           │");
        this.display(temp);
    },

    display(screen) {
        console.clear()
        screen[11] = this.errorLine();
        screen.forEach(element => console.log(element))
        error = "";
        
    }
};

option = 0; // 0 Inital Screen, 1 Intro Screen, 9 Quit


//Main Loop handles checks the current selected 
//option and builds the required screen and waits for the user input
//note: different input options use specific functions
//      i.e. general choices use the Input Function but there are specific
//           functions for Account Number, Pin entry, change pin and cash Amounts.
while (option != 9)
    {
        switch (option){
            case 0:  //Intro Screen
                AccountNumber="";
                AccountName="";
                
                var o = Input(["1","9"],"introScreen");
                if (o == 9){ option = 9}
                if (o == 1){ option = 1}
                break;

            case 1:  //Account Number Screen
                var o = AccountCheck();
                if (o == 9){ option = 0;}
                else {option = 2}
                break;
            
            case 2:  //Pin Screen
                var o = PinCheck();
                if (o == 9){option = 0}
                else {option = 3}
                break;
            
            case 3: //Account Options Screen
                var o = Input(["1","2","3","4","5","9"],"accAccountOptionScreen");
                if (o == 9){ option = 0}  //Exit
                if (o == 1){ option = 4}  //Check Balance
                if (o == 2){ option = 5}  //Withdraw Cash
                if (o == 3){ option = 6}  //Change Pin
                if (o == 4){ option = 7}  //Deposit Cash
                if (o == 5){ option = 8}  //Account Activity
                
                break;

            case 4:  //Balance Screen
                var o = Input(["1","9"],"accBalanceScreen");
                if (o == 9){ option = 3}  //Back    
                if (o == 1){ option = 5}  //Withdraw Cash
                break;

            case 5: //Withdrawl Screen
                var o = Input(["1","2","3","4","5","9"],"accWithdrawScreen");
                if (o == 9){ option = 3}  //Back
                if (o == 1){ option = 51}  //£10
                if (o == 2){ option = 52}  //£20
                if (o == 3){ option = 53}  //£30
                if (o == 4){ option = 54} //£40
                if (o == 5){ option = 55} //Other Amount
                break;

            case 51:  // Withdrawl Confirm Screen
            case 52:
            case 53:
            case 54:
            cash = ((option-50)*10);
            atm.atmControl.adjustBalance(AccountNumber,0-((option-50)*10));   
            var o = Input(["9"],"accWithdrawCompleteScreen");
            AccountName = "";
            AccountNumber = "";
            cash = 0;
            error = ""
            if (o == 9){ option = 0}  //Logged out   
            break; 

            case 55: //withdraw other amount
                var o = withDrawOther();
                if (o == 9){
                    option = 5;
                    break;}
                
                option = 9;
                atm.atmControl.adjustBalance(AccountNumber,0-(cash));   
                var o = Input(["9"],"accWithdrawCompleteScreen");
                if (o == 9){ option = 9}  //Exit
                cash = 0;
                break;

            case 7: //deposit amount
                var o = depositAmount();
                if (o == 9){
                    option = 5;
                    break;}
                
                option = 9;
                atm.atmControl.adjustBalance(AccountNumber,parseFloat(cash));   
                var o = Input(["9"],"accDepositCompleteScreen");
                if (o == 9){ option = 3}  //Exit
                cash = 0;
                break;

            default:  // Handles any options not configured
                var o = Input(["9"],"ErrScreen");
                if (o == 9){ option = 3}
                break;
            }
            


    }

