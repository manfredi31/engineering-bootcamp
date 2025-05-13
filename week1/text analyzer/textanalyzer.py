from string import punctuation

with open("test.txt") as reader:
    contents = reader.read()

words = contents.lower().split()
words_nopunct = []

for e in words:
    words_nopunct.append(e.strip(",:."))

dict = {}

def myfunc(ciao):
    return ciao[1]

for e in words_nopunct:
    if e not in dict.keys():
        dict[e] = 1
    else: 
        dict[e] += 1

# dicttosort = list(dict.items())
# dicttosort.sort(reverse=True, key=myfunc)

# print(dicttosort[0:10])
# print("\n")

# longestshortest = {}
# for e in dict:
    # longestshortest[e] = len(e)
# longshorttosort = list(longestshortest.items())
# longshorttosort.sort(reverse=True, key=myfunc)
# print("This is form longest to shortest:", "\n", "\n", longshorttosort)

print(list(dict.keys()))
print(len(set(list(dict.keys()))))

