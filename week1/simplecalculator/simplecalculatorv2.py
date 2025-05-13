from operator import add, sub, mul, truediv

operation = input("What do you want to do? (add, subtract, multiply, divide): ").lower()
while operation not in ["add", "subtract", "multiply", "divide"]:
    operation = input("What do you want to do? (add, subtract, multiply, divide): ").lower()
while True:
    try:
        first_number = int(input("First number: "))
        break
    except ValueError:
        print("Only digits please. ")
while True:
    try:
        second_number = int(input("Second number: "))
        break
    except ValueError:
        print("Only digits please.")

dict = {"add": add, "subtract": sub, "multiply": mul, "divide": truediv}

def calculator(operation, first_number, second_number):  
    try:
        return dict[operation](first_number, second_number)
    except ZeroDivisionError:
        return "Cannot divide by zero"

print(calculator(operation, first_number, second_number))