import * as bcrypt from 'bcryptjs';
import { BaseEntity, PrimaryGeneratedColumn, Entity, Column, BeforeInsert, OneToMany } from 'typeorm';
import { Post } from './Post';

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 255 })
    email: string;

    @Column('text')
    password: string;

    @Column('boolean', { default: false })
    confirmed: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    creationDate: Date;

    @OneToMany(() => Post, post => post.user)
    posts: Post[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}