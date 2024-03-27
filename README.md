# Storybook Tags-based Badges

This repository introduces a solution for enhancing Storybook sidebar with tags-based badges for components, addressing limitations experienced after upgrading from Storybook 6 to versions 7 and 8. 

## Overview

In Storybook's earlier versions, it allowed the addition of custom parameters to stories and components. Many used this feature to provide statuses for the components and display them in
the sidebar alongside with the component names.
However, subsequent upgrades introduced a regression where these features were not accessible, leading to a loss of this functionality.

This repository offers a workaround and enhancement through the implementation of the `<SidebarTag>` component. This component integrates within Storybook's `manager.tsx` file and utilizes the `renderLabel` method for rendering badges for components in the sidebar.

## Problem Solved

In versions 7 and 8 of Storybook, the direct access to component parameters within stories and components was lost, rendering it impossible to customize the sidebar with badges indicating the status of components. This solution restores this functionality, enabling the use of tags within story metadata to indicate a component's lifecycle stage (e.g., NEW, BETA, DEPRECATED).

## How It Works

The `<SidebarTag>` component is crafted to work seamlessly within Storybook's sidebar. It operates by fetching the `index.json` file post-Storybook load, extracting tag information for items marked as "docs". This is because direct tag information for components is unavailable. In cases where tags for "docs" type are absent, the component searches for any item with matching IDs and tags that correspond with predefined statuses.

Here's a brief guide on how to use it:

1. **Integration**: Embed the `<SidebarTag>` component into Storybook's `manager.tsx`, enabling it to enhance sidebar labels with status badges.

2. **Tagging Stories**: Assign statuses as tags within the metadata of your `*.stories.tsx` files, like so:

   ```tsx
   const meta: Meta<typeof Btn> = {
     title: 'Components/Button',
     component: Btn,
     tags: ['NEW'], // Example of assigning status as tags
     argTypes: {...},
   };
   ```

## Repository Contents

- `.storybook/manager.tsx`: Contains the integration setup for the `<SidebarTag>` component.
- `.storybook/components/SidebarTag`: Contains the code for fetching the data and rendering the labels.
- `src/stories/*.stories.ts`: Example of how to tag a component with its respective statuses.

## Known Limitations

- Direct access to `tags` information for components is not possible, necessitating the use of the `index.json` for fetching this data.
- Real-time fetching of tags for all stories in the sidebar is not feasible, leading to reliance on the statically generated `index.json`.
- Fetching is performed for each component listed, potentially impacting performance for large story collections.

## Acknowledgments

The initial setup for this repository was inspired by and adapted from https://github.com/shilman/storybook-tag-badges, aiming to extend its functionalities and address the specific challenges encountered with Storybook's newer versions.