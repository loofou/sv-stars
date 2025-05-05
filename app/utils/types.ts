import { Type } from 'class-transformer';
import { StarUtils } from './utils';
import 'reflect-metadata';

export class StellarObject {
  readonly type: string;
  readonly name: string;
  readonly parent: StellarObject | null;
  readonly orbit: Orbit;

  constructor();
  constructor(type: string, name: string, parent: StellarObject | null, orbit: Orbit);
  constructor(type?: string, name?: string, parent?: StellarObject | null, orbit?: Orbit) {
    this.type = type ?? 'Unkown';
    this.name = name ?? '';
    this.parent = parent ?? null;
    this.orbit = orbit ?? new Orbit();
  }
}

export class Orbit {
  readonly eccentricity: number;
  readonly semiMajorAxis: number;
  readonly inclination: number;

  constructor();
  constructor(eccentricity: number, semiMajorAxis: number, inclination: number);
  constructor(eccentricity?: number, semiMajorAxis?: number, inclination?: number) {
    this.eccentricity = eccentricity ?? 0;
    this.semiMajorAxis = semiMajorAxis ?? 1;
    this.inclination = inclination ?? 0;
  }
}

export class Star extends StellarObject {
  readonly spectralClass: string;
  readonly temperature: number;
  readonly mass: number;
  readonly radius: number;

  constructor();
  constructor(
    name: string,
    parent: StellarObject | null,
    orbit: Orbit,
    spectralClass: string,
    temperature: number,
    mass: number,
    radius: number,
  );
  constructor(
    name?: string,
    parent?: StellarObject | null,
    orbit?: Orbit,
    spectralClass?: string,
    temperature?: number,
    mass?: number,
    radius: number = 1,
  ) {
    super('Star', name ?? '', parent ?? null, orbit ?? new Orbit());
    this.spectralClass = spectralClass ?? '';
    this.temperature = temperature ?? 0;
    this.mass = mass ?? 0;
    this.radius = radius;
  }

  public get color() {
    return StarUtils.getColor(this.temperature);
  }
}

export class System {
  name: string;
  position: [number, number, number] = [0, 0, 0];

  @Type(() => StellarObject, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'type',
      subTypes: [
        {
          name: 'Star',
          value: Star,
        },
      ],
    },
  })
  objects: (StellarObject | Star)[];

  constructor();
  constructor(name: string, objects: Array<StellarObject>, position: [number, number, number]);
  constructor(name?: string, objects?: Array<StellarObject>, position: [number, number, number] = [0, 0, 0]) {
    this.name = name ?? '';
    this.objects = objects ?? [];
    this.position = position;
  }

  public get isDwarfStar() {
    let result = true;
    this.objects.forEach((s) => {
      if (s instanceof Star) {
        const star = s as Star;
        if (
          !(
            star.spectralClass.startsWith('L') ||
            star.spectralClass.startsWith('M') ||
            star.spectralClass.startsWith('T') ||
            star.spectralClass.startsWith('Y') ||
            star.spectralClass.startsWith('D')
          )
        ) {
          result = false;
        }
      } else {
        result = false;
      }
    });

    return result;
  }

  public get stars(): Star[] {
    return this.objects.filter((s) => s.type == 'Star') as Star[];
  }
}
