## Local Infrastructure

Use **docker-compose** to run infrastructure locally.

Launch the containers in detached mode.

```shell
docker-compose -p="backend-code-challenge" up -d
```

Stop the running containers.

```shell
docker-compose -p backend-code-challenge down
```

## Containers  
- Postgres
  - Server available on `localhost:5432`
  - Log in with `admin / admin`
  - Database name is `services`
- pgAdmin
  - UI available on http://localhost:8080
  - Log in with `admin@admin.admin / admin`
### Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

### Installation

```bash
$ npm i
```


### Migration

Use the migration:generate command to let TypeORM generate the migration file.

```bash
$ npm run typeorm:generate-migration --name=MigName
```

To  run migrations
```
$ npm run typeorm:run-migrations
```
### Running the app

```bash
# development
$ npm start

# watch mode
$ npm start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```




