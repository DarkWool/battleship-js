# Battleship - [view live](https://darkwool.github.io/battleship-js/)

This is a project made for The Odin Project's curriculum based on the popular board game, as you can imagine
the goal was to recreate it and implement **TDD** (Test Driven Development).

To be honest, this was far more difficult than I imagined at first glance, testing things got complicated after reaching a certain point of the project, but that was not the only difficult part of it, I decided to implement a "drag and drop" feature to place the ships and I didn't know a single thing about it but all of this ended a lot better than I expected.

Another point that is good to remember is that I followed the MVC pattern, implementing _PubSub_ at the end of the project and it was a good thing to do in my opinion, I don't expect it to be perfect but thanks to it I was able to learn a lot of new things that I can use for my incoming projects!

![Battleship gameplay](/gameplay.gif "Battleship gameplay")

## Features

1. Drag and drop your ships to place them in your board.
1. "Randomize" button that quickly places the ships for you.
1. Possibility to change your ship's axis when it has been already placed on the board (this can be done by clicking the ship).
1. An enemy's ship is "revealed" when it's sunk.
1. Smart AI (or computer player) that knows when he has hit a ship so it starts attacking adjacent boxes to sink it.

### Other important things

1. Every ship must be at least 1 box apart of other ones.
1. When a ship is sunk the game marks all the adjacent boxes as "attacked".

## Specifications

1. Begin your app by creating the Ship factory function.
   1. Your ‘ships’ will be objects that include their length, the number of times they’ve been hit and whether or not they’ve been sunk.
   1. Ships should have a hit() function that increases the number of ‘hits’ in your ship.
   1. isSunk() should be a function that calculates it based on their length and the number of ‘hits’.
1. Create Gameboard factory.
   1. Gameboards should be able to place ships at specific coordinates by calling the ship factory function.
   1. Gameboards should have a receiveAttack function that takes a pair of coordinates, determines whether or not the attack hit a ship and then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot.
   1. Gameboards should keep track of missed attacks so they can display them properly.
   1. Gameboards should be able to report whether or not all of their ships have been sunk.
1. Create Player.
   1. Players can take turns playing the game by attacking the enemy Gameboard.
   1. The game is played against the computer, so make ‘computer’ players capable of making random plays. The AI does not have to be smart, but it should know whether or not a given move is legal. (i.e. it shouldn’t shoot the same coordinate twice).
1. Create the main game loop and a module for DOM interaction.
   1. The game loop should set up a new game by creating Players and Gameboards. For now just populate each Gameboard with predetermined coordinates. You can implement a system for allowing players to place their ships later.
   1. You need methods to render the gameboards and to take user input for attacking. For attacks, let the user click on a coordinate in the enemy Gameboard.
   1. The game loop should step through the game turn by turn using only methods from other objects. If at any point you are tempted to write a new function inside the game loop, step back and figure out which class or module that function should belong to.
   1. Create conditions so that the game ends once one players ships have all been sunk. This function is appropriate for the Game module.
1. Finish it up
   1. There are several options available for letting users place their ships. You can let them type coordinates for each ship, or investigate implementing drag and drop.
   1. You can polish the intelligence of the computer player by having it try adjacent slots after getting a ‘hit’.

Check the assignment's page [here.](https://www.theodinproject.com/lessons/node-path-javascript-battleship)
