import {
  TimeSeparatorBold,
  TimeSeparatorContainer,
  TimeSeparatorNormal,
} from "./styles";

export function getMessageDateLabel(date: Date) {
  const day = date.toLocaleDateString("en-US", { weekday: "long" });
  const time = date.toLocaleTimeString("en-US", { timeStyle: "short" })

  if (date.toDateString() === new Date().toDateString()) {
    return { day: 'Today', time }
  } else {
    return { day, time }
  }
}

export function TimeSeparator({ date }: { date: Date }) {
  const { day, time } = getMessageDateLabel(date)

  return (
    <TimeSeparatorContainer>
      <TimeSeparatorBold>
        {day}
      </TimeSeparatorBold>
      <TimeSeparatorNormal>
        {time}
      </TimeSeparatorNormal>
    </TimeSeparatorContainer>
  );
}
