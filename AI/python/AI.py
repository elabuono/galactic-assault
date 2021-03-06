from pynput.keyboard import Controller
from selenium import webdriver
import time
import numpy as np
import random
from os import getenv
import pymssql

keyboard = Controller()

class State:
    def __init__(self,p2Pos, p1Pos ):
        self.p2Pos = p2Pos
        self.p1Pos = p1Pos

    def __eq__(self, other):
        return self.p2Pos == other.p2Pos and self.p1Pos == other.p1Pos

    def __hash__(self):
        return hash(str(self.p2Pos)+str(self.p1Pos))

    def __str__(self):
        return ""#f"State( p2os={self.p2Pos} p1pos={self.p1Pos})"


numberOfStates = 529  # number of positions, lives, and
qtable = np.zeros((numberOfStates, 3)) # , dtype=(State, int)) #size of action_space times size of number of states
stateNums = {}
count = 0

for w in range(23):
    for x in range(23):
            s = State(x,w)
            stateNums.update({s: count})
            count = count + 1

def getStateNum(s):
    return stateNums.get(s)


def press(x):
    keyboard.press(x)
    keyboard.press(action_space_user(random.randint(0, 2)))
    time.sleep(.1)
    keyboard.release(action_space_user(random.randint(0, 2)))
    keyboard.release(x)
    if x == 'j':
        return 0
    if x == 'l':
        return 1
    return 2

def action_space_user(i):
    if i == 0:
        return 'a'
    if i == 1:
        return 'd'
    if i == 2:
        return ' '

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
print(getStateNum(State(2, 3)))

alpha = 0.2 #Learning rate
gamma = 0.9
epsilon = 0.1


oldp2Kill = 0
totalEpochs = 10


def getState(s):
    return State(int(s.p2Pos), int(s.p1Pos))


def rgb2gray(rgb):
    return np.dot(rgb[...,:3], [0.2989, 0.5870, 0.1140])


def calcReward(old, n, action, p2KillNew, p2KillOld, p2LivesNew, p2LivesOld):
    reward = 0
    if int(p2KillNew) > int(p2KillOld):
        reward += (int(p2KillNew) - int(p2KillOld))/2
    if int(p2LivesNew) < int(p2LivesOld):
        reward -= (int(p2LivesOld)-int(n.p2Livesnew))
    #if(action==2): reward+=.001
    #if old.p2Pos == n.p2Pos and (action==0 or action==1): reward-=.05
    print("REWARD WAS"+str(reward))
    return reward


for x in range(1000): #totalEpochs):
    print("THIS IS EPOCH",x)
    driver = webdriver.Chrome()
    driver.get("file:///Users/nickmasciandaro/CSCI/TestJS/galactic-assault/game.html")
    #driver.switch_to.alert.accept()
    isDone = driver.find_element_by_id('isDone').get_attribute("value")
    countFrame = 0
    isDone = "false"
    reward = 0
    p2LivesOld = driver.find_element_by_id("p2Lives").get_attribute('value')
    p2KillOld = driver.find_element_by_id('p2Kill').get_attribute('value')
    p2Pos = driver.find_element_by_id('p2Pos').get_attribute('value')
    p1Pos = driver.find_element_by_id('p1Pos').get_attribute('value')
    p2KillNew = p2KillOld
    p2LivesNew = p2LivesOld;
    oldState = getState(State(p2Pos, p1Pos))
    newState = getState(State(p2Pos, p1Pos))
    while isDone == "false" and countFrame <= 50:
        countFrame += 1
        rand = random.random()

        p2LivesOld = p2LivesNew
        p2KillOld = p2KillNew
        oldState = getState(newState)

        #Take action
        if rand < epsilon:
            action = press(action_space(random.randint(0, 2)))
        else:
            print("reward availabilities = "+str(qtable[getStateNum(oldState)]))
            c = action_space(np.argmax(qtable[getStateNum(oldState)]))
            if qtable[getStateNum(oldState), np.argmax(qtable[getStateNum(oldState)])].any() == 0:
                action = press(action_space(random.randint(0, 2)))
                print("dumb move")
            else:
                action = press(c)
                print("SMART "+c+"REWARD "+str(np.max(qtable[getStateNum(oldState)]))+"PRESSED"+c+"\n")

        p2LivesNew = driver.find_element_by_id("p2Lives").get_attribute('value')
        p2KillNew = driver.find_element_by_id('p2Kill').get_attribute('value')
        p2Pos = driver.find_element_by_id('p2Pos').get_attribute('value')
        p1Pos = driver.find_element_by_id('p1Pos').get_attribute('value')
        isDone = driver.find_element_by_id('isDone').get_attribute("value")

        print("Lives: "+str(p2LivesNew))

        newState = State(p2Pos, p1Pos)
        newState = getState(newState)
        print("p2KillNew: "+p2KillNew)
        print("p2KillNold: " + p2KillOld)
        reward = calcReward(oldState, newState, action, p2KillNew, p2KillOld, p2KillNew, p2KillOld)

        #set q table to old state and reward ex:
        qtable[getStateNum(oldState), action] = qtable[getStateNum(oldState), action] + alpha * (reward+gamma*np.max(qtable[getStateNum(newState),:])- qtable[getStateNum(oldState), action])

        print(qtable[getStateNum(oldState)])
    driver.close()

conn = pymssql.connect(user = 'sa', password = 'galexy2019!')

cursor = conn.cursor()

for x in range(numberOfStates):
    rew = -1
    if(qtable[x, np.argmax(qtable[x])] == 0):
        rew = str(rew)
    else:
        rew = str(np.argmax(qtable[x]))
    cursor.execute('INSERT INTO q_table.dbo.[Move] (id, move) VALUES ('+str(x)+', '+str(rew)+');')
    #cursor.execute('REPLACE INTO q_table.dbo.[Move] (id, move) VALUES(' +str(x) +','+str(np.argmax(qtable[x]))+');')

conn.commit()
conn.close()
