import * as React from "react";
import Dialog from "@mui/material/Dialog";
import {
  ButtonContainer,
  CancelButton,
  DeleteButton,
  PrimaryButton,
  WarningCaption,
  WarningDialog,
  WarningTitle,
} from "./styles";

export type WarningAction = "cancel" | "confirm" | "primary";

export default function WarningModal({
  open,
  onClose,
  title = "Are you sure you want to delete this item?",
  caption = "This action cannot be undone.",
  cancelLabel = "Cancel",
  noCancel = false,
  confirmLabel = "Delete",
  primaryLabel,
  loading = false,
}: {
  open: boolean;
  onClose: (action: WarningAction) => void;
  title?: string;
  caption?: string;
  cancelLabel?: string;
  noCancel?: boolean;
  confirmLabel?: string;
  primaryLabel?: string;
  loading?: boolean;
}) {
  return (
    <Dialog
      open={open}
      onClose={() => onClose("cancel")}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperComponent={WarningDialog}
    >
      <WarningTitle id="alert-dialog-title">{title}</WarningTitle>
      <WarningCaption id="alert-dialog-description">{caption}</WarningCaption>
      <ButtonContainer>
        {!noCancel && (
          <CancelButton onClick={() => onClose("cancel")}>
            {cancelLabel}
          </CancelButton>
        )}
        <DeleteButton onClick={() => onClose("confirm")}>
          {confirmLabel}
        </DeleteButton>
        {primaryLabel && (
          <PrimaryButton onClick={() => onClose("primary")}>
            {loading ? "Saving..." : primaryLabel}
          </PrimaryButton>
        )}
      </ButtonContainer>
    </Dialog>
  );
}
