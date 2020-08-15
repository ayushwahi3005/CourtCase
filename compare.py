from difflib import SequenceMatcher
import sys



def similar(a,b):
	return SequenceMatcher(None, a, b).ratio()

print(float("{:.2f}".format(similar(sys.argv[1],sys.argv[2])*100)))

