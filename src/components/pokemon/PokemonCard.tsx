import Image from "next/image";
import Link from "next/link"
import { FC } from "react"

import { SmallPokemon } from "@/interfaces"

interface Props {
  pokemon: SmallPokemon;
}

export const PokemonCard: FC<Props> = ({ pokemon }) => {
  const pokeIndex = ('000' + (pokemon.id)).slice(-3);
  return (
    <Link href={`/pokemon/${pokemon.name}`}>
      <a className="w-full rounded-lg overflow-hidden shadow-lg mx-auto cursor-pointer hover:shadow-2xl transition-all duration-200 ease-in-out transform hover:-translate-y-2">
        <div className="py-10 mx-auto w-full flex items-center justify-center relative">
          <span className="absolute text-5xl text-slate-500 top-0 right-3 font-bold">#{pokeIndex}</span>
          <Image
            alt={pokemon.name}
            width={150}
            height={150}
            src={pokemon.img}
          />
          <span className="uppercase font-semibold tracking-wider text-amber-400">
            {pokemon.name}
          </span>
        </div>
      </a>
    </Link>
  )
}
