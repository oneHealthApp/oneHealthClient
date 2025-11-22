// import {
//     HiOutlineColorSwatch,
//     HiOutlineDesktopComputer,
//     HiOutlineTemplate,
//     HiOutlineViewGridAdd,
//     HiOutlineHome,
// } from 'react-icons/hi'
// import type { JSX } from 'react'

// export type NavigationIcons = Record<string, JSX.Element>

// const navigationIcon: NavigationIcons = {
//     home: <HiOutlineHome />,
//     singleMenu: <HiOutlineViewGridAdd />,
//     collapseMenu: <HiOutlineTemplate />,
//     groupSingleMenu: <HiOutlineDesktopComputer />,
//     groupCollapseMenu: <HiOutlineColorSwatch />,
// }

// export default navigationIcon

import {
  HiOutlineHome,
  HiOutlineBuildingOffice,
  HiOutlineUserGroup,
  HiOutlineUserCircle,
  HiOutlineChartBar,
  HiOutlineShieldCheck,
  HiOutlineCog6Tooth,
  HiOutlineClipboardDocumentList,
  HiOutlineClipboardDocumentCheck,
} from "react-icons/hi2"; // using hi2 for updated heroicons v2
import type { JSX } from "react";
import {
  HiOutlineClipboardList,
  HiOutlineColorSwatch,
  HiOutlineDesktopComputer,
  HiOutlineTemplate,
  HiOutlineViewGridAdd,
} from "react-icons/hi";

export type NavigationIcons = Record<string, JSX.Element>;

const navigationIcon: NavigationIcons = {
  // Default base icons
  home: <HiOutlineHome />,
  singleMenu: <HiOutlineViewGridAdd />,
  collapseMenu: <HiOutlineTemplate />,
  groupSingleMenu: <HiOutlineDesktopComputer />,
  groupCollapseMenu: <HiOutlineColorSwatch />,

  // SUPER ADMIN MENU ICONS
  dashboard: <HiOutlineHome />,

  // Tenant Management
  tenantManagement: <HiOutlineBuildingOffice />,
  tenantsList: <HiOutlineClipboardList />,
  tenantCreate: <HiOutlineViewGridAdd />,
  tenantSubscription: <HiOutlineClipboardDocumentList />,

  // Users
  users: <HiOutlineUserGroup />,
  usersList: <HiOutlineUserCircle />,
  assignRoles: <HiOutlineClipboardDocumentCheck />,

  // Clinics
  clinics: <HiOutlineBuildingOffice />,
  clinicsList: <HiOutlineClipboardList />,
  clinicCreate: <HiOutlineViewGridAdd />,

  // Analytics
  analytics: <HiOutlineChartBar />,
  statistics: <HiOutlineChartBar />,
  outbreaks: <HiOutlineColorSwatch />,

  // Audit Logs
  auditLogs: <HiOutlineShieldCheck />,

  // Settings
  settings: <HiOutlineCog6Tooth />,
};

export default navigationIcon;
