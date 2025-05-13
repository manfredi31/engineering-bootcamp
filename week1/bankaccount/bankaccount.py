import time
import uuid
import datetime
from datetime import timedelta

class BankAccount():
    
    def __init__(self, balance):
        self._balance = balance
        self._transaction_history = []

    def deposit (self, amount):
        if amount > 0:
            self._balance += amount 
            print (f"You succesfully deposited {amount} of dollars")
            transaction = Transaction("deposit", amount, status="Succesfull")
            self._transaction_history.append(transaction)
        else:
            print (f"You can't deposit a negative amount")
            transaction = Transaction("deposit", amount, status="Failed")
            self._transaction_history.append(transaction)

    def withdraw (self, amount):
        if amount < self._balance:
            self._balance -= amount
            print(f"Withdraw succesful. You now have ${self._balance:.2f} in your account.")
            transaction = Transaction("withdraw", amount, status="Succesfull")
            self._transaction_history.append(transaction)
        else:
            print(f"You don't have {amount} in your balance. You only have {self.balance}")
            transaction = Transaction("withdraw", amount, status="Failed")
            self._transaction_history.append(transaction)

    def transfer(self, other, amount):
        if not isinstance(other, BankAccount):
            print("Transfer failed: recipient is not a valid bank account.")
            transaction = Transaction("transfer", amount, to=other, status="Failed")
            self._transaction_history.append(transaction)
        elif amount > self._balance:
            print("Transfer failed: not enough funds.")
            transaction = Transaction("transfer", amount, to=other, status="Failed")
            self._transaction_history.append(transaction)
        else:
            self.withdraw(amount)
            other.deposit(amount)
            print(f"Transferred {amount} to other account.")
            transaction = Transaction("transfer", amount, to=other, status="Succesfull")
            self._transaction_history.append(transaction)

    def get_transactions_by_type(self, type):
        transactionswanted = []
        for transaction in self._transaction_history:
            if transaction._type == type:
                transactionswanted.append(transaction)
        return transactionswanted
    
    def get_transactions_after(self, timestamp):
        transactionswanted = []
        for transaction in self._transaction_history:
            if transaction._timestamp > timestamp:
                transactionswanted.append(transaction)
        return transactionswanted
    
    def get_total_by_type(self, type):
        total = 0
        for transaction in self._transaction_history:
            if transaction._type == type:
                total += transaction._amount
        return total

    def get_balance_change(self):
        total = 0
        for transaction in self._transaction_history:
            total += transaction._amount
        return total
    
    def __str__(self):
        return f"Your balance account is: {self._balance}"

    def show_history(self):
        for transaction in self._transaction_history:
            print(transaction)

    @property
    def balance (self):
        return self._balance
    
class SavingsAccount(BankAccount):

    def __init__(self, balance, interestrate, withdrawlimit):
        super().__init__(balance)
        self._interestrate = interestrate
        self._withdrawlimit = withdrawlimit
    
    def withdraw (self, amount): 
        if amount <= self._balance and amount <= self._withdrawlimit:
            self._balance -= amount
            print(f"Withdraw succesful. You now have ${self._balance:.2f} in your account.")
            transaction = Transaction("withdraw", amount, status="Succesfull")
            self._transaction_history.append(transaction)
        else:
            print(f"You don't have {amount} in your balance, or your limit is less than {amount}")
            transaction = Transaction("withdraw", amount, status="Failed")
            self._transaction_history.append(transaction)

    def apply_interest_continuously(self):
        while True:
            time.sleep(1)
            seconds_per_year = 365 * 24 * 60 * 60
            interest = self._balance * (self._interestrate / seconds_per_year)
            self._balance += interest
            print(f"Applied interest: +{interest:.6f}. New balance: {self._balance:.2f}")

    @property
    def interestrate (self):
        return self._interestrate
    
    @interestrate.setter
    def interestrate (self, value):
        self._interestrate = value
    
    @property
    def withdrawlimit (self):
        return self._withdrawlimit
    
    @withdrawlimit.setter
    def withdrawlimit (self, value):
        self._withdrawlimit = value

class Transaction():

    def __init__(self, type, amount, to=None, status=None):
        self._type = type
        self._amount = amount
        self._timestamp = datetime.datetime.now()
        self._tid = uuid.uuid4()
        self._to = to
        self._status = status

    def __str__(self):
        return f"Transaction of type {self._type}, amount {self._amount}, created at {self._timestamp}"