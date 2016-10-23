import smbus
import sys
import getopt
import time
import RPi.GPIO as GPIO

#Set up SMBus
bus = smbus.SMBus(1)

#Set the I2C address
address = 0x20

# Set both banks to outputs
bus.write_byte_data(address,0x00,0x00)
bus.write_byte_data(address,0x01,0x00)

#Bank mapping
bankB = 0
bankA = 1

def set_led(led, bank):
    data = 2 ** led
    if bank == 1:
        bus.write_byte_data(address,0x12,data)
    else:
        bus.write_byte_data(address,0x13,data)

def off_all():
    off_all_i2c()
    off_all_gpio()

def main():
   set_led(3, bankA)

if __name__ == "__main__": main()
