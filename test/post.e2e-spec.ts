import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection, EntityManager, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as Path from 'path';

describe('PostResolver (e2e)', () => {
  let app: INestApplication;
  let fixture: TestingModule;
  let queryRunner: QueryRunner;
  const gql = '/graphql';
  const testUser = { email: 'post.test@gmmail.com', password: 'testPass' };
  let existingUser: any;
  let userAccessToken: string;

  const posts: string[] = JSON.parse(
    fs.readFileSync(
      Path.join(__dirname, '../test/fixtures/posts.json'),
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

    //user creation
    existingUser = await request(app.getHttpServer())
      .post(gql)
      .send({
        query: `mutation{ createUser(createUserData: {email: "${testUser.email}", password: "${testUser.password}"}){ id email } }`,
      })
      .then((res) => res.body.data.createUser);

    userAccessToken = await request(app.getHttpServer())
      .post('/auth/login')
      .send(testUser)
      .then((res) => res.body.access_token);
  });

  describe('should add new posts', () => {
    it.each(posts)('create post (%s)', async (post: any) => {
      return await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation{ createPost(createPostInput: { text: "${post.text}"}){ text, user{ id } } }`,
        })
        .set('authorization', `Bearer ${userAccessToken}`)
        .expect(200)
        .expect((res) => {
          const {
            body: { data },
          } = res;
          expect(data.createPost).toHaveProperty('text');
          expect(data.createPost.user && data.createPost.user.id).toBe(
            existingUser.id,
          );
        });
    });
  });

  describe('should not add new add posts - invalid token', () => {
    it.each(posts)('create post (%s)', async (post: any) => {
      return await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation{ createPost(createPostInput: { text: "${post.text}"}){ text, user{ id } } }`,
        })
        .set(
          'authorization',
          `Bearer eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJzdWIiOjM0NSwiaWF0IjoxNjU5NDU0NzQ5LCJleHAiOjE2NTk0NTgzNDl9.XI6EYvDzXZ2fdUyFBMLTR3CgwDnBRQF4lhNWXGiMGrg`,
        )
        .expect(200)
        .expect((res) => {
          const {
            body: { errors },
          } = res;
          expect(errors && errors[0].message).toBe('Unauthorized');
        });
    });
  });

  describe('Return all posts of user', () => {
    it('User posts', async () => {
      return await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{posts{text id user{ id }}}`,
        })
        .set('authorization', `Bearer ${userAccessToken}`)
        .expect(200)
        .expect((res) => {
          const {
            body: { data },
          } = res;
          expect(data.posts).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                user: {
                  id: existingUser.id,
                },
              }),
            ]),
          );
        });
    });
  });

  afterAll(async () => {
    await queryRunner.rollbackTransaction();
  });
});
