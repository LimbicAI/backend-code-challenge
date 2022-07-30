import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcryptjs";
import { Base } from "../../database/entities/base.entity";
import { classToPlain, Exclude } from "class-transformer";
import { IsEmail, IsOptional } from "class-validator";

@ObjectType()
@Entity({
    name: 'users'
})
export class User extends Base {

    @PrimaryGeneratedColumn("increment")
    @Field()
    id: number;

    @IsEmail()
    @Field()
    @Column("varchar", { length: 255, unique: true })
    email: string;

    @IsOptional()
    @Column("text")
    @Field({ nullable: true })
    @Exclude({ toPlainOnly: true })
    password: string;

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

