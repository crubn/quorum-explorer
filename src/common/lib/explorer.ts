import dayjs from "dayjs";
import { QuorumBlock, QuorumTxn } from "../types/Explorer";
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

export const range = (start: number, stop: number, step = 1) => {
  stop = Math.max(0, stop);
  console.log('start, stop', start, stop)
  if (start >= 0 && stop >= 0) {
    return Array(Math.ceil((stop - start) / step))
      .fill(start)
      .map((x, y) => x + y * step);
  } else {
    return [];
  }
}

export function getSecsAgo(h: string) {
  const ago: Date = new Date(parseInt(h, 16)); // convert to decimal unix time
  const now: Date = new Date();
  const d = Math.abs(ago.getTime() - now.getTime() / 1000);
  return Math.trunc(d);
}

export function getTimeAgo(h: string) {
  const ago: Date = new Date(parseInt(h, 16) * 1000); // convert to decimal unix time
  const d = dayjs(ago).fromNow()
  return d;
}


export function abbreviateValidator(s: string) {
  const len = s.length;
  return s.slice(0, 10) + "..." + s.slice(len - 6);
}

//get the latest n elements in an array
export function updateBlockArray(
  arr: QuorumBlock[],
  elem: QuorumBlock,
  len: number
) {
  if (arr.length > 0 && arr[0]["number"] === elem["number"]) {
  } else {
    arr.unshift(elem);
  }
  return arr.slice(0, len);
}

//get the latest n elements in an array
export function updateTxnArray(
  arr: QuorumTxn[],
  elems: QuorumTxn[],
  len: number
) {
  elems.map((_) => arr.unshift(_));
  var set = new Set(arr);
  arr = Array.from(set);
  return arr.slice(0, len);
}
