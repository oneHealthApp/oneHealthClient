// import { BackendMenu } from "@/@types/auth";
// import type { NavigationTree } from "@/@types/navigation";
// import navigationIcons from "@/configs/navigation-icon.config";
// import {
//   NAV_ITEM_TYPE_ITEM,
//   NAV_ITEM_TYPE_COLLAPSE,
// } from "@/constants/navigation.constant";

// /**
//  * Maps flat backend menus with childOf references to a hierarchical navigation tree
//  */
// export const mapBackendMenusToNavigation = (
//   menus: BackendMenu[]
// ): NavigationTree[] => {
//   const iconOrder = Object.keys(navigationIcons);

//   // Create a lookup map for menus by ID
//   const menuMap = new Map<string, NavigationTree>();

//   menus.forEach((menu) => {
//     const key = menu.menuName.toLowerCase().replace(/\s+/g, "");
//     menuMap.set(menu.id, {
//       key,
//       path: menu.path,
//       title: menu.menuName,
//       translateKey: `nav.${key}`,
//       iconKey: key,
//       type: NAV_ITEM_TYPE_ITEM, // default type
//       authority: [],
//       subMenu: [],
//       permissions: { ...menu.permissions },
//     });
//   });

//   // Build tree by attaching child menus to their parent
//   const navigationTree: NavigationTree[] = [];

//   menus.forEach((menu) => {
//     const current = menuMap.get(menu.id)!;
//     if (menu.childOf) {
//       const parent = menuMap.get(menu.childOf);
//       if (parent) {
//         parent.subMenu!.push(current);
//         parent.type = NAV_ITEM_TYPE_COLLAPSE; // parent becomes collapsible
//       }
//     } else {
//       navigationTree.push(current);
//     }
//   });

//   // Sort helper using iconOrder
//   const sortMenus = (arr: NavigationTree[]) =>
//     arr.sort((a, b) => {
//       const keyA = a.key;
//       const keyB = b.key;
//       const idxA = iconOrder.indexOf(keyA);
//       const idxB = iconOrder.indexOf(keyB);
//       return idxA - idxB;
//     });

//   // Sort top-level and submenus recursively
//   const sortTree = (arr: NavigationTree[]) => {
//     // arr = sortMenus(arr);
//     arr.forEach((menu) => {
//       if (menu.subMenu && menu.subMenu.length > 0) {
//         menu.subMenu = sortTree(menu.subMenu);
//       }
//     });
//     return arr;
//   };

//   const sortedTree = sortTree(navigationTree);

//   console.log("Mapped Navigation Tree:", sortedTree);
//   return sortedTree;
// };

import { BackendMenu } from "@/@types/common";
import type { NavigationTree } from "@/@types/navigation";
import {
  NAV_ITEM_TYPE_ITEM,
  NAV_ITEM_TYPE_COLLAPSE,
} from "@/constants/navigation.constant";

export const mapBackendMenusToNavigation = (
  menus: BackendMenu[]
): NavigationTree[] => {
  // Create a lookup map for menus by ID
  const menuMap = new Map<string, NavigationTree>();

  menus.forEach((menu) => {
    const key = menu.menuName.toLowerCase().replace(/\s+/g, "");

    menuMap.set(menu.id, {
      key,
      path: menu.path, // will be cleared later for parents
      title: menu.menuName,
      translateKey: `nav.${key}`,
      icon: "",
      type: NAV_ITEM_TYPE_ITEM,
      authority: [],
      subMenu: [],
      // permissions: { ...menu.permissions },
    });
  });

  // Build parent-child tree
  const navigationTree: NavigationTree[] = [];

  menus.forEach((menu) => {
    const current = menuMap.get(menu.id)!;

    if (menu.childOf) {
      const parent = menuMap.get(menu.childOf);
      if (parent) {
        parent.subMenu!.push(current);
        parent.type = NAV_ITEM_TYPE_COLLAPSE;

        // ❗ IMPORTANT: parent must NOT navigate
        parent.path = "";
      }
    } else {
      navigationTree.push(current);
    }
  });

  // Recursively fix parent menu type + empty parent path
  const finalizeTree = (nodes: NavigationTree[]) => {
    return nodes.map((node) => {
      if (node.subMenu && node.subMenu.length > 0) {
        node.type = NAV_ITEM_TYPE_COLLAPSE;

        // ❗ Prevent parent navigation — CRITICAL FIX
        node.path = "";

        node.subMenu = finalizeTree(node.subMenu);
      }
      return node;
    });
  };

  return finalizeTree(navigationTree);
};
