import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Book} from "./books";


@Entity("currencies",{schema:"phyor"})
export class Currency {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

    @Column("varchar",{ 
        nullable:true,
        length:3,
        name:"shortcut"
        })
    shortcut:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:30,
        name:"name"
        })
    name:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:150,
        name:"wikidataUri"
        })
    wikidataUri:string | null;
        

   
    @OneToMany(type=>Book, book=>book.currency,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    books:Book[];
    
}
