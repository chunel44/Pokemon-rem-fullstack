


import { GetStaticProps, NextPage } from 'next';

import { Layout } from '@/components/layout/Layout';

import { pokeApi } from '@/api';
import { PokemonListResponse, SmallPokemon } from '@/interfaces';

import { PokemonCard } from '../components/pokemon/PokemonCard';


interface Props {
  pokemons: SmallPokemon[];
}

const HomePage: NextPage<Props> = ({ pokemons }) => {
  return (
    <Layout title='Inicio'>
      <div className="layout min-h-screen py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {pokemons.map(pokemon => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {

  const { data } = await pokeApi.get<PokemonListResponse>('/pokemon?limit=151');

  const pokemons: SmallPokemon[] = data.results.map((poke, i) => ({
    ...poke,
    id: i + 1,
    img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${i + 1}.svg`
  }))

  return {
    props: {
      pokemons
    }
  }
}

export default HomePage;