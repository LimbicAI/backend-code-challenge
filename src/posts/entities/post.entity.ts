import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from '../../database/entities/base.entity';

@ObjectType('Post')
@Entity({
  name: 'posts',
})
export class Post extends Base {
  @PrimaryGeneratedColumn('increment')
  @Field(() => ID)
  id: number;

  @IsString()
  @Column('text')
  @Field()
  text: string;

  @ManyToOne(() => User, (user) => user.posts)
  @Field(() => User)
  user: User;
}
