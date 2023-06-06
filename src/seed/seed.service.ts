import { Injectable } from '@nestjs/common';
import { PokemonAPI } from './interfaces/pokemon-api.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpAxiosAdapter } from 'src/common/adapters/http-axios-adapter';
//import axios, { AxiosInstance } from 'axios';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel = Model<Pokemon>,
    readonly http : HttpAxiosAdapter
  ){}

  /* Evitamos utilizar directamente la dependencia de axios, e implementamos patron adaptador creando HttpAxiosAdapter
  
  private readonly axiosInstance:AxiosInstance = axios;

  */

  async executeSeed(){
    // Es igual a DELETE * FROM pokemon;
    await this.pokemonModel.deleteMany({});

    const pokemonsFromApi = await this.http.get<PokemonAPI>('https://pokeapi.co/api/v2/pokemon?limit=100');

    const pokemonData = pokemonsFromApi.results;

    //const insertPromesesArray= [];

    const pokemonToInsert : {name:string,no:number}[] = [];

    pokemonData.forEach(async (pokemon) =>{
      const name = pokemon.name;
      const no = +pokemon.url.split('/')[6];
      
      /* Metodo 1 : insertar uno x uno con create
      
      Este metodo de inserción presenta el problema que se deberá esperar (await)
      por cada insereción en la base de datos 
      
      const newPokemon = await this.pokemonModel.create({name:name,no:no});  
      */

      /* Metodo 2 : insertar todas las promesas en un array y luego ejecutarlas
                    fuera del foreach con un Promise.all(), evitando esperar por cada inserción

      Este metodo es mas rapido que el 1, pero todavía existe el problema de que hay que insertar
      muchos elementos con el Promise.all
      
      insertPromesesArray.push(this.pokemonModel.create({name,no}));
      */

      /* Metodo 3 : Es el más eficiente, y consiste en cada iteración solo guardar los valores
                    a insertar en un array, y luego ejecutar todo junto con insertMany()

      Este metodo termina ejecutandose como si se hiceria lo siguiente en sql, ej:
          INSERT INTO pokemons values(name, no)
            ("pikachu" , 1)
            ("pidgeot" , 2)
      */

      pokemonToInsert.push({name,no});
    });

    //await Promise.all( insertPromesesArray );

    await this.pokemonModel.insertMany( pokemonToInsert );

    return 'Seed executed';
  }

}
