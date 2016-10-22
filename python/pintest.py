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

#LED pin mapping
led1 = 1

#Bank mapping
bankB = 0
bankA = 1

def set_led(data,bank):
    if bank == 1:
        bus.write_byte_data(address,0x12,data)
    else:
        bus.write_byte_data(address,0x13,data)

def main():
   set_led(led1,bankA)

if __name__ == "__main__": main()
