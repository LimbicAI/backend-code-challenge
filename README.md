# Back End Code Challenge

This is a backend code challenge for Limbic, a simple graphql server exposing a simple 
database of users and posts.

## The Challenge

You are tasked with writing an API to create Users and Posts. It should be a Node.js server with the following endpoints:

- Register a new user to database
- Create a new post for user in database
- Return user and their posts

## Stack

The server is fully written in typescript with
[Apollo Server](https://www.apollographql.com/docs/apollo-server/) as the graphql framework,
[jest](https://jestjs.io/)x for testing, [PostgreSQL](https://www.postgresql.org/) as the
database and [Knex](https://knexjs.org/) as the sql abstraction.

## Project Structure

The project has configuration files at the top level and code under `src`.

Under `src` the project is split into:
- A `tests` folder containing integration tests.
- A `migrations` folder containing database migration files to be used with [Knex migrations](https://knexjs.org/#Migrations).
- A `lib` folder with the server code

The source code under `lib` has the project entry point at `index.ts` which handles
initializing the server at `server.ts`. `server.ts` also contains the GraphQL type
specification.
Due to the small nature of the project, all the business logic is in `resolvers.ts` which
loads and formats the data from the DB, as well as writing to it. 

Unit tests are written next to the logic using the jest convention of naming files `*.test.ts`. Again as it is a very small project, only the business logic in the resolvers is tested as the rest is boilerplate apollo server.

## Development

Development can be done locally. Start by cloning the repo and installing the dependencies.

```bash
$ npm install
```

You'll need a postgres server running locally, you can use Docker for that or the very good [PostgresApp](https://postgresapp.com/) on a Mac. To configure the database connection export
a postgres connection string to your environment.

```bash
$ export DB_URL=postgresql://user:password@server:port/dbname
```

Making sure to substitute `user`, `password`, `server`, `port` and `dbname` accordingly.

Running unit test can be done with the npm command.

```bash
$ npm test
```

You can pass arguments to jest using a double dash before the arguments, so running test in
watch mode can be done with `npm test -- --watch`.

### Integration tests

Integration test are not run together with unit test as they require a database. You can run
them with:

```bash
$ npm run integration
```

The tests will run one at a time resetting the database before each run. When adding a new
test file for integration tests be sure to reset the DB before each test yourself otherwise
the data will be corrupted. The reset helper will make sure to delete all data in the DB and
migrate it to the latest migration available.

## Production

Production can be run with docker for that skip to the next section.

In production code should be compiled to javascript before running, for that you can run

```bash
$npm run build
```

The compiled code will be available under the `build` folder at the top level. After 
compilation succeeds be sure to set some environment variables:

- `DB_URL` -- postgres connection string
- `DELAY_START_MS` -- custom delay start the server, helpful when the DB and server start
  start at the same time and it's helpful to wait for the DB to be ready
- `MIGRATE_LATEST` -- when set to `true` this will migrate the db to the latest version
  before starting the server 
- `NODE_ENV` -- node even should manually be set to `production`

## Docker & Docker compose

There is a docker file for easy of packaging and distributing. Build your docker image substituting user and name with your choices, with:

```bash
$ docker build . -t $user/$name
```

Depending on your deployment setup you'll need to forward the port `4000` and set the environment variables described above.

### Docker compose

Docker compose will help you run the application with a connected postgres db, for that
simply run:

```bash
docker-compose up
```

That will expose the server on port 4000 of your local system.