export class Setting {
  showBloom: boolean = true;
  showGrid: boolean = true;
  showBgStars: boolean = true;
  showDwarfStars: boolean = true;
}

const settings = ref(new Setting());

export function useSettings(): Ref<Setting> {
  return settings;
}
