<script lang="ts" setup>
import { calcOrbitInTime, orbitalPeriod } from '~/utils/physics';
import { BufferGeometry, CatmullRomCurve3, Vector3 } from 'three';

const props = defineProps({
  stellarObject: {
    type: StellarObject,
    required: true,
  },
  system: {
    type: System,
    required: true,
  },
});

const points: Vector3[] = [];
const resolution = 32;
const smoothFactor = 4;
const baseDate = epochToDate(startEpoch()).valueOf();

const parent = props.stellarObject.getParent(props.system);
if (!parent) {
  console.error('Parent not found for', props.stellarObject.name, props.stellarObject.parent);
} else {
  let parentMass = 0;

  if (parent && parent.type == 'Star') {
    parentMass = solarMassesToKg(parent.mass);
  } else if (parent && parent.type == 'Planet') {
    parentMass = earthMassesToKg(parent.mass);
  }
  const period = orbitalPeriod(astronomicalUnitsToMeters(props.stellarObject.orbit.semiMajorAxis), parentMass) * 1000; // convert to milliseconds
  const partOfOrbitalPeriod = period / resolution;

  console.log(props.stellarObject.name, period, partOfOrbitalPeriod);

  for (let i = 0; i <= resolution; ++i) {
    const point = calcOrbitInTime(props.stellarObject.orbit, parentMass, new Date(baseDate + i * partOfOrbitalPeriod));
    points.push(point);
  }
}

const ellipseSpline = new CatmullRomCurve3(points, true, 'catmullrom', 0.5);
const smoothedPoints = ellipseSpline.getPoints(points.length * smoothFactor);
</script>

<template>
  <Line2 :name="stellarObject.name + '-orbit'" :points="smoothedPoints" :color="(stellarObject as Planet).uiColor" />
</template>
