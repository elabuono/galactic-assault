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


for x  in range(10):
    driver = webdriver.Chrome()
    driver.get('file:///Users/nickmasciandaro/CSCI/TestJS/galactic-assault/index.html')
    element = driver.find_element_by_xpath("/html/body")
    for y in range(40):
        press(action_space(randint(0, 2)))
    driver.close()
