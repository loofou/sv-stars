export class StarTime {
  static J2000 = Date.UTC(2000, 0, 1, 12, 0, 0);

  public currentTime = ref(new Date(2400, 0, 1, 0, 0, 0));

  public getMillisFromJ2000(time: Date) {
    return time.getTime() - StarTime.J2000;
  }

  public getCenturiesFromJ2000(time: Date) {
    return this.getMillisFromJ2000(time) / (1000 * 60 * 60 * 24 * 365.25 * 100);
  }
}

const starTime = ref(new StarTime());

export function useStarTime() {
  return starTime;
}
