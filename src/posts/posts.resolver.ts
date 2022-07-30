import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { use } from 'passport';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) { }

  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  createPost(
    @CurrentUser() user: User,
    @Args('createPostInput') createPostInput: CreatePostInput): Promise<Post> {
    console.log(createPostInput)
    return this.postsService.create(+user.id, createPostInput);
  }

  @Query(() => [Post], { name: 'posts' })
  async findAll(): Promise<Post[]> {
    return await this.postsService.findAll();
  }

  @Query(() => Post, { name: 'post' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Post> {
    return this.postsService.findOne(id);
  }

}
