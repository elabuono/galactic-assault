from pynput.keyboard import Controller
from selenium import webdriver
import time
from PIL import Image
import numpy as np
import random
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
from PIL import Image

keyboard = Controller()

qtable = np.zeros((3, 86*8*3))


class State:
    def __init__(self, x1, x2):
        self.p1x = x1
        self.p2x = x2

    def get_all_states(self):
        return self.p1x * self.p2x

    def set_state(self, state):
        self.p1x = state.p1x
        self.p2x = state.p2x


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



#model = tf.keras.Sequential()


#f = open("movement.txt", "w+")
#f.truncate(0)
movementList = []
bestMovementList = []
maxScore = 0
epsilon = 1 #probability of mutation
oldp2Kill = 0

def rgb2gray(rgb):
    return np.dot(rgb[...,:3], [0.2989, 0.5870, 0.1140])

countFrame = 0
for x in range(1):
    driver = webdriver.Chrome()
    driver.get("file:///Users/nickmasciandaro/CSCI/TestJS/galactic-assault/index.html")

    isDone = driver.find_element_by_id('isDone').get_attribute("value")
    print(isDone)
    while isDone == "false":
        #Screenshot
        driver.get_screenshot_as_file("../images/orig/screenshot"+str(countFrame)+".png")
        orig = Image.open("../images/orig/screenshot"+str(countFrame)+".png").convert('LA')
        width, height = orig.size
        cropped = orig.crop((200, 220, width - 1200, height - 70))
        cropped.save("../images/grey/shot"+str(countFrame)+".png")

        #img = mpimg.imread('../images/grey/shot'+str(countFrame)+'.png')
        #gray = rgb2gray(img)
        #plt.imshow(gray, cmap=plt.get_cmap('gray'), vmin=0, vmax=1)
        #plt.show()
        #img.save("../images/grey2/shot"+str(countFrame)+".png")

        #/Screenshot
        countFrame += 1
        rand = random.random()
        #Take action
        if rand < epsilon:
            press(action_space(random.randint(0, 2)))
        else:
            press(action_space(random.randint(0, 2)))#press(np.argmax(qtable[]))
            #SmartMove exploit what is known //action = np.argmax(q_table[state])

        #get current state elements of game board (nextState, reward, done)
        p2Lives = driver.find_element_by_id("p2Lives").get_attribute('value')
        p2Kill = driver.find_element_by_id('p2Kill').get_attribute('value')
        p2Pos = driver.find_element_by_id('p2Pos').get_attribute('value')
        p1Pos = driver.find_element_by_id('p1Pos').get_attribute('value')
        isDone = driver.find_element_by_id('isDone').get_attribute("value")

        #oldvalue = q_table[state, action] //get the old value of the table
        #next_max = np.max(q_table[next_state])
        #new_value = (1 - alpha) * old_value + alpha * (reward + gamma * next_max)
        #q_table[state, action] = new_value
        #if a very low reward, make a penalty
        #move to next state

    driver.close()


#for l in bestMovementList:
#    f.write(l)
#f.close()

