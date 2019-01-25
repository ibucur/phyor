import {BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {StringHelper} from "../helper/stringHelper";
const crypto = require('crypto');

@Entity("users",{schema:"phyor"})
export class User {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

    @Column("varchar",{ 
        nullable:true,
        length:60,
        name:"email"
        })
    email:string | null;
    @BeforeUpdate()
    @BeforeInsert()
    updateEmail() {
        this.email = StringHelper.formatEmail(this.email);
    }
        
    @Column("varchar",{
        nullable:true,
        length:80,
        name:"password"
        })
    password:string | null;

    @Column("tinyint",{
        nullable:true,
        default:1,
        name:"active"
    })
    active:number | null;

    @Column("varchar",{ 
        nullable:true,
        length:50,
        name:"fullName"
        })
    fullName:string | null;

    public static getHashPassword(textPassword: string) : string {
        return crypto.createHash('sha256').update(textPassword).digest('hex');
    }


}
