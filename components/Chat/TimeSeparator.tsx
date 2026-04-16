import { TimeSeparatorBold, TimeSeparatorContainer, TimeSeparatorNormal } from "./styles";

export function TimeSeparator({ date }: { date: Date })  {
  return (
  <TimeSeparatorContainer>
      <TimeSeparatorBold>{date.toLocaleDateString('en-US', { weekday: 'long' })}</TimeSeparatorBold>
      <TimeSeparatorNormal>{date.toLocaleTimeString('en-US', { timeStyle: 'short' })}</TimeSeparatorNormal>
  </TimeSeparatorContainer>
  )

}
