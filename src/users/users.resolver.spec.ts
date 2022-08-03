import { Test, TestingModule } from '@nestjs/testing';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

describe('UsersResolver', () => {
  let resolver: UsersResolver;

  const userInput = {
    email: 'test@test.com',
    password: 'password',
  };

  const user = {
    id: 1,
    email: userInput.email,
  };

  const mockUserService = {
    getUser: jest.fn(),
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('createUser', async () => {
    mockUserService.createUser.mockReturnValue(user);

    const res = await resolver.createUser(userInput);
    expect(res).toMatchObject(user);
    expect(mockUserService.createUser).toHaveBeenCalledWith(userInput);
  });

  it('getUser', async () => {
    mockUserService.getUser.mockReturnValue(user);

    const res = await resolver.getUser(user as User);
    expect(res).toMatchObject(user);
    expect(mockUserService.getUser).toHaveBeenCalledWith(user.id);
  });
});
