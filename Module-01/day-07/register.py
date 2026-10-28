class Account:
    def __init__(self, owner, account_number, balance):
        self.owner = owner
        self.account_number = account_number
        self.__balance = balance
        self.observers = []
        self.history = []

    @property
    def balance(self):
        return self.__balance

    def subscribe(self, observer):
        self.observers.append(observer)

    def notify(self, message):
        for observer in self.observers:
            observer.update(message)

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            self.history.append(("deposit", amount))
            self.notify(f"{self.owner} deposited {amount}. Balance: {self.balance}")
        else:
            print("Invalid deposit amount.")

    def withdraw(self, amount):
        if amount <= self.balance:
            self.__balance -= amount
            self.history.append(("withdraw", amount))
            self.notify(f"{self.owner} withdrew {amount}. Balance: {self.balance}")
        else:
            print("Insufficient balance.")

    def undo_last(self):
        if not self.history:
            print("No transaction to undo.")
            return

        transaction, amount = self.history.pop()

        if transaction == "deposit":
            self._Account__balance -= amount
            print(f"Undo deposit of {amount}")

        elif transaction == "withdraw":
            self._Account__balance += amount
            print(f"Undo withdrawal of {amount}")

    def statement(self):
        print(f"Owner: {self.owner}")
        print(f"Account Number: {self.account_number}")
        print(f"Balance: {self.balance}")
        print("-" * 30)


class SavingsAccount(Account):
    def __init__(self, owner, account_number, balance, rate):
        super().__init__(owner, account_number, balance)
        self.rate = rate

    def add_interest(self):
        interest = self.balance * self.rate
        self.deposit(interest)

    def statement(self):
        print("Savings Account")
        super().statement()


class CurrentAccount(Account):
    def __init__(self, owner, account_number, balance, overdraft):
        super().__init__(owner, account_number, balance)
        self.overdraft = overdraft

    def withdraw(self, amount):
        if amount <= self.balance + self.overdraft:
            self._Account__balance -= amount
            self.history.append(("withdraw", amount))
            self.notify(f"{self.owner} withdrew {amount}. Balance: {self.balance}")
        else:
            print("Overdraft limit exceeded.")

    def statement(self):
        print("Current Account")
        super().statement()


class SMSAlert:
    def update(self, message):
        print("SMS Alert:", message)


class AccountFactory:

    @staticmethod
    def create(account_type, owner, account_number, balance):
        if account_type.lower() == "savings":
            return SavingsAccount(owner, account_number, balance, 0.05)
        elif account_type.lower() == "current":
            return CurrentAccount(owner, account_number, balance, 500)
        else:
            return Account(owner, account_number, balance)


class AccountRegistry:
    def __init__(self):
        self.accounts = {}

    def add(self, account):
        self.accounts[account.account_number] = account

    def list_all(self):
        numbers = list(self.accounts.keys())
        numbers.sort()

        for number in numbers:
            self.accounts[number].statement()


sms = SMSAlert()

registry = AccountRegistry()

acc1 = AccountFactory.create("savings", "Abebe", "abb01", 2000)
acc2 = AccountFactory.create("current", "Selam", "sel02", 1500)
acc3 = AccountFactory.create("account", "Almaz", "alz03", 1000)

accounts = [acc1, acc2, acc3]

for account in accounts:
    account.subscribe(sms)
    registry.add(account)

acc1.deposit(500)
acc1.add_interest()

acc2.withdraw(1800)

acc3.deposit(300)
acc3.withdraw(100)

print("\nAll Accounts")
registry.list_all()
