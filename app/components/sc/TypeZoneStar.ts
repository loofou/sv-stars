import type { Node } from './types.js'
import { v4 as uuid } from 'uuid';

export class ZoneStar implements Node {
  readonly type: string = "zone_star";
  readonly id: string;
  public position: [number, number, number] = [0, 0, 0];

  readonly name: string;
  readonly color: string;
  readonly radius: number;

  constructor(name: string, color: string, radius: number = 1, position: [number, number, number] = [0, 0, 0]) {
    this.id = uuid();
    this.name = name;
    this.color = color;
    this.radius = radius;
    this.position = position;
  }
}
