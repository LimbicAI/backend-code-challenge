import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) { }

  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  async createPost(
    @CurrentUser() user: User,
    @Args('createPostInput') createPostInput: CreatePostInput): Promise<Post> {
    return await this.postsService.create(+user.id, createPostInput);
  }

  @Query(() => [Post], { name: 'posts' })
  async findAll(): Promise<Post[]> {
    return await this.postsService.findAll();
  }

  @Query(() => Post, { name: 'post' })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<Post> {
    return await this.postsService.findOne(id);
  }

}
