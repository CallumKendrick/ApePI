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
bus.write_byte_data(address,0x00,0x00) # Set all of bank A to outputs 
bus.write_byte_data(address,0x01,0x00) # Set all of bank B to outputs 

#LED pin mapping
led1 = 1

#Bank mapping
bank0 = 0
bank1 = 1

#This section defines how we put the 'bank' and output numbers together to allow us to turn on specific outputs for specific banks 
  #print "set_led bank=" + str(bank) + " data=" + str(data)
def set_led(data,bank):  
  if bank == 1: #If bank number = 1, write to bank 1. if not, write to bank 2.
   bus.write_byte_data(address,0x12,data)
  else:
   bus.write_byte_data(address,0x13,data)
  return
  
def main():
   
   set_led(led1,bank0) #sends power to B0 - aka bank 0 pin 1
          
if __name__ == "__main__":
   main()
