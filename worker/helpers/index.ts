const range = (start: number, stop: number, step = 1) => {
  stop = Math.max(0, stop);
  console.log('start, stop', start, stop);
  if (start >= 0 && stop >= 0) {
    return Array(Math.ceil((stop - start) / step))
        .fill(start)
        .map((x, y) => x + y * step);
  } else {
    return [];
  }
};

module.exports = { range };
