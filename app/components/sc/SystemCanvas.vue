<script lang="ts" setup>
import { NoToneMapping } from 'three';
import { TresCanvas } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';
import { StellarObject, System } from '~/utils/types';
import { useSettings } from '~/composables/useSettings';
import { useCatalog } from '~/composables/useCatalog';

const emit = defineEmits<{
  click: [stellarObject: StellarObject];
}>();

const props = defineProps({
  system: {
    type: String,
    required: true,
  },
});

const systems = useCatalog();
const settings = useSettings();

const thisSystem = computed(() => {
  return systems.state.value.find((system: System) => system.name === props.system) ?? new System();
});
</script>

<template>
  <TresCanvas alpha :tone-mapping="NoToneMapping" clear-color="black" preset="flat">
    <TresPerspectiveCamera :args="[45, 1, 0.1, 5500]" :position="[30, 30, 30]" />
    <OrbitControls :make-default="true" :max-distance="2500" />

    <ScTimeUpdater />

    <Suspense>
      <ScSystemStellarObject
        v-for="stellarObject in thisSystem?.objects"
        :key="stellarObject.name"
        :stellar-object="stellarObject"
        :system="thisSystem"
        @click="emit('click', stellarObject)"
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
