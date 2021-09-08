from flask import Flask, request
import json
import requests
from os import linesep
ver = "V 1.0.6-stable-api"


app = Flask(__name__)


@app.route('/register', methods=['POST'])
def register():
    x = request.stream.read()
    s = x.decode("utf-8")
    print(s)
    if s.replace("-data", "").isnumeric() == True:
        f = open('C:/Users/whes1015/Desktop/Anti-cheat-server/資料庫.txt', 'r')
        line = f.read()
        LD = json.loads(line)
        if s.find("-data") == -1:
            if s in LD:
                r1 = requests.get('http://exptech.mywire.org:81/NoToolboxlist.php')
                return {"version": ver, "total": LD["total"], "status": "Success", "data": LD[s+"-data"], "reason": LD[s+"-reason"], "type": LD[s+"-type"], "frequency": LD[s+"-frequency"], "deprecated": r1.text}
            else:
                return {"version": ver, "total": LD["total"], "status": "Success", "data": "null"}
        else:
            if s.replace("-data", "")+"-data" in LD:
                return str(LD[s.replace("-data", "")+"-data"])
            else:
                return "null"

    else:
        r = requests.get('https://xbl-api.prouser123.me/xuid/'+s.replace("-data", ""))
        r1 = requests.get('http://exptech.mywire.org:81/NoToolboxlist.php')
        D = json.loads(r.text)
        if r.text.find("xuid") != -1:
            f = open('C:/Users/whes1015/Desktop/Anti-cheat-server/資料庫.txt', 'r')
            line = f.read()
            LD = json.loads(line)
            x = D["xuid"]
            if s.find("-data") == -1:
                if D["xuid"] in LD:
                    return {"version": ver, "total": LD["total"], "status": "Success", "data": LD[x+"-data"], "reason": LD[x+"-reason"], "type": LD[x+"-type"], "frequency": LD[x+"-frequency"], "deprecated": r1.text}
                else:
                    return {"version": ver, "total": LD["total"], "status": "Success", "data": "null"}
            else:
                if x+"-data" in LD:
                    return LD[x+"-data"]
                else:
                    return "null"
        else:
            return {"version": ver, "status": "Error", "data": "Cannot convert this name to XUID"}


if __name__ == '__main__':
    app.run(host="220.134.162.44", port=11000)
