import { IPokemon } from '@/models';

import { BaseRepository } from './base/baseRepository';


export class PokemonRepository extends BaseRepository<IPokemon>{

  findTS() {
    console.log('first')
  }
}