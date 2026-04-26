"use client";

import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { RxExit } from "react-icons/rx";
import { useRouter } from "next/navigation";
import {
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";
import { IconSvgs, IconType } from "@/lib/icons";
import COLORS from "@/styles/colors";
import { B2 } from "@/styles/text";
import {
  DropdownButton,
  MainDiv,
  MenuOptionsDiv,
  ProfileContainer,
  StyledMenuItem,
  StyledMenuList,
  StyledMenuPaper,
} from "./style";

type IconProps = {
  name: IconType;
  color?: string;
};

export function Icon({ name, color = "currentColor" }: IconProps) {
  return (
    <span
      style={{
        color,
        display: "inline-flex",
      }}
    >
      {IconSvgs[name]}
    </span>
  );
}

const ProfileBar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const options = [
    <MenuOptionsDiv>
      <RxExit color={COLORS.white} />
      <B2>Edit Profile</B2>
    </MenuOptionsDiv>,
    <MenuOptionsDiv>
      <RxExit color={COLORS.white} />
      <B2>Reset Password</B2>
    </MenuOptionsDiv>,
    <MenuOptionsDiv>
      <RxExit color={COLORS.mediumElectricBlue} />
      <B2>Logout</B2>
    </MenuOptionsDiv>,
  ];

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const handleMenuItemClick = (index: number) => {
    setOpen(false);

    if (index === 0) {
      router.push("../onboarding/edit-profile");
    } else if (index === 1) {
      router.push("../auth/reset-password");
    } else if (index === 2) {
      router.push("../auth/sign-in");
    }
  };

  return (
    <MainDiv>
      <ProfileContainer ref={anchorRef} $open={open}>
        <Icon
          name="profile"
          color={open ? COLORS.mediumElectricBlue : COLORS.black40}
        />
        <DropdownButton onClick={() => setOpen(!open)}>
          {open ? (
            <IoIosArrowUp color={COLORS.mediumElectricBlue} />
          ) : (
            <IoIosArrowDown color={COLORS.black40} />
          )}
        </DropdownButton>
      </ProfileContainer>
      <Popper
        sx={{ zIndex: 1, marginTop: "1rem !important" }}
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-end"
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <StyledMenuPaper>
              <ClickAwayListener onClickAway={handleClose}>
                <StyledMenuList id="split-button-menu">
                  {options.map((option, index) => (
                    <StyledMenuItem
                      key={index}
                      onClick={() => handleMenuItemClick(index)}
                    >
                      {option}
                    </StyledMenuItem>
                  ))}
                </StyledMenuList>
              </ClickAwayListener>
            </StyledMenuPaper>
          </Grow>
        )}
      </Popper>
    </MainDiv>
  );
};

export default ProfileBar;
