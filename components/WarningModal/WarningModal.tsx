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

export default function WarningModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: (shouldDel: boolean) => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperComponent={WarningDialog}
    >
      <WarningTitle id="alert-dialog-title">
        {"Are you sure you want to delete this item?"}
      </WarningTitle>
      <WarningCaption id="alert-dialog-description">
        This action cannot be undone.
      </WarningCaption>
      <ButtonContainer>
        <CancelButton onClick={() => onClose(false)}>Cancel</CancelButton>
        <DeleteButton onClick={() => onClose(true)}>Delete</DeleteButton>
      </ButtonContainer>
    </Dialog>
  );
}
