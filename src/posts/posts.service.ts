import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostInput } from './dto/create-post.input';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}
  async create(
    userId: number,
    createPostInput: CreatePostInput,
  ): Promise<Post> {
    const post = this.postRepository.create({
      user: { id: userId },
      ...createPostInput,
    });
    return await this.postRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: number): Promise<Post | null> {
    return await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }
}
