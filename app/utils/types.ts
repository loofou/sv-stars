import { Type } from 'class-transformer';
import { StarUtils } from './utils';
import 'reflect-metadata';
import { J2000, type Epoch } from './epoch';

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
  readonly epoch: Epoch;
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
    this.epoch = epoch ?? J2000;
    this.rotation = rotation ?? new Rotation();
  }
}

export class RenderData {
  readonly texture: string | null;

  constructor();
  constructor(texture: string);
  constructor(texture?: string) {
    this.texture = texture ?? null;
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
    super('Star', name ?? '', parent ?? null, orbit ?? new Orbit(), mass ?? 0);
    this.spectralClass = spectralClass ?? '';
    this.temperature = temperature ?? 0;
    this.radius = radius;
  }

  public get color() {
    return StarUtils.getColor(this.temperature);
  }
}

export class Planet extends StellarObject {
  readonly radius: number;
  readonly renderData: RenderData;

  constructor();
  constructor(name: string, parent: string | null, orbit: Orbit, mass: number, radius: number, renderData: RenderData);
  constructor(
    name?: string,
    parent?: string | null,
    orbit?: Orbit,
    mass?: number,
    radius?: number,
    renderData?: RenderData,
  ) {
    super('Planet', name ?? '', parent ?? null, orbit ?? new Orbit(), mass ?? 0);
    this.radius = radius ?? 0;
    this.renderData = renderData ?? new RenderData();
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
        {
          name: 'Planet',
          value: Planet,
        },
      ],
    },
  })
  objects: (StellarObject | Star | Planet)[];

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
    return this.objects.filter((s) => s.type == 'Planet').length;
  }

  public get stars(): Star[] {
    return this.objects.filter((s) => s.type == 'Star') as Star[];
  }
}
