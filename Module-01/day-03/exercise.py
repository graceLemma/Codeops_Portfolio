# question_1

temp = int(input("Enter the temperature in Celsius: "))

if temp < 15:
    print("cold")
elif 15 <= temp <= 28:
    print("warm")
else:
    print("hot")

# question_2
for i in range(1, 11):
    print(f"Receipt #",i)

    # question_3
    for i in range(1, 21):
        if i % 2 == 0:
            print(f"{i} is even")
       
       # question_4
price= int(input("Enter the price: "))
def discount_price (price, discount_percent):
    total = price - (price *discount_percent)
    return total
print(discount_price(price, discount_percent=0.1)) 

# question_5

i = 5
while i > 0:
    print(i)
    i -= 1
print("liftoff!")

