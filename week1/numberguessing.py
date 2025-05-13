from random import randint

number_guessed = int(input("Guess from 1 to 10: "))
number_chosen = randint(1,10)
print(number_chosen)
if (number_guessed == number_chosen):
    print("Correct!")
elif (number_guessed > number_chosen):
    print ("Higher!")
else:
    print ("Lower")