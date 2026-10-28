total = int (input ("Enter the total bill amount: "))
number_of_people = int (input ("Enter the number of people: "))
def split_the_bill(total, number_of_people, rate= 0.10):
    total_with_tip = total + (total * rate)
    return total_with_tip / number_of_people
print(split_the_bill(total, number_of_people))