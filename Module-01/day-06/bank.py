class account:
    def __init__(self,owner, account_number, balance):
        self.owner = owner
        self.account_number = account_number
        self.balance = balance
        self.observers = []

        def balance(self):
            return self.balance
        
        def subscribe(self, observer):
            self.observers.append(observer)

            def notify(self, message):
                for observer in self.observers:
                    observer.update(message)

                    def deposit (self, amount):
                        if amount > 0:
                            self.balance += amount
                            self.notify(f"{self.owner}deposited {amount}. balance: {self.balance}")
                        else:
                            print("Deposit amount must be positive.")
                            def statement(self):
                                print("current account")
                                super().statement()
                                class msg:
                                    def update(self, message):
                                        print("msg:", message)
class AccountObserver:
                   def create(account_type, owner, accounet_number, balance):
                       if account_type.lower() == "savings":
                           return accounet_number (owner, accounet_number, balance, 0.05)
                       elif account_type.lower() == "checking":
                        return accounet_number (owner, accounet_number, balance, 700)
                       else: 
                            return None
                       sms= msg()
                       acc1= AccountObserver.create("savings", "Almaz", "ALZ001", 3000)
                       acc2= AccountObserver.create("checking", "Abebe", "ABB002", 2000)
                       acc1.subscribe(sms)
                       acc2.subscribe(sms)

                       acc1.deposit(500)
                       acc1.add_interest()
                       acc2.withdraw(1500)

                       accounts= [acc1, acc2]
                       for account in accounts:
                           print(f"Owner: {account.owner}")
                           print(f"Account Number: {account.account_number}")
                           print(f"Balance: {account.balance}")