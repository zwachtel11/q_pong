#!/usr/bin/python

from gpiozero import MotionSensor
import requests
import time, os, glob, sys
import RPi.GPIO as GPIO

emptyCount0 = 0
pin = 7
on = True

#Note: You need to set up your motion sensor with the correct GPIO pins
GPIO.setmode(GPIO.BCM)
GPIO.setup(pin, GPIO.OUT)
GPIO.setup(4, GPIO.IN)
GPIO.setup(17, GPIO.IN)


SAMPLE_PERIOD = 1
SAMPLES_PER_CYCLE = 20

ROOM0_NAME ="" # Note: Change this to be your room's name 
SERVER_ADDR = "" # Note: Change this to be the endpoint of your server to post the data,
                 #       should be something like ../api/roomdata


start = True

def send_data(average, name):
	body = {
		"value":average,
		"room_name":name
	}
	r = requests.post(SERVER_ADDR, data = body, verify=True)
                
while start:
        vals0 = []
        for i in range(SAMPLES_PER_CYCLE):
                input0 = GPIO.input(4)
                vals0.append(input0)
                time.sleep(float(SAMPLE_PERIOD))
                
        average_val0 = float(sum(vals0))/len(vals0)
        if (average_val0 > 0.29):
                send_data(1, ROOM0_NAME)
                emptyCount0 = 0
        else:
                emptyCount0 += 1
                if emptyCount0 >= 3:
                        send_data(0, ROOM0_NAME)
                else:
                        send_data(1, ROOM0_NAME)


		
		
