import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import React from 'react'

import { Layout } from '@/components/layout/Layout';
import { PokemonDetailsHeader } from '@/components/pokemon/PokemonDetailsHeader';
import { PokemonDetailsInfo } from '@/components/pokemon/PokemonDetailsInfo';

import { pokeApi } from '@/api';
import { Pokemon, PokemonListResponse } from '@/interfaces';
import { getPokemonInfo } from '@/services';
import { PokemonTypeColors } from '@/utilites';


interface Props {
  pokemon: Pokemon;
}

const PokemonPage: NextPage<Props> = ({ pokemon }) => {
  const pokeIndex = ('000' + (pokemon.id)).slice(-3);

  const backgroundColors = pokemon.types.map(({ type }) => {
    const [[, backgroundColor]] = Object.entries(PokemonTypeColors).filter(
      ([key, _]) => key === type.name
    );
    return backgroundColor;
  });

  const selectedBackgroundColor = backgroundColors && backgroundColors[0];

  return (
    <Layout title={pokemon.name}>
      <div className="px-2 md:px-24 lg:px-64 pt-24">
        <div className="pb-8">
          <Link
            className="text-primary font-semibold transform hover:-translate-y-1 transition-transform ease-in duration-150 focus:outline-none"
            href="/"
          >
            <a className="text-primary font-semibold">Regresar</a>
          </Link>
          <div className="flex flex-col lg:flex-row justify-center items-start w-full mx-auto my-4 rounded-lg shadow-lg"
            style={{
              backgroundColor:
                selectedBackgroundColor &&
                selectedBackgroundColor.medium,
            }}>
            <PokemonDetailsHeader pokemon={pokemon} selectedBackgroundColor={selectedBackgroundColor} />
            <PokemonDetailsInfo pokemon={pokemon} />
          </div>

        </div>
      </div>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async (ctx) => {

  const { data } = await pokeApi.get<PokemonListResponse>('/pokemon?limit=151');
  const pokemonNames: string[] = data.results.map(pokemon => pokemon.name);

  return {
    paths: pokemonNames.map(name => ({
      params: { name }
    })),
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {

  const { name } = params as { name: string };

  const pokemon = await getPokemonInfo(name);

  if (!pokemon) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      pokemon
    }
  }
}

export default PokemonPage