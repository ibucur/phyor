import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Autor} from "./autors";
import {Genre} from "./genres";
import {Publisher} from "./publishers";
import {Language} from "./languages";
import {Currency} from "./currencies";


@Entity("books",{schema:"phyor"})
@Index("autorId",["author",])
@Index("genreId",["genre",])
@Index("publisherId",["publisher",])
@Index("languageId",["language",])
@Index("currencyId",["currency",])
export class Book {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

    @Column("varchar",{ 
        nullable:true,
        length:120,
        name:"title"
        })
    title:string | null;
        

   
    @ManyToOne(type=>Autor, autor=>autor.books,{ onDelete: 'CASCADE',onUpdate: 'CASCADE', eager: true })
    @JoinColumn({ name:'autorId'})
    author:Autor | null;


   
    @ManyToOne(type=>Genre, genre=>genre.books,{ onDelete: 'CASCADE',onUpdate: 'CASCADE', eager: true })
    @JoinColumn({ name:'genreId'})
    genre:Genre | null;


   
    @ManyToOne(type=>Publisher, publisher=>publisher.books,{ onDelete: 'CASCADE',onUpdate: 'CASCADE', eager: true })
    @JoinColumn({ name:'publisherId'})
    publisher:Publisher | null;


    @Column("varchar",{ 
        nullable:true,
        length:20,
        name:"isbn"
        })
    isbn:string | null;
        

   
    @ManyToOne(type=>Language, language=>language.books,{ onDelete: 'CASCADE',onUpdate: 'CASCADE', eager: true })
    @JoinColumn({ name:'languageId'})
    language:Language | null;


    @Column("varchar",{ 
        nullable:true,
        length:150,
        name:"imageUri"
        })
    imageUri:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:200,
        name:"plot"
        })
    plot:string | null;
        

    @Column("int",{ 
        nullable:true,
        name:"pagesNo"
        })
    pagesNo:number | null;
        

    @Column("decimal",{ 
        nullable:true,
        precision:10,
        scale:3,
        name:"price"
        })
    price:string | null;
        

   
    @ManyToOne(type=>Currency, currency=>currency.books,{ onDelete: 'CASCADE',onUpdate: 'CASCADE', eager: true })
    @JoinColumn({ name:'currencyId'})
    currency:Currency | null;

}
