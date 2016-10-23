import smbus
import sys
import getopt
import time
import RPi.GPIO as GPIO

# general gpio setup
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

# set gpios as outputs
gpio_outputs = [5, 6, 12, 13, 16, 19, 20, 21, 25, 26]
gpio_order = [21, 20, 16, 12, 25, 26, 19, 13, 6, 5]
for output in gpio_outputs:
    GPIO.setup(output, GPIO.OUT)

# general smbus setup
bus = smbus.SMBus(1)
# Set the I2C address
i2c_address = 0x20
# Set both banks to outputs
bus.write_byte_data(i2c_address, 0x00, 0x00)
bus.write_byte_data(i2c_address, 0x01, 0x00)

def off_all_i2c():
    bus.write_byte_data(i2c_address, 0x12, 0)
    bus.write_byte_data(i2c_address, 0x12, 0)

def off_all_gpio():
    for output in gpio_outputs:
        GPIO.output(output, GPIO.LOW)

def off_all():
    off_all_i2c()
    off_all_gpio()

def set_i2c_led(led):
    # mind that bank B is 0!
    bank = led // 8
    # get address for led, led IDs marked on board
    data = 2 ** (led % 8)
    if bank == 1:
        bus.write_byte_data(i2c_address, 0x12, data)
    else:
        bus.write_byte_data(i2c_address, 0x13, data)

def set_gpio_led(led):
    GPIO.output(gpio_order[led], GPIO.HIGH)

def set_led(led):
    off_all()
    if led < 16:
        set_i2c_led(led)
    elif led < 26:
        set_gpio_led(led-16)


current_led = 0
led_count = 26
while True:
    set_led(current_led % led_count)
    print chr(65+current_led)
    current_led += 1
    time.sleep(1)
