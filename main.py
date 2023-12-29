from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room
import json
from gptGerneration import apiUtil
import os

from gptGerneration.auth import login_required

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

app.config.from_mapping(
    SECRET_KEY='dev',
    DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
)

from . import db

db.init_app(app)
from . import auth

app.register_blueprint(auth.bp)


@socketio.on('message')
def handle_string(msg):
    print("server received:" + msg)


@login_required
@app.route('/index')
def index():
    return render_template("index.html")


@socketio.event
def SendContent(message):
    generation = apiUtil.text_generation(message['content'])
    results = json.loads(generation.text)
    emit('messageReceived', {"user": request.sid, "room": request.sid, "content": results['result']})


@socketio.event
def getImg(message):
    images = apiUtil.text_to_images(message['content'], '')
    for i in range(len(images['data'])):
        emit('imageReceived', {"user": request.sid, "room": request.sid, "content": images['data'][i]})


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
