import time
import pusherclient

import pincontrol

global pusher


def consume_char(char):
    cid = ord(char)
    if (cid < 65):
        off_all()
    elif (cid < 91):
        set_led(cid-65)
        time.sleep(1);
    elif (cid < 97):
        off_all()
    elif (cid < 123):
        set_led(cid-97)
        time.sleep(1);
    else:
        off_all()

def callback(bot_response):
    for char in bot_response['text']:
        consume_char(char)

def connect_handler(data):
    channel = pusher.subscribe('questions')
    channel.bind('bot-response', callback)

pusher = pusherclient.Pusher('b3453c59cc3f52599663')
pusher.connection.bind('pusher:connection_established', connect_handler)
pusher.connect()

while True:
    time.sleep(1)
