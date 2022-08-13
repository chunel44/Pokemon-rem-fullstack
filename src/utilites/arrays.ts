import { SmallPokemon } from "@/interfaces";

export const filterByReference = (arr1: SmallPokemon[], arr2: SmallPokemon[]) => {
  let res = [];
  res = arr1.filter(el => {
    return !arr2.find(element => {
      return element.id === el.id;
    });
  });
  return res;
}