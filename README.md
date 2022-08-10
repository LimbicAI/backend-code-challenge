### **Stack Options:**
### *MongoDB*

- TypeScript
- Node.js
- Express
- MongoDB (you may use libs other than the native one if you like)
- Jest / Mocha-Chai

## **Prerequisite**

- Install docker if you don't have it. 
Kindly check [here](https://docs.docker.com/desktop/install/mac-install/).

- Ensure you have node and npm installed on your machine. If you’re not sure, kindly enter this command on your terminal:
  
  `node -v`

  `npm -v`

- Clone this project to your machine:
  
  fetch and checkout to this branch by running the following command

  - `git fetch origin olufemi/limbic-assesment`
  - `git checkout olufemi/limbic-assesment`
    
    To be sure you're now in this branch. 
    
    Do `git branch`, it will show you the current branch you are in.

- Open the project on your favourite IDE . I recommend VScode [Guess Is because I love it 😍]
- To test the routes, you’ll need API client like Postman and if you’re team Insomnia, thats fine.

### **Installing**

Enter the root directory of this project and enter the command below to install all dependencies.

`npm install`

Also, we need to spin up docker so our instances can start running.

Run this command `docker-compose up`

After installing all dependencies, check if the app is up and running by entering the command below:

`npm run start`

The command should spin up the app, you can see the port the app is running on your terminal.

![](https://paper-attachments.dropbox.com/s_72A74ED176B22A988AD5564BEDF7070ED14A4722B875F4FA2DBBAF84583FAB62_1660084216154_Screenshot+2022-08-09+at+22.59.30.png)

Test if routes are working:

    GET http://localhost:8080/api/v1

![](https://paper-attachments.dropbox.com/s_72A74ED176B22A988AD5564BEDF7070ED14A4722B875F4FA2DBBAF84583FAB62_1653655188832_Screenshot+2022-05-27+at+13.37.03.png)

## APIS

> Aside from signup and login, every other endpoint require Authorization header. The token is returned at login

#### **BASEURL**:  http://localhost:8080/api/v1



#### **SIGNUP**


*POST* `/user`

#### **Description**

#### **Body:**
`email` [string]: Required (Must be a valid email format and it also unique. Two users can't have same email)

`password` [string]:Required (Password must be 8 or more characters long, and must contain one or more uppercase, lowercase,number and special character)

`username` [string] : Required

`firstname` [string] :Required

`firstname` [string] : Required


#### Sample Payload

```javascript
    {
        "email": "dyz16600800950523dd@gml.com",
        "password": "@JohnDoe_1",
        "username": "new16600980095523User",
        "lastname": "Doe",
        "firstname": "John"
      }
```

**Sample response:**

```javascript
    {
    "success": true,
    "message": "sign up successful",
    "data": {
        "username": "new16600980e095523User",
        "email": "dyz1660080e0950523dd@gml.com",
        "id": "62f2e24844978eb4da37de13"
    }
}
```

### **LOGIN**
### **POST** `/login`

#### **Description**
#### **Body:**
`email` [string]: Required (The email used for signup)

`password` [string]:Required (Password must be 8 or more characters long, and must contain one or more uppercase, lowercase,number and special character)

>**NOTE: After 3 failed login attempts, user is locked out and  will wait for a minute before making trying again**

#### Sample Payload

```javascript
    {
        "email":"xxxx",
        "password":"xxxxx"
    }
```


**Sample response:**

```javascript
{
    "success": true,
    "message": "Login successful",
    "data": {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxx"
    }
}

```

### **RESET PASSWORD**
### **_PUT_** `/reset-password`

#### **Headers:**

`Authorization`: `Bearer {TOKEN}` //This is the token returned by login endpoint
#### **Description**
#### **Body:**

`email` [string]:Required (The email used for signup)

`password` [string]:Required (Password must be 8 or more)characters long, and must contain one or more uppercase, lowercase,number and special character)

`old_password` [string]:Required (This is users previous password)

`new_password` [string]:Required (This is the password user wants to start using)

`verify_password` [string]:Required (This must be equal with new_password)

**Sample response:**

```javascript
{
    "success": true,
    "message": "Password reset successful",
    "data": {
        "_id": "xxxxx",
        "firstname": "John",
        "lastname": "Doe",
        "email": "dyz1660080e0950523dd@gml.com",
        "username": "new16600980e095523User",
        "createdAt": "2022-08-09T22:40:08.835Z",
        "updatedAt": "2022-08-09T22:53:01.133Z",
        "__v": 0
    }
}
```
 
### **CREATE POST**
### **_POST_** `/post`

#### **Headers:**

`Authorization`: `Bearer {TOKEN}` //This is the token returned by login endpoint

#### **Description**
#### **Body:**
`title` [string]:Required (The title of post)
`content` [string]:Required (The content of post)


#### **Payload**

```javascript
{
    "title":"stuff",
    "content": "lorem Ipsmum jodsdsd"
}
```
**Sample response:**

```javascript
{
    "success": true,
    "message": "Post succesfully created 🥳 🥳",
    "data": {
        "title": "stuff",
        "content": "lorem Ipsmum jodsdsd"
    }
}
```





### **RETRIEVE ALL POSTS BY A USER**
### **_GET_** `/posts`

#### **Headers:**

`Authorization`: `Bearer {TOKEN}` //This is the token returned by login endpoint

#### **Description**

#### **Query:**
`start(date: YYYY-MM-DD)`: Optional (Defaults: today)
`end(date: YYYY-MM-DD)`:Optional(Defaults: yesterday)
`limit(Number)`:Optional  (Defaults:5)
**Sample response:**


```javascript
// `http://localhost:8080/api/v1/posts?start=2022-08-08&limit=5&end=2022-08-10`

{
    "success": true,
    "message": "Posts succesfully fetched for user 🥳 🥳",
    "data": {
        "author": {
            "username": "new16600980e095523User",
            "email": "dyz1660080e0950523dd@gml.com"
        },
        "posts": [
            {
                "title": "stuff",
                "content": "lorem vvvvvv"
            },
            {
                "title": "stuff",
                "content": "lorem chainging thisnfsds"
            },
            {
                "title": "stuff",
                "content": "lorem chainging thisnfsds"
            },
            {
                "title": "stuff",
                "content": "lorem chainging thisnfsds"
            },
            {
                "title": "stuff",
                "content": "lorem chainging thisnfsds"
            }
        ]
    }
}
```


### **UPDATE USER PROFILE**
### **_PUT_** `/user`

#### **Headers:**

`Authorization`: `Bearer {TOKEN}` //This is the token returned by login endpoint

#### **Description**
#### **Body:**
`username` [string]:optional 
`lastname` [string]:optional
`email` [string]:optional


#### **Payload**

```javascript
{
    "firstname":"olufre4ouueewwmi"
    
}
```
**Sample response:**

```javascript
{
    "success": true,
    "message": "User profile update succesful",
    "data": {
        "firstname": "olufre4ouueewwmi",
        "lastname": "Doe",
        "email": "dyz1660080e0950523dd@gml.com",
        "username": "new16600980e095523User"
    }
}
```

### **CONCLUSION**
**Ratelimiter** Middleware locks out user if 50 requests is made in a minute. Ideally I will use 10 requests/minute but had to increase it because of tests.


## **To run tests:**

`npm run test`




![](https://paper-attachments.dropbox.com/s_72A74ED176B22A988AD5564BEDF7070ED14A4722B875F4FA2DBBAF84583FAB62_1660092714017_Screenshot+2022-08-10+at+01.51.45.png)




## **FLOW OVERVIEW**

![](https://paper-attachments.dropbox.com/s_72A74ED176B22A988AD5564BEDF7070ED14A4722B875F4FA2DBBAF84583FAB62_1660092396113_Screenshot+2022-08-10+at+01.46.06.png)

