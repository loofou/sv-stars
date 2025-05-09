import { StarUtils } from './utils';
import sol from 'public/catalog/sol.yaml?raw';
import alphaCentauri from 'public/catalog/alpha-centauri.yaml?raw';
import others from 'public/catalog/others.yaml?raw';

export function getCatalog(): System[] {
  const yamlContents = [sol, alphaCentauri, others];
  return StarUtils.convertFromYaml(yamlContents.join('\n'));
}
