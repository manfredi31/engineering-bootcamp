
operation = input("What do you want to do (add, subtract, multiply, divide): ").lower()
first_number = int(input("First number: "))
second_number = int(input("Second number: "))

def calculator(operation, first_number, second_number): 
    if operation == "add":
        return first_number + second_number 
    elif operation == "subtract":
        return first_number - second_number
    elif operation == "multiply":
        return first_number*second_number
    elif operation == "divide":
        return first_number//second_number

print(calculator(operation, first_number, second_number))