<script lang="ts" setup>
import {
  astronomicalUnitsToKilometers,
  orbitalPeriod,
  gravityToG,
  surfaceGravity,
  solarMassesToKg,
  earthMassesToKg,
  earthRadiusToMeters,
  orbitalVelocity,
  mpsTokps,
} from '~/utils/physics';
import { humanTimeUnits } from '~/utils/epoch';
import { System } from '~/utils/types';

const catalog = useCatalog();

const props = defineProps({
  isObjectSelected: {
    type: Boolean,
    required: true,
  },
  system: {
    type: String,
    required: true,
  },
  object: {
    type: String,
    required: true,
  },
});

function createItems(object: StellarObject, system: System) {
  const children: any[] = [
    {
      label: `Parent: ${object.hasParent ? object.parent : 'None'}`,
      value: `${object.name}-parent`,
      icon: 'carbon:parent-child',
    },
    {
      label: `Type: ${object.type}`,
      value: `${object.name}-type`,
      icon: 'lucide:type',
    },
    {
      label: `Mass: ${object.mass} EM`,
      value: `${object.name}-mass`,
      icon: 'gravity-ui:weight-hanging',
    },
  ];

  if (object instanceof Satellite) {
    children.push({
      label: `Radius: ${object.radius} ER`,
      value: `${object.name}-radius`,
      icon: 'oui:radius',
    });
  }

  if (object.hasParent) {
    const parent = object.getParent(system);
    const distance =
      parent?.type == StellarTypes.STAR
        ? `${object.orbit.semiMajorAxis} AU`
        : `${astronomicalUnitsToKilometers(object.orbit.semiMajorAxis)} km`;

    children.push({
      label: `Distance: ${distance}`,
      value: `${object.name}-distance`,
      icon: 'mdi:orbit',
    });

    if (object instanceof Satellite) {
      const parentMass =
        parent?.type == StellarTypes.STAR ? solarMassesToKg(parent.mass) : earthMassesToKg(parent?.mass ?? 0);

      const period = humanTimeUnits(orbitalPeriod(astronomicalUnitsToMeters(object.orbit.semiMajorAxis), parentMass));
      const velocity = mpsTokps(orbitalVelocity(astronomicalUnitsToMeters(object.orbit.semiMajorAxis), parentMass));
      const gravity = gravityToG(surfaceGravity(earthMassesToKg(object.mass), earthRadiusToMeters(object.radius)));

      children.push(
        {
          label: `O. Period: ${period[0].toFixed(2)} ${period[1]}`,
          value: `${object.name}-orbital-period`,
          icon: 'material-symbols:nest-clock-farsight-analog',
        },
        {
          label: `O. Velocity: ${velocity.toFixed(2)} km/s`,
          value: `${object.name}-orbital-velocity`,
          icon: 'simple-icons:velocity',
        },
        {
          label: `S. Gravity: ${gravity.toFixed(2)} G`,
          value: `${object.name}-gravity`,
          icon: 'lucide:weight',
        },
      );
    }
  }

  const expanded = ['system'];

  return {
    tree: [
      {
        label: object.name,
        value: 'system',
        icon: 'game-icons:moon-orbit',
        defaultExpanded: true,
        children: children,
      },
    ],
    expanded: expanded,
  };
}

const systemDetails = catalog.state.value.find((s: System) => s.name === props.system) ?? new System();
const stellarObject = systemDetails.objects.find((s: StellarObject) => s.name === props.object) ?? new StellarObject();

const allItems = createItems(stellarObject, systemDetails);
const items = ref(allItems.tree);
const expanded = ref(allItems.expanded);

watch(props, () => {
  const systemDetails = catalog.state.value.find((s: System) => s.name === props.system) ?? new System();
  const stellarObject =
    systemDetails.objects.find((s: StellarObject) => s.name === props.object) ?? new StellarObject();

  const allItems = createItems(stellarObject, systemDetails);
  items.value = allItems.tree;
  expanded.value = allItems.expanded;
});
</script>

<template>
  <div>
    <p v-if="!isObjectSelected">Click on a stellar object to select it...</p>
    <UTree v-if="isObjectSelected" v-model:expanded="expanded" :items />
  </div>
</template>
