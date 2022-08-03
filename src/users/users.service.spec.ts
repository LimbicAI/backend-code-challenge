import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const userInput = {
    email: 'test@test.com',
    password: 'password',
  };

  const user = {
    id: 1,
    email: userInput.email,
  };

  const mockUserRespsitory = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRespsitory,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createUser', async () => {
    mockUserRespsitory.create.mockReturnValue(userInput);
    mockUserRespsitory.save.mockReturnValue(user);

    const res = await service.createUser(userInput);
    expect(res).toMatchObject(user);
    expect(mockUserRespsitory.create).toHaveBeenCalledWith(userInput);
    expect(mockUserRespsitory.save).toHaveBeenCalledWith(userInput);
  });

  it('getUser', async () => {
    mockUserRespsitory.findOne.mockReturnValue(user);

    const res = await service.getUser(user.id);
    expect(res).toMatchObject(user);
    expect(mockUserRespsitory.findOne).toHaveBeenCalledWith({
      where: { id: user.id },
    });
  });

  it('getUserByEmail', async () => {
    mockUserRespsitory.findOne.mockReturnValue(user);

    const res = await service.getUserByEmail(user.email);
    expect(res).toMatchObject(user);
    expect(mockUserRespsitory.findOne).toHaveBeenCalledWith({
      where: { email: user.email },
    });
  });
});
