import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginatedDto } from 'src/common/dto/paginated.dto';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel = Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
      
    } catch (error) {
      this.handlerExceptions(error);
    }
  }

  findAll(paginatedDto:PaginatedDto) {
    const {limit=10, offset=0} = paginatedDto;

    return this.pokemonModel.find()
    .limit(limit)
    .skip(offset)
    .sort({
      no:1
    })
    .select('-__v')
    ;
  }

  async findOne(term: string) {
    let pokemon:Pokemon;

    if( !isNaN(+term) ){
      //Busqueda por id secundario (numerico)
      pokemon = await this.pokemonModel.findOne({no:term});
    }else if(isValidObjectId(term)){
      //Busqueda por mongo id (string)
      pokemon = await this.pokemonModel.findById(term);
    }else{
      //Busqueda por nombre (string)
      pokemon = await this.pokemonModel.findOne({name:term.toLocaleLowerCase()})
    }

    if(!pokemon){
      throw new NotFoundException(`Pokemon with id, name or no:'${term}' not found`);
    }
    
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    
    if(updatePokemonDto.name){
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    }

    try {
      await this.pokemonModel.updateOne(updatePokemonDto);
      return {...pokemon.toJSON(), ...updatePokemonDto};
    } catch (error) {
      this.handlerExceptions(error);
    }

  }

  async remove(id: string) {
    /*  Eliminacion utilizando el termino (term)
    
    const pokemon = await this.findOne(term);

    //Forma 1 de eliminacion con cualquier termino
    await this.pokemonModel.deleteOne({no:pokemon.no});

    //Forma 2 de eliminacion con el objeto directamente
    await pokemon.deleteOne();*/

    /*Eliminacion utilizando solo el mongo id, con el control del pipe y 
    con una unica accion de busqueda y eliminacion
    Problema: este metodo de eliminacion siempre genera un status 200 auqnue no encuentre el id
    
      const pokemon = await this.pokemonModel.findByIdAndDelete(id);
    */
    
    const {deletedCount} = await this.pokemonModel.deleteOne({_id : id});

    if(deletedCount === 0)
      throw new BadRequestException(`Pokemon does not exist with the id: ${id}`);
    
    return ;
    
  }

  private handlerExceptions(error:any){
    if(error.code === 11000){
      throw new BadRequestException(`This pokemon exist ${ JSON.stringify(error.keyValue) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Cant update pokemon - Check server Logs`);      
  }
}
