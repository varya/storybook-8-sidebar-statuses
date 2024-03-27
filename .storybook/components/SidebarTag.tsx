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
 * To display these tag badges after Storybook has loaded, the component fetches and reads the "index.json" file, extracting
 * tag information for items with the type "docs" since tags for the type "component" are not available. If there is no tags
 * for the "docs" type, the component will search for any other item with the same id and tags that match the statuses.
 * This approach allows us to utilize corresponding documentation items to infer and display the relevant status tags for
 * components, ensuring that all items within the Storybook sidebar can visually communicate their development stage through
 * tags.
 */

import React, { useEffect, useState } from 'react';

interface Item {
  type: string;
  id: string;
  name: string;
  tags?: string[];
  children?: string[];
}

const STATUS = {
  DEPRECATED: 'DEPRECATED',
  BETA: 'BETA',
  NEW: 'NEW',
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

const SidebarTagComponent = ({ item }: { item: Item }) => {
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('index.json');
        const data = await response.json();

        let filteredTags = [];

        // Initially try to find `--docs` and filter its tags
        const docEntry = data.entries[`${item.id}--docs`];
          if (docEntry && docEntry.tags) {
            filteredTags = docEntry.tags.filter((tag: string) => Object.values(STATUS).includes(tag.toUpperCase()));
        }

        // If no matching tags from the STATUS list, search for any `${item.id}--*` with matching tags
      if (filteredTags.length === 0) {
        const entryKey = Object.keys(data.entries).find(key => 
          key.startsWith(`${item.id}--`) && 
          data.entries[key].tags &&
          data.entries[key].tags.some((tag: string) => Object.values(STATUS).includes(tag.toUpperCase()))
        );
        
        if (entryKey) {
          const entry = data.entries[entryKey];
          filteredTags = entry.tags.filter((tag: string) => Object.values(STATUS).includes(tag.toUpperCase()));
        }
      }

      setTags(filteredTags);

      } catch (error) {
        console.error("Failed to fetch tags:", error);
        setTags([]); // In case of an error, reset tags to an empty array
      }
    };

    fetchTags();
  }, [item.id]); // Dependency array to re-run the effect if item.id changes
  
  return (
    <>
      {tags.map((tag: string) => {
          const style = defaultTagsConfig[tag.toUpperCase()].styles;
          const title = defaultTagsConfig[tag.toUpperCase()].title;
          return (
              <span key={tag} style={{...style, marginLeft: 'auto', marginRight: '15px', borderRadius: '3px', padding: '2px 4px', display: 'inline-block'}}>
                  {title}
              </span>
          );
      })}
    </>
  );
};

const SidebarTag =  ({ item }: { item: Item })=> {

  switch (item.type) {
    case 'component':
      return <SidebarTagComponent item={item} />;
    default:
      return null;
  }

};

export default SidebarTag;