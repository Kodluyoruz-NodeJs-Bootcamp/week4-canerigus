import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

//create entity for mysql database.
@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    surname: string;

    @Column({unique: true})
    username: string;

    @Column()
    password: string;

}
