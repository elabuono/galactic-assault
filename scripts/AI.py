from pynput.keyboard import Controller
from selenium import webdriver
import time
from random import randint
import os

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


f = open("movement.txt", "w+")
f.truncate(0)
movementList = []
bestMovementList = []
maxScore = 0
for x in range(10):
    driver = webdriver.Chrome()
    driver.get('file:///Users/nickmasciandaro/CSCI/TestJS/galactic-assault/index.html')
    element = driver.find_element_by_id('p2Kill')
    for y in range(40):
        num = randint(0, 2)
        letter = action_space(num)
        movementList.append(letter)
        press(letter)
    current = int(element.get_attribute('value'))
    if current > maxScore:
        bestMovementList = []
        bestMovementList = movementList.copy()
    driver.close()
    movementList = []


for l in bestMovementList:
    f.write(l)
f.close()
