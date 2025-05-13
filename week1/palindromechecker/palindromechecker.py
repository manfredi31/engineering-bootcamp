tocheck1 = []
string = input("Choose a word: ")
for char in string:
    tocheck1.insert(0, char)
print(tocheck1)
tocheck2 = "".join(tocheck1)
print(tocheck2)
print(string == tocheck2)