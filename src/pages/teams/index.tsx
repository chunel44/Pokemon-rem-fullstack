/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image';
import Link from 'next/link';
import { getSession } from 'next-auth/react'
import React, { useRef, useState } from 'react'
import { MdAdd } from 'react-icons/md';
import Select, { SingleValue } from 'react-select';
import { toast } from 'react-toastify';

import { Layout } from '@/components/layout/Layout'
import { Modal } from '@/components/ui/Modal';

import { localApi, pokeApi } from '@/api';
import { ItemListResponse, SmallItem } from '@/interfaces';
import { IPokemon, ITeam } from '@/models'
import { capitalize } from '@/utilites';

interface Props {
  teams: ITeam[];
  items: SmallItem[];
}

const TeamsPage: NextPage<Props> = ({ teams, items }) => {
  const [openModalTeams, setOpenModalTeams] = useState(false);
  const [openModalItems, setOpenModalItems] = useState(false);
  const [allTeams, setAllTeams] = useState<ITeam[]>(teams);
  const [selectedPokemon, setSelectedPokemon] = useState<IPokemon>();
  const [selectedItem, setSelectedItem] = useState<SmallItem>();
  const nameRef = useRef<HTMLInputElement>(null);

  const options = items.map(item => ({
    value: item,
    label: capitalize(item.name).replace('-', ' '),
  }));

  const onSubmitTeams = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    const nameTeam = nameRef.current?.value;
    if (!nameTeam) {
      toast.info('Agrega un nombre de Equipo', {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
      return;
    } else if (nameTeam.length <= 2) {
      toast.info('El nombre del equipo tiene que tener 3 caracteres', {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
      return
    }

    try {
      const { data, status } = await localApi.post<ITeam>('http://localhost:3000/api/team', {
        data: {
          nameTeam: capitalize(nameTeam),
        }
      });
      if (status === 200) {
        toast.success('Equipo Agregado', {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });

        setAllTeams([...allTeams, data]);
        setOpenModalTeams(false);
      }
    } catch (error) {
      toast.error('Error al agregar al equipo', {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    }

  }
  const onShowModalTeams = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setOpenModalTeams(false)
  }

  const onSubmitItems = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    if (selectedItem && selectedPokemon) {

      try {
        const { data, status } = await localApi.post<IPokemon>('http://localhost:3000/api/item', {
          data: {
            pokemonId: selectedPokemon._id.toString(),
            item: selectedItem.name
          }
        })

        if (status === 200) {
          toast.success('Item agregado correctamente', {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
          });
          selectedPokemon.item = data.item;
          setOpenModalItems(false);
        }
      } catch (error) {
        toast.error('Error al agregar el item', {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
      }
    }
    setOpenModalItems(false);
    return;
  }
  const onShowModalItems = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setOpenModalItems(false)
  }

  const handleClickPokemon = (ev: React.MouseEvent<HTMLDivElement>, poke: IPokemon) => {
    ev.preventDefault();
    setSelectedPokemon(poke);
    setSelectedItem(undefined);
    setOpenModalItems(true);
  }

  const onChangeSelected = (inputValue: SingleValue<{
    value: SmallItem;
    label: string;
  }>) => {
    const selected = inputValue?.value as SmallItem;
    setSelectedItem(selected);
  }

  return (
    <Layout title='Equipos'>
      <div className="layout min-h-screen py-12">
        <div className="flex items-center justify-center flex-col">
          <span className='font-bold text-xl'>Equipos</span>
          {
            allTeams.map(team => (
              <div key={team._id} className="p-8 bg-gray-200 shadow-lg rounded-lg mt-6 flex flex-col max-w-full w-full">
                <h2 className='text-base text-center'>{team.name}</h2>
                <div className="flex-row flex justify-evenly">
                  {
                    team.pokemons.map(poke => (
                      <div onClick={(ev) => handleClickPokemon(ev, poke)} key={poke._id} className='flex items-center justify-center flex-col cursor-pointer'>
                        {poke.item && <Image src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${poke.item}.png`} alt={poke.item} width={25} height={25} />}
                        <Image src={poke.imgUrl} alt={poke.name} width={75} height={75} />
                        <p>{poke.name}</p>
                      </div>
                    ))
                  }

                </div>
                <div className="flex items-end justify-end">
                  <Link href={`/team/${team.name}`}>
                    <a className='p-4 bg-blue-600 text-white font-bold shadow-lg rounded-md hover:text-gray-100'>{team.pokemons.length > 0 ? 'Editar' : 'Agregar'}</a>
                  </Link>
                </div>
              </div>
            ))
          }
        </div>
      </div>
      <Modal title='Agregar item' showModal={openModalItems} onSubmit={onSubmitItems} onShowModal={onShowModalItems}>
        <div className='flex items-center justify-center w-full flex-col'>
          <Select
            className='w-full mb-4'
            options={options}
            isSearchable={false}
            onChange={onChangeSelected}
            isDisabled={selectedPokemon && selectedPokemon.item ? true : false}
          />
          {
            !!selectedItem && <Image src={selectedItem.img} alt={selectedItem.name} width={25} height={25} />
          }
        </div>
      </Modal>
      <Modal title='Agregar Equipo' showModal={openModalTeams} onSubmit={onSubmitTeams} onShowModal={onShowModalTeams}>
        <div className='flex items-center justify-center'>
          <input type="text" name="equipo" placeholder='Nombre del Equipo' ref={nameRef} />
        </div>
      </Modal>
      <button onClick={() => setOpenModalTeams(true)} title="Agregar Equipo" className="fixed z-90 bottom-10 left-8 bg-blue-600 w-16 h-16 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-blue-700">
        <MdAdd />
      </button>
    </Layout>
  )
}



export const getServerSideProps: GetServerSideProps = async ({ req }) => {

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

  const { data } = await localApi.get<ITeam[]>('http://localhost:3000/api/team', {
    headers: { Cookie: headers.cookie! },
  });

  const res = await pokeApi.get<ItemListResponse>('/item');

  const items: SmallItem[] = res.data.results.map((item, i) => ({
    ...item,
    id: i + 1,
    img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.name}.png`
  }))

  return {
    props: {
      teams: data,
      items
    }
  }
}

export default TeamsPage