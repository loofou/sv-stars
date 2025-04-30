import { StarUtils } from './utils';
import yaml from 'public/defaultstars.yaml?raw';

export function defaultSystems(): System[] {
  return StarUtils.convertFromYaml(yaml);
}
