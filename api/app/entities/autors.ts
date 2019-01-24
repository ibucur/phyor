import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Book} from "./books";


@Entity("autors",{schema:"phyor"})
export class Autor {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

    @Column("varchar",{ 
        nullable:true,
        length:60,
        name:"name"
        })
    name:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:150,
        name:"wikidataUri"
        })
    wikidataUri:string | null;
        

   
    @OneToMany(type=>Book, book=>book.author,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    books:Book[];
    
}
