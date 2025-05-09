import { getCatalog } from '~/utils/catalog';

const catalogState = shallowRef(getCatalog());

export const useCatalog = () => {
  return { state: catalogState };
};
