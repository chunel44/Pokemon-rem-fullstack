
import bcrypt from 'bcryptjs';

interface SeedData {
  users: SeedUser[],
  teams: SeedTeams[],
  pokemons: SeedPokemon[],
  items: SeedItem[],
}

interface SeedUser {
  name: string,
  email: string,
  password: string
  imgUrl?: string;
}

interface SeedTeams {
  name: string;
  userId: string;
  pokemons: SeedPokemon[];
}

interface SeedPokemon {
  apiId: string;
  name: string;
  imgUrl: string;
  item?: string;
  team: string; //62eef0f55d25af222243796e
}

interface SeedItem {
  apiId: string;
  name: string;
  img: string;
}

export const seedData: SeedData = {
  users: [
    {
      name: 'Ash',
      email: 'ash@google.com',
      password: bcrypt.hashSync('123456'),
      imgUrl: 'https://nosomosnonos.com/wp-content/uploads/2022/04/large.webp',
    },
    {
      name: 'Jesee',
      email: 'jesse@google.com',
      password: bcrypt.hashSync('123456'),
      imgUrl: 'https://i.pinimg.com/280x280_RS/8d/58/df/8d58df3aa578b0b3714f23376ebfc203.jpg',
    },
    {
      name: 'James',
      email: 'james@google.com',
      password: bcrypt.hashSync('123456'),
      imgUrl: 'https://media.redadn.es/imagenes/manga-anime_301970.jpg',
    },
  ],
  teams: [
    {
      name: 'Kioto',
      userId: '62eef0f45d25af2222437968',
      pokemons: [],
    },
    {
      name: 'Caramelo',
      userId: '62eef0f45d25af2222437968',
      pokemons: [],
    },
  ],
  pokemons: [
    {
      name: 'Bulbasaur',
      apiId: '1',
      imgUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg',
      team: '62eef4cc5d25af22224379ab',
      item: ''
    },
    {
      name: 'Ivysaur',
      apiId: '2',
      imgUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/2.svg',
      team: '62eef4cc5d25af22224379ab',
      item: ''
    },
  ],
  items: [
    {
      apiId: '1',
      name: 'master-ball',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png'
    },
    {
      apiId: '2',
      name: 'ultra-ball',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png'
    },
  ]
}