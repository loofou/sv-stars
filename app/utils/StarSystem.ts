import { StarUtils } from './utils';

export class System {
  public position: [number, number, number] = [0, 0, 0];

  readonly name: string;
  readonly stars: Array<Star>;

  constructor(name: string, stars: Array<Star>, position: [number, number, number] = [0, 0, 0]) {
    this.name = name;
    this.stars = stars;
    this.position = position;
  }
}

export class Star {
  readonly name: string;
  readonly spectralClass: string;
  readonly temperature: number;
  readonly mass: number;
  readonly radius: number;

  constructor(name: string, spectralClass: string, temperature: number, mass: number, radius: number = 1) {
    this.name = name;
    this.spectralClass = spectralClass;
    this.temperature = temperature;
    this.mass = mass;
    this.radius = radius;
  }

  public get color() {
    return StarUtils.getColor(this.temperature);
  }
}
