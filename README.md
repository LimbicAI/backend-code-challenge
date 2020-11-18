# backend-code-challenge

My main motiviation with this project is to see what you do with foreign code, but only generally, and in small amount of hours. 
I think this should be doable, even without any graphql experience before. It might be useful to read through the Apollo Graphql Tutorial first, 
to give some basic introduction to graphql as a whole.

I'd like how far you come in 8 hours or so. Really don't spend more time on it, I just want to see how you code, not necessarily how fast!

If you get stuck with the setup, chat us up ASAP, because I wouldn't feel good when you'd be spending time on that.

# Goal for you!

You are tasked with writing a piece of software to create Users and Posts.
It must comprise an Node.js Apollo Graphql Server with PostgreSQL as database storage
with the following queries / mutations:

- [ ] Register a new user to database.
- [ ] Create a new user's post to database.
- [ ] Return user and his posts.
- [ ] Add unit tests for the above services.

## Stack to use:

- NodeJS
- Apollo graphql server
- PostgreSQL (you can use an ORM like Sequelize ORM for if you use plain sql we are open to this approach too)
- Docker
- Jest / Mocha-Chai (pick a tool that fits you more)

## Requirements:

- It must be production quality according to your understanding of it - tests, Docker, README, etc.

## General notes:

- You will submit the source code for your solution to us as a compressed file containing all the code and possible documentation. Please make sure to not include unnecessary files such as the Git repository, compiled binaries, etc;
- Please **do not upload** your solution to public repositories in GitHub, BitBucket, etc.

## Things we're looking for:

- Unit tests;
- API design;
- Error handling.
- Dockerize the service.

# Extra bonus! 

The following tasks are not required, but will give you an extra bonus in case you accomplished them

- [ ] Update this user -> You should take concurrency issues into consideration, eg multiple concurrent updates;

- [ ] Add integration tests

## How to submit:

Fork this repo
Issue a Pull Request when you're ready to start. This will count as your starting date.
Try to work max 8hours for this test project.
Setup your development environment for nodeJS + Apollo graphql + Postgres
Implement your solution
Commit your changes into the forked repo
