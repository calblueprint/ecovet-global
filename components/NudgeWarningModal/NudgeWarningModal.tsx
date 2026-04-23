import * as React from "react";
import Dialog from "@mui/material/Dialog";
import {
  ButtonContainer,
  CancelButton,
  DeleteButton,
  WarningCaption,
  WarningDialog,
  WarningTitle,
} from "./styles";

export default function NudgeWarningModal({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperComponent={WarningDialog}
    >
      <WarningTitle id="alert-dialog-title">{"Send Nudge Email?"}</WarningTitle>

      <WarningCaption id="alert-dialog-description">
        {"Are you sure you want to send this email?"}
      </WarningCaption>

      <ButtonContainer>
        <CancelButton onClick={onCancel}>Cancel</CancelButton>
        <DeleteButton onClick={onConfirm}>Confirm</DeleteButton>
      </ButtonContainer>
    </Dialog>
  );
}
