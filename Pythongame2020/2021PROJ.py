
import pygame
from sprite import *
from GoodObject import GoodObject
from BadObject import BadObject
import sys

###initial window------------------------------------
pygame.init()
size = (1200, 700)
screen = pygame.display.set_mode(size)
pygame.display.set_caption("Slide Man")
icon = pygame.image.load("supermarbro.png")
pygame.display.set_icon(icon)
###Colors-------------------------------------------------
BLACK = ( 0, 0, 0)
WHITE = ( 255, 255, 255)
GREEN = ( 0, 255, 0)
RED = ( 255, 0, 0)
BLUE = ( 100, 200, 255)
SHADOW = ( 200, 200, 200)
###Start Menu Text Locations (x,y)-------------------------------------
endx = 360
endy = 50
end2x = 650
end2y = 200
end3x = 750
end3y = 300
font = pygame.font.Font(None, 54)
font_color = pygame.Color('BLACK')
###Def for timers---------------------------------------

def MTS(milliseconds):
    return milliseconds/1000

def STM(seconds):
    return seconds/60

def l_count(hp):
    font = pygame.font.SysFont("Comic Sans MS",35)
    text = font.render("Lives:"+str(hp), True,(150,0,0))
    screen.blit(text,(150,0))

def s_count(scorecount):
    font = pygame.font.SysFont("Comic Sans MS",35)
    text = font.render("Score:"+str(scorecount), True,(150,0,0))
    screen.blit(text,(0,0))

def timeronscreen(STM):
    font = pygame.font.SysFont("Comic Sans MS" ,35)
    text = font.render("Time:"+str(STM), True,(150,0,0))
    screen.blit(text,(0,0))


###Falling objects-------------------------------------------------------
fallingobjects = []
fallingobjects.append(BadObject(size[0]))
fallingobjects.append(BadObject(size[0]))
fallingobjects.append(BadObject(size[0]))
fallingobjects.append(BadObject(size[0]))
fallingobjects.append(GoodObject(size[0]))
fallingobjects.append(GoodObject(size[0]))
fallingobjects.append(GoodObject(size[0]))

###Hero------------------------------------------------------------------------
hero = Sprite("supermarbro.png", 20, 580)
hero.change_size(30, 30)

###Ground-------------------------------------------------------------------------
ground = Sprite("0.gif", 0, 675)
ground.change_size(size[0]*100/ground.image.get_width(), 100)

##End screen sprite image-------------------------------------------------------
saitama = Sprite("opm4.png", 50, 100)

#Start Screen sprite image---------------------------------------
startsprite = Sprite("matsu.jpg", 10, 10)
startsprite.change_size(100, 100)
startsprite2 = Sprite("apples.jpg", 100, 150)
startsprite2.change_size(200, 200)

###Variables and True/False stuff----------------------------------------------
scorecount = 0 #player's score
hp = 3 #player's health points
currently_playing = False #when the player is playing the game, after starting
running = True #running is when the the actual window is open
game_over = False #when game is ended, player is dead
game_started = False #when game is started
clock = pygame.time.Clock() #defines what variable clock is for future reference

###Actual game running code-----------------------------------------------------
while running:
    for event in pygame.event.get(): #if space is pressed, the game will start
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                timer_started = True
                currently_playing = True
                game_started = True
                startsprite2.hide()
                
                screen.fill(BLUE) #background will stay blue as long as space has been previously pressed
            if timer_started:
                start_time = pygame.time.get_ticks()
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_ESCAPE:
                playing = False
                pygame.quit()
                quit()
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_r:
                hp = 3
                game_started = True
                scorecount = 0
                start_time = pygame.time.get_ticks()
                timer_started = True
###this start screen only comes up if hp is at 3 and game has not been started
    if game_started == False and hp == 3:
        
        keys = pygame.key.get_pressed()
        screen = pygame.display.set_mode(size)
        startsprite2.draw(screen)
        startsprite.draw(screen)
        font = pygame.font.SysFont('Comic Sans MS', 50)
        text = font.render('Press Space to Start', True, RED)
        screen.blit(text,(endx,endy))
        
    
    pygame.display.update()

###the start screen will only come up game_started is true
    if game_started == True:
        screen.fill(BLUE) #background is filled with blue first, then sprites are drawn on it
        for obj in fallingobjects: #falling apples
            obj.sprite.draw(screen)
            obj.update() #updates screen
            s_count(scorecount) #counts player's score
            l_count(hp) #counts player's hp
            
            if obj.sprite.is_touching(hero):
                obj.reset()
                scorecount += obj.point #adds predetermined value of points from BAD and GOOD object files
                hp += obj.lives #adds predetermined value of points from BAD and GOOD object files
        hero.draw(screen)#draws hero/player
        ground.draw(screen) #draws ground 
#Movement of player and "borders"------------------------------------------------------------------
        if pygame.key.get_pressed()[pygame.K_a] == True: 
            if hero.x > 0:
                hero.x -= 20
            hero.image = pygame.image.load("reversemarbro.png")
            hero.change_size(30, 30)
        if pygame.key.get_pressed()[pygame.K_d] == True:
            if hero.x < size[0] - 70:
                hero.x += 20
            hero.image = pygame.image.load("supermarbro.png")
            hero.change_size(30, 30)

###Timer text on top left of screen----------------------------
        if timer_started:
            passed_time = pygame.time.get_ticks() - start_time
        text = font.render(str(MTS(passed_time)), True, font_color)
        screen.blit(text, (3, 45))
        

###If player dies--------------------------------
        for obj in fallingobjects:
            pygame.display.flip()
            if hp < 1: 
                currently_playing = False 
                game_over = True
                game_started = False
                timer_started = False
                break
###Death screen ----------------------------------------------
        if hp == 0 and currently_playing == False and game_over == True and game_started == False:
            screen.fill(RED)
            saitama.draw(screen)
            text = font.render("You lived for: "+str(MTS(passed_time))+" seconds", True, font_color)
            screen.blit(text, (3, 45))
            font = pygame.font.SysFont("Times New Roman" ,35)
            text = font.render("Your Score: "+str(scorecount), True,(150,0,0))
            screen.blit(text,(0,0))
            font = pygame.font.SysFont('Comic Sans MS', 50)
            text = font.render('PRESS ESC TO QUIT', True, BLACK)
            screen.blit(text,(end2x,end2y))
            font = pygame.font.SysFont('Times New Roman', 50)
            text = font.render('Press R to Try Again', True, BLACK)
            screen.blit(text,(end3x,end3y))
            if event.type == pygame.QUIT:
                running = False
                sys.exit()
                pygame.quit()
###Event for quitting----------------------------------------
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    
    


###Timer-----------------------------------------
    clock.tick(60)
###stm uses numbers given by mts. mts uses numbers given by tick counter
    print (STM(MTS(pygame.time.get_ticks())))
    
    
    

###print (pygame.time.get_ticks())
###print (MTS(pygame.time.get_ticks()))
        

###used to reference if the game was actually counting-------------------------
print("score:", scorecount)
print("hp:", hp)
pygame.quit()

print (9%2)