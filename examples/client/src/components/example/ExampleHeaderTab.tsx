import type { JSX } from '@emotion/react/jsx-runtime';
import { Box, Tab, Tabs } from '@mui/material';
import { useMemo, useRef, useState } from 'react';
import { ExampleDescription } from './ExampleDescription';
import { ExampleRun, type ExampleRunRef } from './ExampleRun';
import { ExampleTitle } from './ExampleTitle';

export function ExampleHeaderTab({ tabs, docsUrl }: Props) {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box>
      <ExampleTitle docsUrl={docsUrl} />
      <Tabs
        value={tabValue}
        onChange={(_, value) => {
          if (typeof value === 'number') {
            setTabValue(value);
          }
        }}
      >
        {tabs.map(({ label }, i) => (
          <Tab
            label={label}
            value={i}
            key={label}
            sx={{ textTransform: 'none' }}
          />
        ))}
      </Tabs>
      <TabRender tabs={tabs} tabValue={tabValue} />
    </Box>
  );
}

function TabRender({
  tabs,
  tabValue,
}: Pick<Props, 'tabs'> & { tabValue: number }) {
  const exampleRef = useRef<ExampleRunRef>(null);

  const tab = useMemo(() => {
    const tab = tabs[tabValue];
    exampleRef.current?.hide();

    return tab;
  }, [tabs, tabValue]);

  return (
    <Box mt={2}>
      <ExampleDescription description={tab.description} />
      <ExampleRun ref={exampleRef}>{tab.render}</ExampleRun>
    </Box>
  );
}

interface Props {
  tabs: {
    label: string;
    description: string;
    render: JSX.Element;
  }[];
  docsUrl: string;
}
