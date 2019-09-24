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


class State:
    def __init__(self, p2Lives , p2Kill, p2Pos, p1Pos):
        self.p2Lives = p2Lives
        self.p2Kill = p2Kill
        self.p2Pos = p2Pos
        self.p1Pos = p1Pos

    def __eq__(self, other):
        return p2Lives == other.p2Lives and p2Kill == other.p2Kill and p2Pos == other.p2Pos and p1Pos == other.p2Pos

    def __hash__(self):
        return hash(str(p2Lives)+str(p2Kill)+str(p2Pos)+str(p2Kill))

    def __str__(self):
        return f"State(p2Lives={self.p2Lives} p2Kill={self.p2Kill}p1Pos={self.p1Pos}p2pos={self.p2Pos}"


numberOfStates = 86*86*3*3  # number of positions, lives, and
qtable = np.zeros((numberOfStates, 3)) # , dtype=(State, int)) #size of action_space times size of number of states




def press(x):
    keyboard.press(x)
    time.sleep(.25)
    keyboard.release(x)
    return x

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
alpha = 0.1
gamma = 0.9
epsilon = 0.1
lr = .25

oldp2Kill = 0
totalEpochs = 10;


def rgb2gray(rgb):
    return np.dot(rgb[...,:3], [0.2989, 0.5870, 0.1140])

def calcReward(old, n):
    reward = 0;
    if n.p2Kill > old.p2Kill:
        reward += (n.p2Kill - old.p2Kill)*10
    if n.p2Lives < old.p2Lives:
        reward -= 20*(old.p2Lives-n.p2Lives)
    return reward

countFrame = 0
for x in range(totalEpochs):
    driver = webdriver.Chrome()
    driver.get("file:///Users/nickmasciandaro/CSCI/TestJS/galactic-assault/index.html")

    isDone = driver.find_element_by_id('isDone').get_attribute("value")
    while isDone == "false":
        countFrame += 1
        rand = random.random()

        p2Lives = driver.find_element_by_id("p2Lives").get_attribute('value')
        p2Kill = driver.find_element_by_id('p2Kill').get_attribute('value')
        p2Pos = driver.find_element_by_id('p2Pos').get_attribute('value')
        p1Pos = driver.find_element_by_id('p1Pos').get_attribute('value')
        oldState = State(p2Lives, p2Kill, p2Pos, p1Pos)

        #Take action
        if rand < epsilon:
            action = press(action_space(random.randint(0, 2)))
        else:
            action = press(action_space(np.argmax(qtable[oldState])))
            #SmartMove exploit what is known //action = np.argmax(q_table[state])

        #get current state elements of game board (nextState, reward, done)
        p2Lives = driver.find_element_by_id("p2Lives").get_attribute('value')
        p2Kill = driver.find_element_by_id('p2Kill').get_attribute('value')
        p2Pos = driver.find_element_by_id('p2Pos').get_attribute('value')
        p1Pos = driver.find_element_by_id('p1Pos').get_attribute('value')
        isDone = driver.find_element_by_id('isDone').get_attribute("value")

        newState = State(p2Lives, p2Kill, p2Pos, p1Pos)

        reward = calcReward(oldState, newState)

        #set q table to old state and reward ex:
        qtable[oldState, action] = qtable[oldState, action]+ lr * (reward+gamma*np.max(qtable[newState,:])-qtable[oldState, action])


        #oldvalue = q_table[state, action] //get the old value of the table
        #next_max = np.max(q_table[next_state])
        #new_value = (1 - alpha) * old_value + alpha * (reward + gamma * next_max)
        #q_table[state, action] = new_value
        #if a very low reward, make a penalty
        #move to next state

    driver.close()
