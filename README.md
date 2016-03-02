[![General Assembly Logo](https://camo.githubusercontent.com/1a91b05b8f4d44b5bbfb83abac2b0996d8e26c92/687474703a2f2f692e696d6775722e636f6d2f6b6538555354712e706e67)](https://generalassemb.ly/education/web-development-immersive)

# Overview

This app allows a user to create and store a representation of their stock
portfolio. They can add and remove purchases, and see the gain or loss of each
purchase given the most recent price of the stock. They can also see a graphical
breakdown of their portfolio


##Technologies Used

The front-end of the app is built with HTML and styled using the Bootstrap sass
framework. The game logic is built using JavaScript, which interacts with the
interface using jQuery. The JavaScript also uses AJAX to interact with the
back-end server, using FormData to send sign up, sign in, sign out, and
change password requests, and JSON to send game data requests to create new
instances of a game on the back-end, update the game-state, and retrieve
the game-state. The visual representation of the board is then rendered
using data from the back-end using jQuery.

## User Stories

Upon opening the page, users will be able to either create an account by
clicking the "Sign Up" or log into an existing account with the "Sign In"
button, each of which will open modals with the appropriate fields. After
signing in, the "Sign Up" and "Sign In" buttons will be hidden, and replaced
by "Change Password" and "Sign Out" buttons. The user will be able to change
their password by clicking the "Change Password" button and entering their old
and new passwords.

Users will also be able see an empty tic-tac-toe board after signing in.
Users can then begin playing by clicking on one of the squares. By clicking one
of the squares, the user will be able to mark the square with either X or O
(depending on whose turn it is, which is displayed on the scoreboard at the
bottom of the page). After marking a square with a letter, the user will then
be able to mark a different square with the opposite letter, and continue to
alternate until one player wins or there is a draw (all squares are filled with
no winner). The user will then see an alert telling them the outcome of the
game, and then see a new cleared board. If one player wins, that player's score
will be incremented by 1, and the user will be able to see the current score on
the scoreboard. When finished, the user will be able to click the "Sign Out"
button, which will log their account out of the back-end, hide the board, and
the user will again see the "Sign Up" and "Sign In" buttons on the navbar at
the top of the page.

##Wireframe

See initial wireframe [here](https://drive.google.com/file/d/0B7bwsjwFCuRgLTBNSm5MWExpd1hrbDlBdmpLUWtDQ1IwWVNr/view?usp=sharing)
