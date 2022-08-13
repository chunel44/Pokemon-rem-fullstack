import { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image';
import Link from 'next/link';
import { getSession } from 'next-auth/react'
import React, { useRef, useState } from 'react'
import { MdAdd } from 'react-icons/md';
import { toast } from 'react-toastify';

import { Layout } from '@/components/layout/Layout'
import { Modal } from '@/components/ui/Modal';

import { localApi } from '@/api';
import { ITeam } from '@/models'
import { capitalize } from '@/utilites';

interface Props {
  teams: ITeam[];
}

const TeamsPage: NextPage<Props> = ({ teams }) => {
  const [openModal, setOpenModal] = useState(false)
  const [allTeams, setAllTeams] = useState<ITeam[]>(teams);
  const nameRef = useRef<HTMLInputElement>(null)
  console.log(allTeams[2].pokemons.length);
  const onSubmit = async (ev: React.MouseEvent<HTMLButtonElement>) => {
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
        setOpenModal(false);
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
  const onShowModal = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setOpenModal(false)
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
                      <div key={poke._id} className='flex items-center justify-center flex-col'>
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
      <Modal title='Agregar Equipo' showModal={openModal} onSubmit={onSubmit} onShowModal={onShowModal}>
        <div className='flex items-center justify-center'>
          <input type="text" name="equipo" placeholder='Nombre del Equipo' ref={nameRef} />
        </div>
      </Modal>
      <button onClick={() => setOpenModal(true)} title="Agregar Equipo" className="fixed z-90 bottom-10 left-8 bg-blue-600 w-16 h-16 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-blue-700">
        <MdAdd />
      </button>
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

  const { data } = await localApi.get<ITeam[]>('http://localhost:3000/api/team', {
    headers: { Cookie: headers.cookie! },
  });



  return {
    props: {
      teams: data
    }
  }
}

export default TeamsPage