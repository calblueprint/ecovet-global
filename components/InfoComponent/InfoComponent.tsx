"use client";

import Image from "next/image";
import { IconButton, Tooltip } from "@mui/material";
import infoIcon from "@/assets/images/info-icon.svg";

interface Props {
  infoText: string;
}

const InfoComponent = (props: Props) => {
  return (
    <Tooltip title={props.infoText}>
      <IconButton>
        <Image src={infoIcon} alt="Info Icon" />
      </IconButton>
    </Tooltip>
  );
};

export default InfoComponent;
