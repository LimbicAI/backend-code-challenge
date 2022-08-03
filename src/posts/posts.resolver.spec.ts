import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/entities/user.entity';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';

describe('PostsResolver', () => {
  let resolver: PostsResolver;
  const mockPosts = [
    {
      id: 1,
      text: 'ut aspernatur corporis harum nihil quis provident sequi\\nmollitia nobis aliquid molestiae\\nperspiciatis et ea nemo ab reprehenderit accusantium quas\\nvoluptate dolores velit et doloremque molestiae',
      user: {
        id: 1,
        email: 'test@test.com',
      },
    },
    {
      id: 2,
      text: 'ut aspernatur corporis harum nihil quis provident sequi\\nmollitia nobis aliquid molestiae\\nperspiciatis et ea nemo ab reprehenderit accusantium quas\\nvoluptate dolores velit et doloremque molestiae',
      user: {
        id: 1,
        email: 'test@test.com',
      },
    },
    {
      id: 3,
      text: 'ut aspernatur corporis harum nihil quis provident sequi\\nmollitia nobis aliquid molestiae\\nperspiciatis et ea nemo ab reprehenderit accusantium quas\\nvoluptate dolores velit et doloremque molestiae',
      user: {
        id: 1,
        email: 'test@test.com',
      },
    },
  ];
  const mockPostService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsResolver,
        {
          provide: PostsService,
          useValue: mockPostService,
        },
      ],
    }).compile();

    resolver = module.get<PostsResolver>(PostsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('createPost', async () => {
    const post = mockPosts[0];
    mockPostService.create.mockReturnValue(post);

    const { user, text } = post;
    const res = await resolver.createPost(user as User, { text });
    expect(res).toMatchObject(post);
    expect(mockPostService.create).toHaveBeenCalledWith(user.id, { text });
  });

  it('findAll', async () => {
    mockPostService.findAll.mockReturnValue(mockPosts);

    const res = await resolver.findAll();
    expect(res).toMatchObject(mockPosts);
    expect(mockPostService.findAll).toHaveBeenCalled();
  });

  it('findOne', async () => {
    const post = mockPosts[0];
    mockPostService.findOne.mockReturnValue(post);

    const res = await resolver.findOne(post.id);
    expect(res).toMatchObject(post);
    expect(mockPostService.findOne).toHaveBeenCalledWith(post.id);
  });
});
