import { Vector3 } from 'three';

export const G = 6.6743e-11; // gravitational constant, N⋅m2⋅kg−2
const toRadians = (deg: number) => (deg * Math.PI) / 180;

export function calcOrbitalPosition(orbit: Orbit): Vector3 {
  const a = orbit.semiMajorAxis;
  const e = orbit.eccentricity;
  const i = orbit.inclination;
  const lascNode = orbit.longitudeOfAscendingNode;
  const lPeri = orbit.argumentOfPeriapsis;

  const realMeanAnomaly = calcRealMeanAnomaly(orbit.meanAnomaly, lPeri);
  const eccentricAnomaly = calcEccentricAnomaly(e, realMeanAnomaly);
  const trueAnom = calcTrueAnomaly(e, eccentricAnomaly);

  const r = calcRadiusVector(a, e, trueAnom);

  const x =
    r *
    (Math.cos(toRadians(lascNode)) * Math.cos(toRadians(trueAnom + lPeri - lascNode)) -
      Math.sin(toRadians(lascNode)) * Math.sin(toRadians(trueAnom + lPeri - lascNode)) * Math.cos(toRadians(i)));
  const z =
    r *
    (Math.sin(toRadians(lascNode)) * Math.cos(toRadians(trueAnom + lPeri - lascNode)) +
      Math.cos(toRadians(lascNode)) * Math.sin(toRadians(trueAnom + lPeri - lascNode)) * Math.cos(toRadians(i)));
  const y = r * (Math.sin(toRadians(trueAnom + lPeri - lascNode)) * Math.sin(toRadians(i)));

  return new Vector3(x, y, z);
}

export function calcRealMeanAnomaly(meanAnomaly: number, argumentOfPeriapsis: number): number {
  let M = meanAnomaly - argumentOfPeriapsis;
  while (M < 0) {
    M += 360;
  }
  return M;
}

export function calcTrueAnomaly(eccentricity: number, eccentricAnomaly: number): number {
  const K = Math.PI / 180;
  const trueAnomArg = Math.sqrt((1 + eccentricity) / (1 - eccentricity)) * Math.tan(toRadians(eccentricAnomaly) / 2);
  if (trueAnomArg < 0) {
    return 2 * (Math.atan(trueAnomArg) / K + 180);
  }
  return 2 * (Math.atan(trueAnomArg) / K);
}

export function calcEccentricAnomaly(eccentricity: number, meanAnomaly: number, precision: number = 4): number {
  let M = meanAnomaly;
  const pi = Math.PI;
  const K = pi / 180.0;
  const maxIter = 30;
  let i = 0;
  const delta = 10 ** -precision;
  let E;
  let F;

  M /= 360.0;
  M = 2.0 * pi * (M - Math.floor(M));

  if (eccentricity < 0.8) E = meanAnomaly;
  else E = pi;

  F = E - eccentricity * Math.sin(M) - M;
  while (Math.abs(F) > delta && i < maxIter) {
    E -= F / (1.0 - eccentricity * Math.cos(E));
    F = E - eccentricity * Math.sin(E) - M;
    i += 1;
  }

  E /= K;
  return Math.round(E * 10) / 10;
}

export function calcRadiusVector(semiMajorAxis: number, eccentricity: number, trueAnomaly: number): number {
  return (semiMajorAxis * (1 - eccentricity ** 2)) / (1 + eccentricity * Math.cos(toRadians(trueAnomaly)));
}
