from bankaccount import BankAccount, SavingsAccount, Transaction


print("\nWelcome to the bank! \n")
print("First, let's create an account")
print(
"""
Choose an option: 
1. BankAccount 
2. SavingsAccount 
"""
)
account_choice = input("Enter your choice: ").lower()

if account_choice == "bankaccount":
    balance = int(input("How much do you want to deposit? "))
    account = BankAccount(balance)
    print("Your account has been created! ")
if account_choice == "savingsaccount":
    balance = int(input("How much do you want to deposit? "))
    withdrawlimit = int(input("What do you want the withdraw limit to be? "))
    interestrate = int(input("What do you want the interest rate to be? "))
    account = SavingsAccount(balance, interestrate, withdrawlimit)
    print("Your account has been created! ")

print("Do you want to do anything else with us??")