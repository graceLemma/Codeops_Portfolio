#Question-1

  #test-1
numbers = (1,2,3,6,4,8)
for num in numbers:
 if num ==4:
  print (num)

  #test-2
  numbers =(0,1,2,3,4)
 for num in numbers:
   if num %2 == 0:
      print(num)



#Question-2

      #test-1

def tire (numbers):
    tens = numbers // 10
    uni = numbers % 10
    reverse_numbers = (uni *10) + tens

    if numbers > reverse_numbers:
        return "Ok"
    elif numbers < reverse_numbers:
        return "Not ok"
    else:
       return "equal"



#Question-3

def factorial(numbers):
   result = 1 
   for x in range(1, numbers + 1):
      result *= x
   return result
print (factorial(5))
print (factorial(6))
print (factorial(0))

#Question-4

def checkMeera(arr):
    for n in arr:
        if n * 2 in arr:
            print("I am NOT a Meera array")
            return
            
    print("I am a Meera array")

    #Question-5

    from collections import Counter
def isDual(arr):
    counts = Counter (arr)
    for count in counts.values():
        if count != 2:
            return 0
            
    return 1

print(isDual([1, 2, 1, 3, 3, 2]))  
print(isDual([2, 5, 2, 5, 5]))     
print(isDual([3, 1, 1, 2, 2]))     

#Question-5
def digitalClock(seconds):
    seconds = seconds % 86400
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    secs = seconds % 60
    
    return f"{hours:02d}:{minutes:02d}:{secs:02d}"

print(digitalClock(5025))  
print(digitalClock(61201))  
print(digitalClock(87000)) 