import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from '../../database/entities/base.entity';

@ObjectType()
@Entity({
  name: 'posts'
})
export class Post extends Base {

  @PrimaryGeneratedColumn("increment")
  @Field(() => Int)
  id: number;

  @IsString()
  @Column("text")
  @Field()
  text: string

  @Field(() => User)
  @JoinColumn({
    name: 'userId'
  })
  @ManyToOne(() => User, (user) => user.posts)
  user: User



}
