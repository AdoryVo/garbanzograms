import json
from pathlib import Path

wordlist = open("NWL2023.txt")

# Lexicographical sort
new_wordlist = sorted(wordlist.readlines(), key=lambda line: line.partition(" ")[0])

processed_wordlist = Path("NWL2023_processed.txt")
processed_wordlist.write_text("".join(new_wordlist))

words_to_definitions = {
	a: c for line in new_wordlist for a, b, c in [line.partition(" ")]
}

processed_wordlist = Path("NWL2023_processed.json")
with open(processed_wordlist, "w") as wordlist_json:
	json.dump(words_to_definitions, wordlist_json, indent=4)