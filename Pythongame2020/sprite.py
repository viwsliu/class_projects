import pygame

class Sprite(pygame.sprite.Sprite):
    def __init__(self, filename, x=0, y=0):
        pygame.sprite.Sprite.__init__(self)

        self.x = x
        self.y = y
        self.image = pygame.image.load(filename)
        print("This is a Sprite loading from file", filename)
        self.is_visible = True
        
    def draw(self, screen):
        if self.is_visible:
            screen.blit(self.image, (self.x, self.y))
        
    def is_touching(self, other_sprite):
        if self.is_visible and other_sprite.is_visible:
            self.rect = self.image.get_rect()
            self.rect.x = self.x
            self.rect.y = self.y
            other_sprite.rect = other_sprite.image.get_rect()
            other_sprite.rect.x = other_sprite.x
            other_sprite.rect.y = other_sprite.y
            return pygame.sprite.collide_rect(self, other_sprite)
        else: return False

    def hide(self):
        self.is_visible = False
    
    def show(self):
        self.is_visible = True
    
    def change_size(self, x_percent, y_percent):
        w = self.image.get_width()
        h = self.image.get_height()
        new_w = int(w * x_percent / 100)
        new_h = int(h * y_percent / 100)
        self.image = pygame.transform.scale(self.image,(new_w,new_h))
    
    def clicked(self):
        x,y = pygame.mouse.get_pos()
        rectwidth = self.image.get_rect()[2]
        rectheight = self.image.get_rect()[3]
        
        rectxmax = self.x + rectwidth #creating the furthest it can go right
        rectymax = self.y + rectheight #creating the furthest it can go down
        return(  pygame.mouse.get_pressed()[0] and
                 x in range(self.x,rectxmax) and
                 y in range(self.y,rectymax) )
    

