from flask import Flask, request
import json
import requests
from os import linesep
ver = "V 1.0.0-stable-shop"


app = Flask(__name__)


@app.route('/register', methods=['POST'])
def register():
    x = request.stream.read()
    s = x.decode("utf-8")
    print(s)
    f = open('C:/Users/whes1015/Desktop/discordbot/兌換碼.txt', 'r')
    line = f.read()
    LD = json.loads(line)
    if str(s)+"-thing" in LD:
        x=LD[str(s)+"-thing"]
        y=str(LD[str(s)+"-quantity"])
        LD.pop(str(s)+"-thing")
        LD.pop(str(s)+"-quantity")
        f = open('C:/Users/whes1015/Desktop/discordbot/兌換碼.txt', 'w')
        f.write(json.dumps(LD))
        f.close()
        return x+"*"+y
    else:
        return "null"

if __name__ == '__main__':
    app.run(host="220.134.162.44", port=13000)
