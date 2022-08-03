import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection, EntityManager, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as Path from 'path';

describe('UserResolver (e2e)', () => {
  let app: INestApplication;
  let fixture: TestingModule;
  let queryRunner: QueryRunner;
  const gql = '/graphql';

  const users: string[] = JSON.parse(
    fs.readFileSync(
      Path.join(__dirname, '../test/fixtures/users.json'),
      'utf8',
    ),
  );

  beforeAll(async () => {
    fixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = fixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const dbConnection = fixture.get(Connection);
    const manager = fixture.get(EntityManager);
    // @ts-ignore
    queryRunner = manager.queryRunner =
      dbConnection.createQueryRunner('master');

    await queryRunner.startTransaction();
  });

  describe('should add new users', () => {
    it.each(users)('create (%s)', async (user: any) => {
      return await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation{ createUser(createUserData: {email: "${user.email}", password: "${user.password}"}){ id email } }`,
        })
        .expect(200)
        .expect(async (res) => {
          const {
            body: { data },
          } = res;
          expect(data && data.createUser).toMatchObject({
            email: user.email,
          });
          expect(data && data.createUser).toHaveProperty('id');
        });
    });
  });

  describe('should return access_token', () => {
    it.each(users)('/auth/login (%s)', async (user: any) => {
      return await request(app.getHttpServer())
        .post('/auth/login')
        .send(user)
        .expect(201)
        .expect((res) => {
          const { body } = res;
          expect(body).toHaveProperty('access_token');
        });
    });
  });

  describe('should return access_token because of incorrect password', () => {
    it.each(users)('/auth/login (%s)', async (user: any) => {
      return await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: user.email, passord: 'dummyPassword' })
        .expect(401);
    });
  });

  describe('should return access_token because of unregistered user', () => {
    it.each(users)('/auth/login (%s)', async (user: any) => {
      return await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'unknow@gmail.com', passord: user.passord })
        .expect(401);
    });
  });

  afterAll(async () => {
    await queryRunner.rollbackTransaction();
  });
});
