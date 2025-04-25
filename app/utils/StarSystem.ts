import type { Node } from './types';
import { v4 as uuid } from 'uuid';

export class System implements Node {
  readonly type: string = 'zone_star';
  readonly id: string;
  public position: [number, number, number] = [0, 0, 0];

  readonly name: string;
  readonly stars: Array<Star>;

  constructor(name: string, stars: Array<Star>, position: [number, number, number] = [0, 0, 0]) {
    this.id = uuid();
    this.name = name;
    this.stars = stars;
    this.position = position;
  }
}

export class Star {
  readonly name: string;
  readonly color: string;
  readonly radius: number;

  constructor(name: string, color: string, radius: number = 1) {
    this.name = name;
    this.color = color;
    this.radius = radius;
  }
}
