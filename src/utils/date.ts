import dayjs from 'dayjs'
import isYesterday from 'dayjs/plugin/isYesterday'
import isToday from 'dayjs/plugin/isToday'

export function prepareService() {
  dayjs.extend(isYesterday)
  dayjs.extend(isToday)
}