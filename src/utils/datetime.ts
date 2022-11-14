import {
  hoursToMilliseconds,
  minutesToMilliseconds,
  secondsToMilliseconds,
  differenceInMilliseconds,
  formatDistanceToNowStrict,
  formatDuration,
  formatRFC3339,
  millisecondsToSeconds,
  addSeconds,
  isAfter,
} from "date-fns";

export const now = (): Date => new Date();

export const yesterday = () => {
  let date = new Date();
  date.setDate(date.getDate() - 1);
  return date;
};

export const formatNow = (): string => formatRFC3339(now());

export const formatDate = (date: Date): string => formatRFC3339(date);

export const formatDistanceToNow1 = (milliseconds: number): string => {
  const seconds = millisecondsToSeconds(milliseconds);
  if (seconds === 0) {
    return `${milliseconds} ms`;
  } else {
    return formatDuration({
      seconds: seconds,
    });
  }
};

export const formatDistanceToNow2 = (started: Date): string => {
  const diffMs = differenceInMilliseconds(now(), started);

  if (diffMs < 1000) {
    return `${diffMs} ms`;
  } else {
    return formatDistanceToNowStrict(started);
  }
};

export const calculateUpdatedAt = (created_at: Date): Date => {
  let updated_at = now();

  if (!isAfter(updated_at, created_at)) {
    updated_at = addSeconds(created_at, 1);
  }

  return updated_at;
};

export const delayInSecond = (seconds: number) =>
  delayInMillisecond(secondsToMilliseconds(seconds));

export const delayInMinute = (minutes: number) =>
  delayInMillisecond(minutesToMilliseconds(minutes));

export const delayInHour = (hours: number) =>
  delayInMillisecond(hoursToMilliseconds(hours));

export const delayInMillisecond = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
