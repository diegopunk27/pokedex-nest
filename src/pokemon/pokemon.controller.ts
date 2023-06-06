import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { MongoParseIdPipe } from 'src/common/pipes/mongo-parse-id/mongo-parse-id.pipe';
import { PaginatedDto } from 'src/common/dto/paginated.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  //@HttpCode(HttpStatus.CREATED) Opcional para especificar un codigo especifico
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Get()
  findAll(@Query() paginatedDto:PaginatedDto) {
    return this.pokemonService.findAll(paginatedDto);
  }

  /*reemplazamos el nombre 'id' por 'term', porque al buscar por 'id', o 'name' o 'no'
    semanticamnete no es 'id' sino termino ('term') de busqueda
  */
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.pokemonService.findOne(term);
  }

  @Patch(':term')
  update(@Param('term') term: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.update(term, updatePokemonDto);
  }

  @Delete(':id')
  remove(@Param('id', MongoParseIdPipe) id: string) {
    return this.pokemonService.remove(id);
  }
}
