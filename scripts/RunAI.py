from pynput.keyboard import Controller
from selenium import webdriver
import time
from random import randint

keyboard = Controller()


def press(x):
    keyboard.press(x)
    time.sleep(.25)
    keyboard.release(x)


def action_space(i):
    if i == 0:
        return 'j'
    if i == 1:
        return 'l'
    if i == 2:
        return 'k'


f = open("./movement.txt", "r")


driver = webdriver.Chrome()
driver.get('file:///Users/nickmasciandaro/CSCI/TestJS/galactic-assault/index.html')

movements = []
contents = f.read()
for l in contents:
    press(l)

driver.close()
