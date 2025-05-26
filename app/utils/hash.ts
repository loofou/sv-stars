export class Hash {
  private static seed0 = 6528033931;
  private static seed1 = 2522041091;

  private hash: number = 0;

  public eatStr(value: string): Hash {
    let newHash = this.hash;

    //improve short strings
    value += 'statevector';
    const MAX_SAFE = Math.floor(Number.MAX_SAFE_INTEGER / Hash.seed1);
    for (let i = 0; i < value.length; ++i) {
      if (newHash > MAX_SAFE) {
        newHash = Math.floor(newHash / Hash.seed1);
      }

      newHash = newHash * Hash.seed0 + value.charCodeAt(i);
    }

    const hashObj = new Hash();
    hashObj.hash = newHash;
    return hashObj;
  }

  public eatNum(value: number): Hash {
    return this.eatStr(value.toString());
  }

  public eatArr(value: []): Hash {
    let h = new Hash();
    h.hash = this.hash;

    value.forEach((item: any) => {
      h = h.eatStr(item.toString());
    });

    return h;
  }

  public toNumber(min: number = 0, max: number = Number.MAX_SAFE_INTEGER): number {
    if (this.hash < 0) {
      this.hash = -this.hash;
    }
    const range = max - min;
    return min + (this.hash % range);
  }

  public toFloat(min: number = 0, max: number = 1): number {
    if (this.hash < 0) {
      this.hash = -this.hash;
    }
    const range = max - min;
    return min + ((this.hash % range) / Number.MAX_SAFE_INTEGER) * range;
  }

  public toString(length: number = 10): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    let h = new Hash();
    h.hash = this.hash;
    for (let i = 0; i < length; i++) {
      const index = h.toNumber(0, chars.length - 1);
      h = h.eatNum(index); // Update hash to ensure different characters
      result += chars.charAt(index);
    }
    return result;
  }

  public toHslColor(
    saturationMin: number = 50,
    saturationMax: number = 100,
    lightnessMin: number = 30,
    lightnessMax: number = 70,
  ): string {
    const hue = this.toNumber(0, 360);
    const saturation = this.toNumber(saturationMin, saturationMax);
    const lightness = this.toNumber(lightnessMin, lightnessMax);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
}
