import { FC } from 'react';

import { backgroundColors } from '@/utilites';

import { Pokemon } from '../../interfaces/pokemonFull';

interface Props {
  pokemon: Pokemon;
}

export const PokemonDetailsInfo: FC<Props> = ({ pokemon }) => {
  return (
    <div className="bg-white lg:mt-0 rounded-t-3xl rounded-b-lg lg:rounded-t-none lg:rounded-b-none lg:rounded-r-lg overflow-hidden w-full pt-16 lg:pt-8 px-6 md:px-12 lg:px-24">
      <div className="flex flex-row justify-center w-full">
        <span className="inline-block pb-3 border-b-2 border-primary font-semibold">Pokémon Data</span>
      </div>
      <div className="relative mt-8 lg:h-178">
        <div className='opacity-100 relative w-full h-full'>
          <div>
            <ul className="mt-5">
              <li className="grid grid-cols-2 gap-x-1 mb-3">
                <span className="text-darkerGray font-medium">Height</span>
                <span>{`${pokemon.height / 10} m`}</span>
              </li>
              <li className="grid grid-cols-2 gap-x-1 mb-3">
                <span className="text-darkerGray font-medium">Weight</span>
                <span>{`${pokemon.weight / 10} kg`}</span>
              </li>
              <li className="grid grid-cols-2 gap-x-1 mb-3">
                <span className="text-darkerGray font-medium">Abilities</span>
                <span>
                  {
                    pokemon.abilities.map((x, index) => (
                      <li key={x.slot} className="capitalize">{`${index + 1}. ${x.ability.name}`}</li>
                    ))
                  }
                </span>
              </li>
              <li className="grid grid-cols-2 gap-x-1 mb-3">
                <span className="text-darkerGray font-medium">Types</span>
                <span>
                  {
                    pokemon.types.map((x, index) => (
                      <li key={x.slot} className="capitalize" style={{ color: backgroundColors(x.type) }}>{`${index + 1}. ${x.type.name}`}</li>
                    ))
                  }
                </span>
              </li>
            </ul>
          </div>
          <div className="my-8">
            <h2 className="font-semibold text-lg">Stats</h2>
            <ul className="mt-5">
              {
                pokemon.stats.map((x, index) => (
                  <li key={index} className="grid grid-cols-2 gap-x-1 mb-3">
                    <span className="text-darkerGray font-medium capitalize">{x.stat.name.replace('-', ' ')}</span>
                    <span>{x.base_stat}</span>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
