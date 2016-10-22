import time
import pusherclient

global pusher

def callback(bot_response):
    print bot_response
    time.sleep(10)

def connect_handler(data):
    channel = pusher.subscribe('questions')
    channel.bind('bot-response', callback)

pusher = pusherclient.Pusher('b3453c59cc3f52599663')
pusher.connection.bind('pusher:connection_established', connect_handler)
pusher.connect()

while True:
    time.sleep(1)
