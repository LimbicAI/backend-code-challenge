import { Field, ID, ObjectType } from "@nestjs/graphql";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcryptjs";
import { Base } from "../../database/entities/base.entity";
import { classToPlain, Exclude } from "class-transformer";
import { IsEmail, IsOptional } from "class-validator";
import { Post } from "../../posts/entities/post.entity";

@ObjectType('User')
@Entity({
    name: 'users'
})
export class User extends Base {

    @PrimaryGeneratedColumn("increment")
    @Field(() => ID)
    id: number;

    @IsEmail()
    @Field()
    @Column("varchar", { length: 255, unique: true })
    email: string;

    @IsOptional()
    @Column("text")
    @Exclude({ toPlainOnly: true })
    password: string;

    @OneToMany(() => Post, (post) => post.user, { cascade: true })
    @Field(() => [Post])
    posts: Post[]

    toJSON() {
        return classToPlain(this);
    }

    @BeforeInsert()
    async hashPasswordBeforeInsert() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    async comparePassword(password: string): Promise<boolean> {
        if (!this.password || !password)
            return false;

        return bcrypt.compare(password, this.password);
    }
}

