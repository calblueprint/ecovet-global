import { TextareaHTMLAttributes, useEffect, useRef } from "react";
import { BigInput } from "./styles";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function AutoGrowBigInput(props: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };
  useEffect(resize, [props.value]);

  return <BigInput ref={ref} {...props} onInput={resize} />;
}
