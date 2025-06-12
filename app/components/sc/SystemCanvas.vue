<script lang="ts" setup>
import { NoToneMapping, Vector3 } from 'three';
import { TresCanvas } from '@tresjs/core';
import { CameraControls } from '@tresjs/cientos';
import { StellarObject, System } from '~/utils/types';
import { useSettings } from '~/composables/useSettings';
import { useCatalog } from '~/composables/useCatalog';
import type { ShallowRef } from 'vue';

const emit = defineEmits<{
  click: [stellarObject: StellarObject];
}>();

const props = defineProps({
  system: {
    type: String,
    required: true,
  },
  selectedObject: {
    type: String,
    default: '',
  },
  distance01: {
    type: String,
    default: '',
  },
  distance02: {
    type: String,
    default: '',
  },
});

const systems = useCatalog();
const settings = useSettings();

const thisSystem = computed(() => {
  return systems.state.value.find((system: System) => system.name === props.system) ?? new System();
});

const controlsState = reactive({
  minDistance: 0,
  maxDistance: 10000,
});

const controlsRef = shallowRef();

const doubleClick = (object: ShallowRef) => {
  if (controlsRef.value) {
    const pos = new Vector3();
    object.value.getWorldPosition(pos);
    controlsRef.value.instance.setTarget(pos.x, pos.y, pos.z, true);
  }
};
</script>

<template>
  <TresCanvas alpha :tone-mapping="NoToneMapping" clear-color="black" preset="flat">
    <TresPerspectiveCamera :args="[45, 1, 0.001, 25000]" :position="[300, 300, 300]" />
    <CameraControls ref="controlsRef" name="Controls" v-bind="controlsState" make-default />

    <ScTimeUpdater />

    <Suspense>
      <ScSystemStellarObject
        v-for="stellarObject in thisSystem?.objects"
        :key="stellarObject.name"
        :stellar-object="stellarObject"
        :system="thisSystem"
        :selected="stellarObject.name == selectedObject"
        :distance01="stellarObject.name == distance01"
        :distance02="stellarObject.name == distance02"
        @click="emit('click', stellarObject)"
        @double-click="doubleClick"
      />
    </Suspense>

    <!--Environment Backdrop-->
    <Suspense>
      <Environment v-if="settings.showBgStars" :background="true" files="textures/HDR_galactic_plane_no_nebulae.hdr" />
    </Suspense>

    <!--Post-process effects-->
    <Suspense>
      <EffectComposer>
        <UnrealBloom v-if="settings.showBloom" :radius="0.05" :strength="0.5" :threshold="1" />
      </EffectComposer>
    </Suspense>
  </TresCanvas>
</template>
