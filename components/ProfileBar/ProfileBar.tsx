"use client";

import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { RxExit } from "react-icons/rx";
import { useRouter } from "next/navigation";
import {
  ClickAwayListener,
  Fade,
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
} from "./styles";

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
    {
      label: "Edit Profile",
      iconColor: COLORS.white,
      route: "../onboarding/edit-profile",
    },
    {
      label: "Reset Password",
      iconColor: COLORS.white,
      route: "../auth/reset-password",
    },
    {
      label: "Logout",
      iconColor: COLORS.mediumElectricBlue,
      route: "../auth/sign-in",
    },
  ];

  const handleMenuItemClick = (route: string) => {
    setOpen(false);
    router.push(route);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
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
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <StyledMenuPaper>
              <ClickAwayListener onClickAway={handleClose}>
                <StyledMenuList id="split-button-menu">
                  {options.map(option => (
                    <StyledMenuItem
                      key={option.label}
                      onClick={() => handleMenuItemClick(option.route)}
                    >
                      <MenuOptionsDiv>
                        <RxExit color={option.iconColor} />
                        <B2>{option.label}</B2>
                      </MenuOptionsDiv>
                    </StyledMenuItem>
                  ))}
                </StyledMenuList>
              </ClickAwayListener>
            </StyledMenuPaper>
          </Fade>
        )}
      </Popper>
    </MainDiv>
  );
};

export default ProfileBar;
