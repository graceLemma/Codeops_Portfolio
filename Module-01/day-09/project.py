#branch 
class Branch:
    def __init__(self, name, balance):
        self.name = name
        self.balance = balance
        self.childern = []

        def add_branch(self, branch):
            self.childern.append(branch)

            def total_balance(self):
                total = self.balance
                for child in self.childern:
                    total += child.total_balance()
                    return total
class BankGraph:
    def __init__(self):
      self.graph = {}
      def add_connection(self, first, second):
        if first not in self.graph[first] = []
            self.graph[first].append(second)
def bfs(self, start):