import Image from 'next/image';
import React, { FC } from 'react'

import { Pokemon } from '@/interfaces'


interface Props {
  pokemon: Pokemon;
  selectedBackgroundColor: { light: string; medium: string };
}

const ImageSize = 325;

const PokemonImageStyling = {
  width: ImageSize,
  height: ImageSize,
  display: "block",
  left: 0,
  right: 0,
  bottom: 5,
  margin: "auto",
};

export const PokemonDetailsHeader: FC<Props> = ({ pokemon, selectedBackgroundColor }) => {
  const pokeIndex = ('000' + (pokemon.id)).slice(-3);
  return (
    <>
      <div className="w-full">
        <div className="px-4 md:px-8">
          <p className="text-md mt-4 text-white font-medium">
            #{pokeIndex}
          </p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl text-white font-bold pb-6 capitalize">
            {pokemon.name}
          </h1>
        </div>
        <div className="relative text-center mx-auto w-full h-96 ">
          <Image src={pokemon.sprites.front_default} alt={pokemon.name} width={ImageSize} height={ImageSize} />
        </div>
      </div>
    </>
  )
}
