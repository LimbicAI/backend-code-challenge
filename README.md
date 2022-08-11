# Limbic Backend Challenge

My submission for the Limbic Backend Challenge

## Script:

- npm install
- tsc
- npm start

## Mongodb

- Select which MongoDB instance you'd like to use eg Atlas or Local and provide the connection string in the .env file.


## Endpoints:

### User:

-[POST] create user : localhost:3000/user/ ---- Request body should contain these keys {username,firstname,surname}
-[GET] get user : localhost:3000/user/userName ---- Request parameter should be username

### Posts:

-[POST] create post for a specific user: localhost:3000/post ---- Request body should contain these keys {title,description,username}
-[GET] get all posts by a specific user : localhost:3000/post/userName ---Request parameter should be username
