ver="V 1.0.2-stable-check"
import random
from flask import Flask, request

app = Flask(__name__)

@app.route('/register', methods=['GET'])
def register():
    try:
        x = str(random.randrange(10000000000000000000, 99999999999999999999))
        f = open('C:/Users/whes1015/Desktop/Anti-cheat-server/驗證碼.txt', 'a')
        f.write("^"+x+"^")
        f.close()
        return x
    except:
        return {"version": ver,"status": "Error", "data": "Unable to respond to request"}


if __name__ == '__main__':
    app.run(host="220.134.162.44", port=12000)
