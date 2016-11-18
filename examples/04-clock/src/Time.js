// Time
export const SECOND = 1000;

export const Time = {
  getTime: () => (new Date()).getTime(),
  every: interval => cb => setInterval(() => cb(Time.getTime()), interval),
  toLocaleString: time => (new Date(time)).toLocaleString()
};