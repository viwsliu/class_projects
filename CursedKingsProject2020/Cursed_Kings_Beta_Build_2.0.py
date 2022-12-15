###system###
import sys
import random
###system###

###VARIABLES###
army = 30
relig = 30
pops = 30
cash = 30
###VARIABLES###
ded = ["You are dead"]
###ALIVE/DEAD###
GamePlaying = True
dead = False
called = False
###ALIVE/DEAD###

###Classes###
class tools:
    general = False
    hospital = False
    church = False
    vault = False
    vssltroops = False
###CLASSES###


###GAME QUESTIONS################################################################################################################
print("You can only answer yes or no in this game...")
print("Are you the King?")
start = input(" ")
if start.lower() == "yes":
    print("good, let's begin")
elif start.lower() == "all":
    general = True
    hospital = True
    church = True
    vault = True
    vssltroops = False
    print("acknowledged")
elif start.lower() == "no":
    print("Of course you are, fool")
    sys.exit()
elif start.lower() not in ["yes", "no"]:
    print("...ok")
    sys.exit()

def card1():
    global army
    if tools.general == True:
        pass
    else:
        print("Would you like to hire the new General, sire? This will boost the morale of our army! (y=+10 / n=-10 to Army)")
        question = input("Sire?:")
        if question.lower() == "no":
            print("Yes, your majesty")
            army -= 10
            print("Army:", army)
            print("Cash:", cash)
            print("Religion:", relig)
            print("Population:", pops)
        elif question.lower() == "yes":
            print("Of course, we shall call for him at once")
            army += 10
            print("Army:", army)
            print("Cash:", cash)
            print("Religion:", relig)
            print("Population:", pops)
            tools.general = True
        elif question.lower() not in ["yes", "no"]:
            print("You made no choice, therefore a choice was made in your name")
            tools.general = True
            army += 10
            print("Army:", army)
            print("Cash:", cash)
            print("Religion:", relig)
            print("Population:", pops)
        
def card2():
    global relig
    if tools.church == True:
        pass
    else:
        print("You should build a new church! ( y=+10 religion/ n=-20 religion +New Church)")
        question = input("Sire?:")
        if question.lower() == "no":
            print("May the lord forgive you for your sins")
            relig -= 20
            print("Army:", army)
            print("Cash:", cash)
            print("Religion:", relig)
            print("Population:", pops)
        elif question.lower() == "yes":
            print("Construction will begin immediately on your command!")
            relig += 10
            print("Army:", army)
            print("Cash:", cash)
            print("Religion:", relig)
            print("Population:", pops)
            print("Church is now built")
            tools.church = True
        elif question.lower() not in ["yes", "no"]:
            print("You made no choice, so a choice was made in your name...")
            relig -= 20
            print("Army:", army)
            print("Cash:", cash)
            print("Religion:", relig)
            print("Population:", pops)

def card3():
    global pops
    card3 = print("My lord a plague has broken out, shall we aid the people? ( y=-10 pops/ n=-20 pops)")
    question = input("Sire?:")
    if tools.hospital == True:
        print("Your hospital handles the needs of the people, you have no say in the matter")
        tools.hospital == False
    else:
        if question.lower() == "no":
            print("Many of your subjects die of this unknown disease")
            pops -= 20
            print("Army:", army)
            print("Cash:", cash)
            print("Religion:", relig)
            print("Population:", pops)
        elif question.lower() == "yes":
            print("Most of your subjects were able to be saved")
            pops -= 10
            print("Army:", army)
            print("Cash:", cash)
            print("Religion:", relig)
            print("Population:", pops)
            tools.hospital = False
        elif question.lower() not in ["yes", "no"]:
            print("You made no choice, so a choice was made in your name...")
            pops -= 20
            print("Army:", army)
            print("Cash:", cash)
            print("Religion:", relig)
            print("Population:", pops)


def card4():
    global cash, pops
    card4 = print("The price of bread be too high! Please lower it ( y = +10 pops, -10 cash / n = -10 pops, +10 cash)")
    question = input("Your choice sire?:")
    if question.lower() == "no":
        print("Many subjects die from starvation.")
        pops -= 10
        cash += 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() == "yes":
        print("You lose some money, but your subjects survive the winter")
        pops += 10
        cash -= 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() not in ["yes", "no"]:
        print("You made no choice, so a choice was made in your name...")
        pops -= 10
        cash += 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)

def card5():
    global army, cash
    card5 = print("Our troops have continued their attack on the southern baronies. Reports indicate that the enemy cant hold much longer. Shall we continue the attack? ( y = -10 army, +20 Cash / n = +0 army, +10 cash)")
    question = input("What shall we do sire?:")
    if question.lower() == "no":
        print("Our troops have 'strategically' retreated successfully. We also saved some money by ending the war")
        cash += 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() == "yes":
        print("We have lost some soldiers, but found a good amound treasure in their castle")
        army -= 10
        cash += 20
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() not in ["yes", "no"]:
        print("You made no choice, so a choice was made in your name...")
        cash += 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    
def card6():
    global relig, cash
    card6 = print("Sire, some bandits have burned down the old cathedral. Shall we rebuild the Cathedral? ( y = +20 relig, -10 cash / n = -10 relig)")
    question = input("Your choice?:")
    if question.lower() == "no":
        print("The pope frowns upon your decision")
        relig -=10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() == "yes":
        print("The building of the new cathedral has been ordered, but won't be finished for at least a 10 years. The pope sees your devotion")
        relig += 20
        cash -=10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() not in ["yes", "no"]:
        print("You made no choice, so a choice was made in your name...")        
        relig -=10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)

def card7():
    global pops, cash
    card7 = print ("A rich merchant of the kingdom has passed, and has given you all of his lands in his will. Shall we turn the lands into new housing areas? ( y= -10cash, +20 pops/ n= -10 pops)")
    question = input("Sire?:")
    if question.lower() == "yes":
        print ("The houses are more than enough for your subjects, traders from all over even come to live in your kingdom")
        pops += 20
        cash -= 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() == "no":
        print("Many of your subjects die in the cold of winter")
        pops -= 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() not in ["yes", "no"]:
        print("You made no choice, so a choice was made in your name...")        
        pops += 20
        cash -= 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)

def card8():
    global army, cash, relig
    card8 = print("Sire, we should go on a crusade! It'll cost some money and manpower, but it'll be worth it. (y= -10 cash, -10 army, +30 religion/ n = -10 religion, +10 cash)")
    question = input("Sire?:")
    if question.lower() == "yes":
        print("The General awaits your orders")
        cash -= 10
        army -=10
        relig += 30
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() == "no":
        print("Understandable my lord, maybe right now isn't the time")
        relig -=10
        cash += 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() not in ["yes", "no"]:
        print("You made no choice, so a choice was made in your name...") 
        cash -= 10
        army -=10
        relig += 30
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)


def card9():
    global pops, cash
    card9 = print("Sire, we have acquired some land close to the kingdom, would you like to use the land towards housing? (y= -10 cash, +20 pops/ n= -10 pops)")
    question = input("Sire?:") 
    if question.lower() == "yes":
        print("Very well my king")
        cash -= 10
        pops += 20
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() == "no":
        print("We will save the land and the money for a better use")
        pops -= 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() not in ["yes", "no"]:
        print("You made no choice, so a choice was made in your name...") 
        cash -= 10
        pops += 20
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)


def card10():
    global army, cash
    if tools.vssltroops == True:
        pass
    else:
        card10 = print("Would you like to recruit mercenaries from the vassal states? (y= +20 army, -10 cash/ n= +10 cash)")
        question = input("Sire?:")
        if question.lower() == "yes":
            print("A fine choice")
            cash -= 10
            army += 20
            print("Army:", army)
            print("Cash:", cash)
            print("Religion:", relig)
            print("Population:", pops)
            tools.vssltroops = True
        elif question.lower() == "no":
            print("Of course, there is no need right now")
            cash += 10
            print("Army:", army)
            print("Cash:", cash)
            print("Religion:", relig)
            print("Population:", pops)
        elif question.lower() not in ["yes", "no"]:
            print("You made no choice, so a choice was made in your name...") 
            cash += 10
            print("Army:", army)
            print("Cash:", cash)
            print("Religion:", relig)
            print("Population:", pops)


def card11():
    global cash, relig, pops
    card11 = print("Your people are losing intrest in our religion. We should re-educate the people. (y= +20 religion, +10 pops, -10 cash/ n= -20 religion)")
    question = input("Sire?:")
    if question.lower() == "yes":
        print("Great! We shall not wait any longer")
        cash -= 10
        relig += 20
        pops += 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() == "no":
        print("Hmm...")
        relig -= 20
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() not in ["yes", "no"]:
        print("You made no choice, so a choice was made in your name...") 
        cash -= 10
        relig += 20
        pops += 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)


def card12():
    global pops, cash
    if tools.hospital == True:
        pass
    else:
        card12 = print("Sir, we should build a hospital, to reduce the chance of diseases (y = +20 Pops, -10 Cash, New Hospital/ n = +10 Cash, -10 Pops)")
        question = input("Sire?:")
        if question.lower() == "yes":
            print("We shall begin construction immediately!")
            cash -= 10
            pops += 20
            tools.hospital = True
            print("Army:", army)
            print("Cash:", cash)
            print("Religion:", relig)
            print("Population:", pops)
        elif question.lower() == "no":
            print ("Yes my lord")
            cash += 10
            pops -= 10
            print("Army:", army)
            print("Cash:", cash)
            print("Religion:", relig)
            print("Population:", pops)
        elif question.lower() not in ["yes", "no"]:
            print("You made no choice, so a choice was made in your name...") 
            print ("Yes my lord")
            cash += 10
            pops -= 10
            print("Army:", army)
            print("Cash:", cash)
            print("Religion:", relig)
            print("Population:", pops)


def card13():
    global cash
    if tools.vault == True:
        pass
    else:
        card13 = print("Sire, should we build a treasury? This will keep our economy afloat in trying times. (y = -10 cash, +Treasury/ n= no effect)")
        question = input("Sire?:")
        if question.lower() == "yes":
            print("We shall begin construction immediately!")
            cash -= 10
            tools.vault = True
            print("Army:", army)
            print("Cash:", cash)
            print("Religion:", relig)
            print("Population:", pops)
        elif question.lower() == "no":
            print("Yes my lord")
            print("Army:", army)
            print("Cash:", cash)
            print("Religion:", relig)
            print("Population:", pops)
        elif question.lower() not in ["yes", "no"]:
            print("You made no choice, so a choice was made in your name...") 
            tools.vault = True
            print("Army:", army)
            print("Cash:", cash)
            print("Religion:", relig)
            print("Population:", pops)


def card14():
    global army, pops
    if tools.vssltroops == True:
        card14 = print("Marauders from the north are attacking again and our troops are stretched thin! Please send the mercenaries you hired! (y= +10 army, lose Mercenaries/ n= -20 army, -10 pops)")
        question = input("Your orders, Sire?:")
        if question.lower() == "yes":
            print("The Marauders were ultimately squashed by the Mercenaries alone. All mercenaries left to go home after the battle.")
            tools.vssltroops = False
            army +=10
            print("Army:", army)
            print("Cash:", cash)
            print("Religion:", relig)
            print("Population:", pops)
        elif question.lower() == "no":
            army -= 20
            pops -= 10
            print("The Marauders looted the border villages and left shortly after.")
            print("Army:", army)
            print("Cash:", cash)
            print("Religion:", relig)
            print("Population:", pops)
        elif question.lower() not in ["yes", "no"]:
            print("You made no choice, so a choice was made in your name...") 
            army -= 20
            pops -= 10
            print("The Marauders looted the border villages and left shortly after.")
            print("Army:", army)
            print("Cash:", cash)
            print("Religion:", relig)
            print("Population:", pops)
    else:
        pass
            

def card15():
    global relig
    card11 = print("My lord, the pope would like to pay homage to your late father, as he has served this kingdom well with his divine right (y=+10 religion /n=-10 religion)")
    question = input("Sire?:")
    if question.lower() == "yes":
        print("The ceremony shall be prepared")
        relig += 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() == "no":
        print("Hmm...")
        relig -= 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() not in ["yes", "no"]:
        print("You made no choice, so a choice was made in your name...") 
        print("The ceremony shall be prepared")
        relig += 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)

def card16():
    global relig, cash, pops
    card16 = print("Sire, shall we approve the request of the pope to build new religious schools? (y=+10 pops, +10 relig, -10 cash/n=-10 relig, +10 cash)")
    question = input("Sire?:")
    if question.lower == "yes":
        print("Consider it done my lord")
        pops += 10
        cash -= 10
        relig += 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() == "no":
        print("Yes my lord")
        relig -= 10
        cash += 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() not in ["yes", "no"]:
        print("You made no choice, so a choice was made in your name...") 
        relig -= 10
        cash += 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    
def card17():
    global pops, relig
    card16 = print("The Pope requests that we make our religious laws more strict. What do you say to this my lord? (y= -10 pops, +10 relig/n= +10 pops, -10 relig)")
    question = input("Sire?:")
    if question.lower == "yes":
        print("It will be done")
        pops -= 10
        relig += 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() == "no":
        print("As you wish")
        relig -= 10
        pops += 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() not in ["yes", "no"]:
        print("You made no choice, so a choice was made in your name...") 
        pops -= 10
        relig += 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)

def card18():
    global army, pops
    card16 = print("Many of our soldiers are retiring, we need to enlist new recruits. (y= +20 army, -20 pops/n= -10 army, +10 pops)")
    question = input("Sire?:")
    if question.lower == "yes":
        print("Will do sir")
        pops -= 20
        army += 20
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() == "no":
        print("As you wish")
        army -= 10  
        pops += 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() not in ["yes", "no"]:
        print("You made no choice, so a choice was made in your name...") 
        army -= 10  
        pops += 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)

def card19():
    global relig
    card16 = print("Would you like to hire more priests my lord? (y= +20 relig/n= -20 relig")
    question = input("Sire?:")
    if question.lower == "yes":
        print("Yes my lord")
        relig += 20
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() == "no":
        print("As you wish")
        relig -= 20
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() not in ["yes", "no"]:
        print("You made no choice, so a choice was made in your name...") 
        relig += 20
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)

def card20():
    global army, cash 
    card16 = print("Many good men were lost in our recent battle against the South! Should we recruit more troops? (y= +10 army/n= +10 cash")
    question = input("Sire?:")
    if question.lower == "yes":
        print("As you wish")
        army += 10  
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() == "no":
        print("Hmm...")
        cash += 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() not in ["yes", "no"]:
        print("You made no choice, so a choice was made in your name...") 
        cash += 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)

def card21():
    global relig, pops, cash
    card21 = print("A priest would like to set up a grand festival in your honor over the recent victories against the West. (y=+10relig, pops, -10 cash/n=+10 cash, -10relig)")
    question = input("Sire?:")
    if question.lower == "yes":
        print("Let the festivities begin my lord!")
        pops += 10
        relig += 10
        cash -= 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower == "no":
        print("As you wish")
        cash += 10
        relig -= 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
    elif question.lower() == ["yes", "no"]:
        print("You made no choice, so a choice was made in your name...") 
        cash += 10
        relig -= 10
        print("Army:", army)
        print("Cash:", cash)
        print("Religion:", relig)
        print("Population:", pops)
        

###VARIABLE RELIANT QUESTIONS###

def rand_card():
    card = random.randint(1, 21)
    if card == 1:
        card1()
    if card == 2:
        card2()
    if card == 3:
        card3()
    if card == 4:
        card4()
    if card == 5:
        card5()
    if card == 6:
        card6()
    if card == 7:
        card7()
    if card == 8:
        card8()
    if card == 9:
        card9()
    if card == 10:
        card10()
    if card == 11:
        card11()
    if card == 12:
        card12()
    if card == 13:
        card13()
    if card == 14:
        card14()
    if card == 15:
        card15()
    if card == 16:
        card16()
    if card == 17:
        card17()
    if card == 18:
        card18()
    if card == 19:
        card19()
    if card == 20:
        card20()
    if card == 21:
        card21()


def death_parameters():
    global dead, relig, army, cash, pops
    if army > 80:
        dead = True
        print("The Army staged a coup d'etat") 
    elif relig > 80:
        dead = True
        print("The priest took over your empire and placed himself as king")
    elif cash > 80:
        dead = True
        print("Your governors become too corrupt to run anything for you. The Oligarchy exiles you far away")
        for x in ded:
            print(x)
    elif pops > 80:
        dead = True
        print("A mob overtook the guards and stormed your castle. You were executed soon after")
    if army < 1:
        if tools.general == True:
            print("The general would like to speak to the army, will you allow this?")
            question = input("Sire?:")
            if question.lower() == "yes":
                army += 20
                print("The General convinced most of the army to return to their posts rather than desert")
            elif question.lower() == "no":
                dead = True
                print("The general was executed for his terrible leadership and so were you")
        else:
            dead = True
            print("You die fighting an invading army in your castle")
    
    if relig < 1:
        if tools.church == True:
            relig += 10
            print("The church you built years ago came to save you from the jaws of the infidels")
        else:
            dead = True
            print("A new popular religion has overthrown the church and you were executed soon after")
    
    if cash < 1:
        if tools.vault == True:
            print("Would you like to open up the vault?")
            question = input("Sire?:")
            if question.lower() == "yes":
                cash += 20
                print("Cash is now:", cash)
            elif question.lower() == "no":
                dead = True
                print("You died penniless on the streets of the kingdom you once ruled")
        else:
            dead = True
            print("You died penniless on the streets of the kingdom you once ruled")
            
    if pops < 1:
        dead = True
        print("The last of your subjects leave your kingdom for a better life far away")

while not dead:
    death_parameters()
    if dead:
        sys.exit()
    rand_card()

