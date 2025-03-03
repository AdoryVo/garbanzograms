import json

wordlist = open("NWL2023.txt")  # Source: github.com/scrabblewords

# Lexicographical sort for readability
new_wordlist = sorted(wordlist.readlines(), key=lambda line: line.partition(" ")[0])
words_to_definitions = {
    word: definition
    for line in new_wordlist
    for word, _, definition in [line.partition(" ")]
}

with open("NWL2023.json", "w") as wordlist_json:
    json.dump(words_to_definitions, wordlist_json, indent=4)
