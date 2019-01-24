import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Book} from "./books";


@Entity("genres",{schema:"phyor"})
export class Genre {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

    @Column("varchar",{ 
        nullable:true,
        length:50,
        name:"name"
        })
    name:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:150,
        name:"wikidataUri"
        })
    wikidataUri:string | null;
        

   
    @OneToMany(type=>Book, book=>book.genre,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    books:Book[];
    
}
