/**
 * adjusted from https://github.com/gordonhart/atlasof.space/
 * @license APACHE-2.0
 */

import { Vector3 } from 'three';
import { StarUtils, AUMultiplier } from './utils';
import { epochToDate } from './epoch';

export const G = 6.6743e-11; // gravitational constant, N⋅m2⋅kg−2

export function degToRad(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function radToDeg(radians: number) {
  return (radians * 180) / Math.PI;
}

export function magnitude(v: Array<number>) {
  return Math.sqrt(v.reduce((acc, x) => acc + x ** 2, 0));
}

// kepler's third law
export function orbitalPeriod(semiMajorAxis: number, centralMass: number) {
  return Math.PI * 2 * Math.sqrt(semiMajorAxis ** 3 / (G * centralMass));
}

export function meanDistance(semiMajorAxis: number, eccentricity: number) {
  return semiMajorAxis + (1 + eccentricity ** 2 / 2);
}

export function semiMinorAxis(semiMajorAxis: number, eccentricity: number) {
  return semiMajorAxis * Math.sqrt(1 - eccentricity ** 2);
}

export function semiLatusRectum(semiMajorAxis: number, eccentricity: number) {
  return semiMajorAxis * (1 - eccentricity ** 2);
}

export function surfaceGravity(mass: number, radius: number) {
  return (G * mass) / radius ** 2; // m/s^2
}

export function gravityToG(gravity: number) {
  return gravity / 9.81; // convert to g
}

export function estimateAsteroidMass(radius: number) {
  return 2500 * (4 / 3) * Math.PI * radius ** 3; // best-effort guess using 2500kg/m3 density and a spherical shape
}

export function estimateCometMass(radius: number) {
  const density = 500; // 500 kg/m3 for a typical comet
  return density * (4 / 3) * Math.PI * radius ** 3; // best-effort guess assuming spherical shape
}

export function hillRadius(semiMajorAxis: number, eccentricity: number, massParent: number, massBody: number) {
  return semiMajorAxis * (1 - eccentricity) * Math.cbrt(massBody / (3 * (massParent + massBody)));
}

export function orbitalEllipseAtTheta(elements: Orbit, theta: number): Vector3 {
  const { semiMajorAxis: a, eccentricity: e, inclination, argumentOfPeriapsis, longitudeOfAscendingNode } = elements;

  const i = degToRad(inclination);
  const omega = degToRad(argumentOfPeriapsis);
  const Omega = degToRad(longitudeOfAscendingNode);

  // Parametric form in orbital plane before rotation:
  // Periapsis initially along x'-axis
  const x_o = a * (Math.cos(theta) - e);
  const y_o = semiMinorAxis(a, e) * Math.sin(theta);
  const z_o = 0;

  // 1) Rotate by ω around z-axis (argument of periapsis):
  const X = x_o * Math.cos(omega) - y_o * Math.sin(omega);
  let Y = x_o * Math.sin(omega) + y_o * Math.cos(omega);
  let Z = z_o; // still zero

  // 2) Rotate by i around x-axis (inclination):
  // Rotation around x:
  // Y' = Y*cos(i) - Z*sin(i)
  // Z' = Y*sin(i) + Z*cos(i)
  // Since Z=0 initially:
  Y = Y * Math.cos(i);
  Z = Y * Math.sin(i);

  // 3) Rotate by Ω around z-axis (longitude of ascending node):
  // X'' = X*cos(Ω) - Y*sin(Ω)
  // Y'' = X*sin(Ω) + Y*cos(Ω)
  const X_f = X * Math.cos(Omega) - Y * Math.sin(Omega);
  const Y_f = X * Math.sin(Omega) + Y * Math.cos(Omega);
  const Z_f = Z; // Not used for drawing top-down, but kept for completeness
  return new Vector3(X_f, Z_f, Y_f); // Note: Y and Z are swapped for top-down view
}

export function trueAnomalyFromMean(meanAnomaly: number, eccentricity: number, tolerance = 1e-8, maxIterations = 100) {
  const meanAnomalyNormalized = meanAnomaly % (2 * Math.PI);

  // Newton-Raphson iteration to solve Kepler's equation
  let eccentricAnomaly = meanAnomalyNormalized;
  for (let i = 0; i < maxIterations; i++) {
    const delta =
      (eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomalyNormalized) /
      (1 - eccentricity * Math.cos(eccentricAnomaly));
    eccentricAnomaly = eccentricAnomaly - delta;
    if (Math.abs(delta) < tolerance) {
      break;
    }
  }

  // Calculate true anomaly from eccentric anomaly
  const numerator = Math.sqrt(1 - eccentricity ** 2) * Math.sin(eccentricAnomaly);
  const trueAnomaly = Math.atan2(numerator, Math.cos(eccentricAnomaly) - eccentricity);

  // Ensure true anomaly is in the correct quadrant
  return trueAnomaly < 0 ? trueAnomaly + 2 * Math.PI : trueAnomaly;
}

export function keplerianToCartesian(
  { eccentricity: e, semiMajorAxis: a, inclination, longitudeOfAscendingNode, argumentOfPeriapsis, meanAnomaly }: Orbit,
  mu: number, // Gravitational parameter (m^3/s^2)
): { position: Vector3; velocity: Vector3 } {
  const i = degToRad(inclination);
  const Omega = degToRad(longitudeOfAscendingNode);
  const omega = degToRad(argumentOfPeriapsis);
  const nu = trueAnomalyFromMean(degToRad(meanAnomaly), e);

  // Orbital plane position (r) and velocity (v)
  const p = semiLatusRectum(a, e);
  const rOrbital = p / (1 + e * Math.cos(nu));
  const positionOrbital = [rOrbital * Math.cos(nu), rOrbital * Math.sin(nu)];
  const velocityOrbital = [-Math.sqrt(mu / p) * Math.sin(nu), Math.sqrt(mu / p) * (e + Math.cos(nu))];

  // Rotations
  const [cosO, sinO] = [Math.cos(Omega), Math.sin(Omega)];
  const [cosI, sinI] = [Math.cos(i), Math.sin(i)];
  const [cosW, sinW] = [Math.cos(omega), Math.sin(omega)];

  // Combined rotation matrix to transform from orbital plane to inertial frame
  const rotationMatrix: [[number, number, number], [number, number, number], [number, number, number]] = [
    [cosO * cosW - sinO * sinW * cosI, -cosO * sinW - sinO * cosW * cosI, sinO * sinI],
    [sinW * sinI, cosW * sinI, cosI],
    [sinO * cosW + cosO * sinW * cosI, -sinO * sinW + cosO * cosW * cosI, -cosO * sinI],
  ];

  // Transform position and velocity to inertial frame
  const positionInertial: Vector3 = StarUtils.convertToVec3(
    rotationMatrix.map((row) => (positionOrbital?.[0] ?? 0) * row[0] + (positionOrbital?.[1] ?? 0) * row[1]) as [
      number,
      number,
      number,
    ],
  );
  const velocityInertial: Vector3 = StarUtils.convertToVec3(
    rotationMatrix.map((row) => (velocityOrbital?.[0] ?? 0) * row[0] + (velocityOrbital?.[1] ?? 0) * row[1]) as [
      number,
      number,
      number,
    ],
  );

  return { position: positionInertial, velocity: velocityInertial };
}

function normalizeRotation(rotation: number) {
  return ((rotation % 360) + 360) % 360; // Normalize to [0, 360)
}

export function adjustForTime(orbit: Orbit, parentMass: number, time: Date): Orbit {
  const { semiMajorAxis, rotation } = orbit;
  const a = astronomicalUnitsToMeters(semiMajorAxis); // convert semi-major axis to meters
  const dt = (time.valueOf() - epochToDate(orbit.epoch).valueOf()) / 1000; // dt in seconds
  const n = Math.sqrt((G * parentMass) / (a * a * a)); // calculate mean motion
  const newM = orbit.meanAnomaly + radToDeg(n * dt); // update mean anomaly
  const rotationInEpoch =
    rotation != null && rotation.initialRotation != null
      ? { ...rotation, initialRotation: normalizeRotation(rotation.initialRotation + dt / rotation.siderealPeriod) }
      : rotation;
  return { ...orbit, meanAnomaly: normalizeRotation(newM), rotation: rotationInEpoch };
}

export function calcOrbitInTime(orbit: Orbit, parentMass: number, currentTime: Date): Vector3 {
  let position = new Vector3();

  const adjustedOrbit = adjustForTime(orbit, parentMass, currentTime);
  const { position: pos } = keplerianToCartesian(adjustedOrbit, parentMass * G);
  position = pos;
  position.multiplyScalar(AUMultiplier);

  return position;
}

export function solarMassesToKg(solarMasses: number) {
  return solarMasses * 1.9885e30; // kg
}

export function earthMassesToKg(earthMasses: number) {
  return earthMasses * 5.972168e24; // kg
}

export function astronomicalUnitsToMeters(au: number) {
  return au * 149597870700; // meters
}
