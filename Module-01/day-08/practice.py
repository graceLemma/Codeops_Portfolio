
#def linear_search(items,target):
 #   for i, x in enumerate(items):
  #      if x == target:
   #         return i
#balances = [200,400,700,2000,2500,3000]
#linear_search(balances,3000)
#print(linear_search(balances,3000))

#def binary_search(items,target):
 #   lo,hi = 0,len(items)-1
  #  while lo <= hi:
   #     mid = (lo + hi) // 2
    #    if items[mid] == target:
     #       return mid
      #  elif items[mid] < target:
       #     lo = mid + 1
        #else:
         #   hi = mid - 1
   # return -1

#print(binary_search(balances,2500))
name = ("Almaz")
account = ("Alz001")
class Branch:
    def __init__(self, name):
        self.name = name
        self.accounts = []
        self.accounts = []
        def total_balance(self):
            return sum(account.balance for account in self.accounts)
        for child in self.children:
         total_balance += child.total_balance()
        return total_balance