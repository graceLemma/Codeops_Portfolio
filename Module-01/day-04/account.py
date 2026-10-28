class Account:
    def __init__(self, owner, account_number, balance):
        self.owner = owner
        self.account_number = account_number
        self.__balance = balance

    @property
    def balance(self):
        return self.__balance

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            print(f"Deposited {amount} successfully.")
        else:
            print("Deposit amount must be positive.")

    def withdraw(self, amount):
        if amount <= 0:
            print("Withdrawal amount must be positive.")
        elif amount > self.__balance:
            print("Insufficient balance.")
        else:
            self.__balance -= amount
            print(f"Withdrew {amount} successfully.")


# Create accounts
account1 = Account("Almaz", "ALZ001", 1500)
account2 = Account("Abebe", "ABB002", 1000)

# Transactions
account1.deposit(500)
account1.withdraw(300)

account2.deposit(200)
account2.withdraw(1500)  
account2.withdraw(500)

# Print results
print("\nAccount Details")
print(f"Owner: {account1.owner}")
print(f"Account Number: {account1.account_number}")
print(f"Balance: {account1.balance}")

print(f"Owner: {account2.owner}")
print(f"Account Number: {account2.account_number}")
print(f"Balance: {account2.balance}")
print(f"Balance: {account2.balance}")

