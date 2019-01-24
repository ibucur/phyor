import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Book} from "./books";


@Entity("languages",{schema:"phyor"})
export class Language {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

    @Column("varchar",{ 
        nullable:true,
        length:20,
        name:"name"
        })
    name:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:150,
        name:"wikidataUri"
        })
    wikidataUri:string | null;
        

   
    @OneToMany(type=>Book, book=>book.language,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    books:Book[];
    
}
