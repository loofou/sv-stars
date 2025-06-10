import { Type } from 'class-transformer';
import { StarUtils } from './utils';
import 'reflect-metadata';
import { J2000, type Epoch } from './epoch';
import { Hash } from './hash';

export enum StellarTypes {
  STAR = 'Star',
  PLANET = 'Planet',
  MOON = 'Moon',
  ASTEROID = 'Asteroid',
  DWARF_PLANET = 'Dwarf Planet',
  HABITAT = 'Habitat',
  L_POINT = 'Lagrange Point',
  BARYCENTER = 'Barycenter',
}

export class StellarObject {
  readonly type: string;
  readonly name: string;
  readonly parent: string | null;
  readonly mass: number;

  @Type(() => Orbit)
  readonly orbit: Orbit;

  constructor();
  constructor(type: string, name: string, parent: string | null, orbit: Orbit, mass: number);
  constructor(type?: string, name?: string, parent?: string | null, orbit?: Orbit, mass?: number) {
    this.type = type ?? 'Unkown';
    this.name = name ?? '';
    this.parent = parent ?? null;
    this.orbit = orbit ?? new Orbit();
    this.mass = mass ?? 0;
  }

  public getParent(system: System): StellarObject | null {
    return system.objects.filter((o) => o.name == this.parent)[0] ?? null;
  }

  public get hasParent() {
    return this.parent != null && this.parent != '';
  }
}

export class Rotation {
  readonly axialTilt: number;
  readonly siderealPeriod: number;
  readonly initialRotation?: number;

  constructor();
  constructor(axialTilt: number, siderealPeriod: number, initialRotation?: number);
  constructor(axialTilt?: number, siderealPeriod?: number, initialRotation?: number) {
    this.axialTilt = axialTilt ?? 0;
    this.siderealPeriod = siderealPeriod ?? 0;
    this.initialRotation = initialRotation;
  }
}

export class Orbit {
  readonly eccentricity: number;
  readonly semiMajorAxis: number;
  readonly inclination: number;
  readonly longitudeOfAscendingNode: number;
  readonly argumentOfPeriapsis: number;
  readonly meanAnomaly: number;

  @Type(() => J2000.constructor)
  readonly epoch: Epoch | null;
  @Type(() => Rotation)
  readonly rotation: Rotation;

  constructor();
  constructor(
    eccentricity: number,
    semiMajorAxis: number,
    inclination: number,
    longitudeOfAscendingNode: number,
    argumentOfPeriapsis: number,
    meanAnomaly: number,
    epoch: Epoch,
    rotation: Rotation,
  );
  constructor(
    eccentricity?: number,
    semiMajorAxis?: number,
    inclination?: number,
    longitudeOfAscendingNode?: number,
    argumentOfPeriapsis?: number,
    meanAnomaly?: number,
    epoch?: Epoch,
    rotation?: Rotation,
  ) {
    this.eccentricity = eccentricity ?? 0;
    this.semiMajorAxis = semiMajorAxis ?? 1;
    this.inclination = inclination ?? 0;
    this.longitudeOfAscendingNode = longitudeOfAscendingNode ?? 0;
    this.argumentOfPeriapsis = argumentOfPeriapsis ?? 0;
    this.meanAnomaly = meanAnomaly ?? 0;
    this.epoch = epoch ?? null;
    this.rotation = rotation ?? new Rotation();
  }

  public get actualEpoch(): Epoch {
    return this.epoch ?? J2000;
  }
}

export class Ring {
  readonly innerRadius: number;
  readonly outerRadius: number;
  readonly color: string;

  constructor();
  constructor(innerRadius: number, outerRadius: number, color: string);
  constructor(innerRadius?: number, outerRadius?: number, color?: string) {
    this.innerRadius = innerRadius ?? 0;
    this.outerRadius = outerRadius ?? 0;
    this.color = color ?? '#ffffff';
  }
}

export class Star extends StellarObject {
  readonly spectralClass: string;
  readonly temperature: number;
  readonly radius: number;

  constructor();
  constructor(
    name: string,
    parent: string | null,
    orbit: Orbit,
    spectralClass: string,
    temperature: number,
    mass: number,
    radius: number,
  );
  constructor(
    name?: string,
    parent?: string | null,
    orbit?: Orbit,
    spectralClass?: string,
    temperature?: number,
    mass?: number,
    radius: number = 1,
  ) {
    super(StellarTypes.STAR, name ?? '', parent ?? null, orbit ?? new Orbit(), mass ?? 0);
    this.spectralClass = spectralClass ?? '';
    this.temperature = temperature ?? 0;
    this.radius = radius;
  }

  public get color() {
    return StarUtils.getColor(this.temperature);
  }
}

export class Satellite extends StellarObject {
  readonly radius: number;
  readonly color: string | null;
  @Type(() => Ring)
  readonly rings: Ring[] | null;

  constructor();
  constructor(
    type: string,
    name: string,
    parent: string | null,
    orbit: Orbit,
    mass: number,
    radius: number,
    color: string,
    rings: Ring[] | null,
  );
  constructor(
    type?: string,
    name?: string,
    parent?: string | null,
    orbit?: Orbit,
    mass?: number,
    radius?: number,
    color?: string,
    rings?: Ring[] | null,
  ) {
    super(type ?? StellarTypes.PLANET, name ?? '', parent ?? null, orbit ?? new Orbit(), mass ?? 0);
    this.radius = radius ?? 0;
    this.color = color ?? null;
    this.rings = rings ?? null;
  }

  public get uiColor() {
    if (this.color) {
      return this.color;
    }
    return new Hash().eatStr(this.name).toHslColor();
  }

  public get hasRings() {
    return this.rings != null && this.rings.length > 0;
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
          name: StellarTypes.STAR,
          value: Star,
        },
        {
          name: StellarTypes.PLANET,
          value: Satellite,
        },
        {
          name: StellarTypes.MOON,
          value: Satellite,
        },
        {
          name: StellarTypes.ASTEROID,
          value: Satellite,
        },
        {
          name: StellarTypes.DWARF_PLANET,
          value: Satellite,
        },
        {
          name: StellarTypes.HABITAT,
          value: Satellite,
        },
        {
          name: StellarTypes.L_POINT,
          value: Satellite,
        },
        {
          name: StellarTypes.BARYCENTER,
          value: Satellite,
        },
      ],
    },
  })
  objects: (StellarObject | Star | Satellite)[];

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

  public get planetNumber() {
    return this.objects.filter((s) => s.type == StellarTypes.PLANET).length;
  }

  public get stars(): Star[] {
    return this.objects.filter((s) => s.type == StellarTypes.STAR) as Star[];
  }
}
