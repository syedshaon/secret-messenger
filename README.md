# Members Only Message Board

## Live site can be found here -> https://secret-messenger.onrender.com/

Done for the fulfillment of The Oding Academy Project -> https://www.theodinproject.com/lessons/nodejs-members-only

## Functionalities:

- Anyone can sign up
- Only logged-in users can see the date of the message posted and the user who posted it
- Once the user joins the secret group from https://secret-messenger.onrender.com/messages/create page by answering the question, he can post new messages
- Only users with the "Admin" privilege can delete messages from the https://secret-messenger.onrender.com/ page.
- Admin Username: captainplanetATgmail.com password: PzdXa1XwheEmiJ3Hskf
- Once someone sign in, he will remain signed in for 1 MINUTE. This is the expiration time of JWT and cookie we set. It can be changed.
- JWT is set as token on user's cookie
- If the user sin-out then his jwt is removed from cookie. Also that cookie is blacklisted in database.
- For every sensitive request jwt is checked against blacklisted JWT first. The it is authenticated.

## Tools Used:

- mongoose
- Express JS
- ejs
- PassportJS
- JWT
- dotenv
- Bulma CSS
