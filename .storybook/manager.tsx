import React from "react";
import { addons, type HashEntry } from "@storybook/manager-api";

import SidebarTag from './components/SidebarTag'

addons.setConfig({
  sidebar: {
    renderLabel: (item: HashEntry) => (
      <>
        {item.name}
        <SidebarTag item={item} />
      </>
    ),
  },
});
