import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Book} from "./books";


@Entity("publishers",{schema:"phyor"})
export class Publisher {

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
        

   
    @OneToMany(type=>Book, book=>book.publisher,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    books:Book[];
    
}
