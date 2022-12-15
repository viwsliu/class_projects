import random
from sprite import *

class BadObject:
    def __init__(self, screen_width):
        self.width = screen_width
        self.speed = random.randrange(1, 10)
        self.sprite = Sprite("badapple.png", random.randrange(self.width), 0)
        self.sprite.change_size(15,15)
        self.point = -1
        self.lives = -1
    def update(self):
        self.sprite.y += self.speed
        if self.sprite.y > 670:
            self.reset()
    def reset(self):
        self.sprite.y = 0
        self.sprite.x = random.randrange(self.width)
        self.speed = random.randrange(5, 15)