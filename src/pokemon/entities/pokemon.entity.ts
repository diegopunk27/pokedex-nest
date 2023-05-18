import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Pokemon extends Document{

    //id:string => lo proporiona mongo y es unico 
    @Prop({
        unique:true,
        index:true
    })
    name:string;

    @Prop({
        unique:true,
        index:true
    })
    no:number;

}

export const PokemonSchema = SchemaFactory.createForClass( Pokemon );
