#top by balance
def top_by_balance(accounts):
    accounts = sorted(accounts, key=lambda x: x.balance, reverse=True)

    for i in range(len(accounts)):
        print(f"Owner: {accounts[i].owner}")
        print(f"Account Number: {accounts[i].account_number}")
        print(f"Balance: {accounts[i].balance}")
        print("-" * 30)

#binary search
def binary_search(accounts, target_balance):
    left, right = 0, len(accounts) - 1

    while left <= right:
        mid = (left + right) // 2
        if accounts[mid].balance == target_balance:
            return accounts[mid]
        elif accounts[mid].balance < target_balance:
            left = mid + 1
        else:
            right = mid - 1

    return None
#find by account number
def find_by_account_number(accounts, account_number):
    for account in accounts:
        if account.account_number == account_number:
            return account
    return None


#recursive total transactions

def total_transactions(self,history=None):
    if history is None:
        history = self.history

    if len(history)==0:
        return 0
        total_transactions = history[0]
        return total_transactions[1] + self.total_transactions(history[1:])
    
    print("\nTop 2 Blances")
    