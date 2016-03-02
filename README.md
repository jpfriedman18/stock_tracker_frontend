[![General Assembly Logo](https://camo.githubusercontent.com/1a91b05b8f4d44b5bbfb83abac2b0996d8e26c92/687474703a2f2f692e696d6775722e636f6d2f6b6538555354712e706e67)](https://generalassemb.ly/education/web-development-immersive)

# Overview

This app allows a user to create and store a representation of their stock
portfolio. They can add and remove purchases, and see the gain or loss of each
purchase given the most recent price of the stock. They can also see a graphical
breakdown of their portfolio in the form of a pie chart.

##Technologies Used

The front-end of the app is built with HTML and styled using the Bootstrap sass
framework. The display logic is built using JavaScript, which interacts with the
interface using jQuery. The JavaScript also uses AJAX to interact with the
back-end server, using FormData to send sign up, sign in, sign out, and
change password requests. AJAX requests are also used to create, get, update,
and delete instances of a stock purchase.

## User Stories

Upon opening the page, users will be able to either create an account by
clicking the "Sign Up" or log into an existing account with the "Sign In"
button, each of which will open modals with the appropriate fields. After
signing in, the "Sign Up" and "Sign In" buttons will be hidden, and replaced
by "Change Password" and "Sign Out" buttons. The user will be able to change
their password by clicking the "Change Password" button and entering their old
and new passwords.

Once logged in, the user will see a button giving them the option to add a new
stock purchase. Upon clicking the Add Stock button, the user will see a modal
with fields for a stock symbol, shares purchase, and purchase price. The user
will be able to validate that the ticker symbol they entered corresponds to a
real stock, as the back-end will validate the symbol and present an error
message if it is invalid. After successfully adding a new stock purchase, the
modal will disappear and the newly added stock will be in the main table, which
will have populated with the user's existing stocks if there are any. The user
will be able to click an Update button on each row, which will show a modal
with fields to update the purchase price and shares purchased. The user can
also delete a given stock purchase by clicking the Delete button on its row.
To update the current prices of the stocks in the table, the user can click the
Refresh button below the table.

When the user clicks the Portfolio Chart button above the table, they will be
able to see a pie chart in a modal, representing the relative values of each of
their holdings as a percentage of their protfolio.

When finished, the user will be able to click the "Sign Out"
button, which will log their account out of the back-end, hide the board, and
the user will again see the "Sign Up" and "Sign In" buttons on the navbar at
the top of the page.

##Wireframe

See initial wireframe [here](https://drive.google.com/file/d/0B7bwsjwFCuRgYkM4WjU3bHhGUHNMR3lYVWVJd21NYnpKbHpr/view?usp=sharing)
