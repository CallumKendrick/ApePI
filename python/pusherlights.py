import time
import pusherclient
import json
import requests

import pincontrol

global pusher


def clear_questions():
    requests.post('http://harambae.co.uk:3000/clear-questions')

def displayed_question():
    requests.post('http://harambae.co.uk:3000/displayed-question')

def consume_char(char):
    cid = ord(char)
    do_sleep = False

    if cid < 65:
        if cid == 32:
            pincontrol.off_all()
            do_sleep = True
    elif cid < 91:
        pincontrol.set_led(cid-65)
        do_sleep = True
    elif cid < 97:
        pass
    elif cid < 123:
        pincontrol.set_led(cid-97)
        do_sleep = True

    if do_sleep:
        time.sleep(1)

def callback(bot_response):
    response = json.loads(bot_response)
    for char in response['text']:
        consume_char(char)
    pincontrol.off_all()
    displayed_question()
    time.sleep(5)

def connect_handler(data):
    channel = pusher.subscribe('questions')
    channel.bind('bot-response', callback)

pusher = pusherclient.Pusher('b3453c59cc3f52599663')
pusher.connection.bind('pusher:connection_established', connect_handler)
pusher.connect()

clear_questions()

pincontrol.off_all()
while True:
    time.sleep(1)
