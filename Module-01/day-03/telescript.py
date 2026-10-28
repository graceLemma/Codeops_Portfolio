totals = {}

try:
    with open("day3/transactions.txt", "r") as file:
        for line in file:
            name, amount = line.strip().split(",")
            amount = int(amount)

            if name in totals:
                totals[name] += amount
            else:
                totals[name] = amount

    print("Customer Totals")
    for name, total in sorted(totals.items(), key=lambda x: x[1], reverse=True):
        print(f"{name}: {total}")

    with open("report.txt", "w") as report:
        report.write("Customer Totals\n")
        for name, total in sorted(totals.items(), key=lambda x: x[1], reverse=True):
            report.write(f"{name}: {total}\n")

except FileNotFoundError:
    print("transactions.txt was not found.")