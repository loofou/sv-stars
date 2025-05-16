import { epochToDate, startEpoch, Time } from '~/utils/epoch';

const starTime = ref({
  currentTime: epochToDate(startEpoch()),
  stopped: false,
  speed: Time.MINUTE,
});

export function useStarTime() {
  return starTime;
}
