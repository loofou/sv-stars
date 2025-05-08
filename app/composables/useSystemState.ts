import { defaultSystems } from '~/utils/DefaultStars';

const systemState = shallowRef(defaultSystems());

export const useSystemState = () => {
  return { state: systemState };
};
