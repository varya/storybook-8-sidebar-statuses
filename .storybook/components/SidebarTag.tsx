/**
 * The <SidebarTag> component is designed for integration within the Storybook's manager.tsx,
 * specifically to be called from the `renderLabel` method. This method is responsible for rendering
 * labels within the Storybook UI, providing context and additional information about each item in the sidebar.
 * Unfortunately, the `renderLabel` method receives limited data about the items it renders; for component items,
 * it lacks additional metadata, such as tags that signify the status of the component (e.g., NEW, BETA, DEPRECATED).
 * 
 * It is recommended to assign these statuses as tags within the metadata in the *.stories.tsx file for a component.
 * For instance:
 * 
 * ```
 * const meta: Meta<typeof Btn> = {
 *   title: 'Components/Button',
 *   component: Btn,
 *   tags: ['NEW'], // Assigning status as tags here
 *   argTypes: {...},
 * };
 * ```
 * 
 * These tags then serve as indicators of the component's status, providing immediate visibility into their lifecycle stage
 * right from the Storybook UI. The full list of statuses, which can be found later in the code, includes NEW, BETA, and
 * DEPRECATED.
 * 
 * To display these tag badges after Storybook has loaded, the component gets data from Manager-API's Consumer and extracts
 * tag information for items with the type "docs" since tags for the type "component" are not available. If there is no tags
 * for the "docs" type, the component will search for any other item with the same id and tags that match the statuses.
 * This approach allows us to utilize corresponding documentation items to infer and display the relevant status tags for
 * components, ensuring that all items within the Storybook sidebar can visually communicate their development stage through
 * tags.
 */

import React from 'react';
import { Consumer } from '@storybook/manager-api';

export enum STATUS {
  DEPRECATED = 'DEPRECATED',
  BETA = 'BETA',
  NEW = 'NEW',
};

interface Item {
  type: string;
  id: string;
  name: string;
  tags?: string[];
  children?: string[];
}

type Combo = any;

type DataEntry = {
  tags?: string[];
}

type DataMap = {
  [key: string]: DataEntry;
}

const defaultTagsConfig = {
  [STATUS.NEW]: {
    title: 'New',
      styles: {
        backgroundColor: '#D6E0FF',
        borderColor: '#2952CC',
        color: '#2952CC',
      },
  },  
  [STATUS.BETA]: {
    title: 'Beta',
    styles: {
      backgroundColor: '#FFEFD2',
      borderColor: '#66460D',
      color: '#66460D',
    },
  },
  [STATUS.DEPRECATED]: {
    title: 'Deprecated',
    styles: {
      backgroundColor: '#F8E3DA',
      borderColor: '#85462B',
      color: '#85462B',
    },
  },
}

const mapper = (combo: Combo) => {
  return combo.state.index;
}

const isStatus = (value: string): value is STATUS => {
  return Object.values(STATUS).includes(value as STATUS);
}

const filterTags = (tags: string[] | undefined): string[] => {
  return tags?.filter(tag => isStatus(tag.toUpperCase())) || [];
};

const getTags = (data: DataMap, itemId: string): string[] => {

  // Attempt to find and filter tags for `--docs` entry
  let filteredTags = filterTags(data[`${itemId}--docs`]?.tags);

  if (filteredTags.length === 0) {
    // Find the first entry matching the criteria
    const entry = Object.entries(data).find(([key, value]) =>
      key.startsWith(`${itemId}--`) && filterTags(value.tags).length > 0
    );

    // Filter tags for the found entry
    if (entry) {
      filteredTags = filterTags(entry[1].tags);
    }
  }

  return filteredTags;
}

const SidebarTagComponent = ({ item }: { item: Item }) => (
  <Consumer filter={mapper}>
    {(stories) => {
      const tags = getTags(stories, item.id);
      return tags.map((tag: string) => {
        // Verify and assert that the tag is a key of `defaultTagsConfig`
        const tagKey = tag.toUpperCase() as keyof typeof defaultTagsConfig;
        if (!defaultTagsConfig[tagKey]) {
          return null;
        }

        const style = defaultTagsConfig[tagKey].styles;
        const title = defaultTagsConfig[tagKey].title;
        return (
          <span key={tag} style={{...style, marginLeft: 'auto', marginRight: '15px', borderRadius: '3px', padding: '2px 4px', display: 'inline-block'}}>
              {title}
          </span>
        )
      })
    }}
  </Consumer>
)

const SidebarTag =  ({ item }: { item: Item })=> {

  switch (item.type) {
    case 'component':
      return <SidebarTagComponent item={item} />;
    default:
      return null;
  }

}

export default SidebarTag;