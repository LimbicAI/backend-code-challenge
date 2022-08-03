import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  let service: PostsService;
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
  const mockPostRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockPostRepository,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create', async () => {
    const post = mockPosts[0];
    mockPostRepository.create.mockReturnValue(post);
    mockPostRepository.save.mockReturnValue(post);

    const { user, text } = post;
    const res = await service.create(user.id, { text });
    expect(res).toMatchObject(post);
    expect(mockPostRepository.create).toHaveBeenCalledWith({
      user: {
        id: user.id,
      },
      text,
    });
    expect(mockPostRepository.save).toHaveBeenCalledWith(post);
  });

  it('findAll', async () => {
    mockPostRepository.find.mockReturnValue(mockPosts);

    const res = await service.findAll();
    expect(res).toMatchObject(mockPosts);
    expect(mockPostRepository.find).toHaveBeenCalledWith({
      relations: ['user'],
    });
  });

  it('findOne', async () => {
    mockPostRepository.findOne.mockReturnValue(mockPosts[0]);

    const { user, ...post } = mockPosts[0];
    const res = await service.findOne(post.id);
    expect(res).toMatchObject(mockPosts[0]);
    expect(mockPostRepository.findOne).toHaveBeenCalledWith({
      where: { id: post.id },
      relations: ['user'],
    });
  });
});
