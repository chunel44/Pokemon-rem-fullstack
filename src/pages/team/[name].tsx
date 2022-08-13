import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import Select, { SingleValue } from 'react-select';
import { toast } from 'react-toastify';

import Button from '@/components/buttons/Button';
import { Layout } from '@/components/layout/Layout';

import { localApi, pokeApi } from '@/api';
import { PokemonListResponse, SmallPokemon } from '@/interfaces';
import { IPokemon } from '@/models';
import { filterByReference } from '@/utilites';

interface Props {
  allPokemons: SmallPokemon[],
  myPokemons: SmallPokemon[];
}

const AddPokemonPage: NextPage<Props> = ({ allPokemons, myPokemons }) => {
  const router = useRouter()
  const { name } = router.query
  const [selectedPokemons, setSelectedPokemons] = useState<SmallPokemon[]>(myPokemons)
  const [filteredPokemons, setfilteredPokemons] = useState<SmallPokemon[]>()

  useEffect(() => {
    setfilteredPokemons(filterByReference(allPokemons, selectedPokemons));
  }, [allPokemons, selectedPokemons]);


  const options = filteredPokemons?.map(poke => {
    return {
      value: poke, label: poke.name
    }
  });

  const onChangeSelected = (inputValue: SingleValue<{
    value: SmallPokemon;
    label: string;
  }>) => {
    const selected: SmallPokemon = inputValue?.value as SmallPokemon;
    setSelectedPokemons([...selectedPokemons, selected])
  }

  const onClick = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    const filterPokemonToSend = filterByReference(selectedPokemons, myPokemons);
    console.log(filterPokemonToSend);
    try {
      const { data, status } = await localApi.post<IPokemon[]>('http://localhost:3000/api/pokemon', {
        data: {
          teamName: name,
          pokemons: filterPokemonToSend
        }
      });
      if (status === 200) {
        toast.success('Pokemons Guardados', {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error('Error al guardar los pokemons', {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
      return;
    }

  }



  return (
    <Layout title={name?.toString()}>
      <div className="layout min-h-screen py-12">
        <div className="flex items-center justify-center">
          <div className="flex-col flex w-full max-w-5xl">
            <span className='text-lg font-bold text-center'>{name}</span>
            <div className="my-4 w-80 block mr-auto ml-auto">
              <Select
                options={options}
                onChange={onChangeSelected}
                isSearchable={false}
                isDisabled={selectedPokemons.length >= 6 && true}
              />
            </div>
            <div className="flex items-center justify-center mb-8">
              {
                selectedPokemons.map((poke, index) => (
                  <div key={poke.id} className=' flex-col mx-4'>
                    <Image src={poke.img} alt={poke.name} width={75} height={75} />
                    <p>{poke.name}</p>
                  </div>
                ))
              }
            </div>

            {
              selectedPokemons.length > myPokemons.length &&
              <div className="flex items-center justify-center">
                <Button onClick={onClick}>Guardar</Button>
              </div>
            }
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

  const session = await getSession({ req });
  const headers = req.headers;
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false
      }
    }
  }

  const { name } = query;

  const { data } = await pokeApi.get<PokemonListResponse>('/pokemon?limit=151');

  const pokemons: SmallPokemon[] = data.results.map((poke, i) => ({
    ...poke,
    id: i + 1,
    img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${i + 1}.svg`
  }))

  const res = await localApi.get<IPokemon[]>('http://localhost:3000/api/pokemon', {
    headers: { Cookie: headers.cookie! },
    data: {
      teamName: name,
    }
  });

  const myPokemons: SmallPokemon[] = res.data.map((poke, i) => ({
    name: poke.name,
    id: +poke.apiId,
    img: poke.imgUrl,
    url: `https://pokeapi.co/api/v2/pokemon/${poke.apiId}/`
  }));

  return {
    props: {
      allPokemons: pokemons,
      myPokemons
    }
  }
}

export default AddPokemonPage