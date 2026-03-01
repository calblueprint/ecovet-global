import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import * as styles from "./styles";

export default function WarningModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: (shouldDel: boolean) => void;
}) {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={styles.dialogTitle}>
          {"Are you sure you want to delete this item?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={styles.dialogCaption}
          >
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* shouldDel is false when cancel is pressed, true when delete is pressed */}
          <Button sx={styles.cancelButton} onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button sx={styles.deleteButton} onClick={() => onClose(true)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
