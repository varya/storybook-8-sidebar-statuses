import React from "react";
import { addons, type HashEntry } from "@storybook/manager-api";

const badgeStyles = {
  marginLeft: "auto",
  marginRight: "15px",
  borderRadius: "3px",
  color: "rgb(57, 29, 78)",
};

const getTags = (item: HashEntry) => {
  console.log({ item });
  if (item.tags?.includes("deprecated")) {
    return (
      <span style={{ backgroundColor: "rgb(243, 98, 103)", ...badgeStyles }}>
        Deprecated
      </span>
    );
  } else if (item.tags?.includes("experimental")) {
    return (
      <span style={{ backgroundColor: "rgb(198, 150, 238)", ...badgeStyles }}>
        Experimental
      </span>
    );
  }
};

addons.setConfig({
  sidebar: {
    renderLabel: (item: HashEntry) => (
      <>
        {item.name}
        {getTags(item)}
      </>
    ),
  },
});
