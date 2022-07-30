# Architecture Components
![My animated logo](architecture.png)
_Abstract architecture overview diagram_
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
$ yarn
```


### Environment Variable

```bash
$ cp .env.example .env
```
### Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn run start:prod
```

### Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```




