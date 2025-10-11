import type { JSX } from '@emotion/react/jsx-runtime';
import { Box, Tab, Tabs } from '@mui/material';
import { useMemo, useState } from 'react';
import { ExampleDescription } from './ExampleDescription';
import { ExampleRun } from './ExampleRun';
import { ExampleTitle } from './ExampleTitle';

export function ExampleHeaderTab({ tabs, docsUrl }: Props) {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box>
      <ExampleTitle docsUrl={docsUrl} />
      <Tabs value={tabValue} onChange={(_, value) => setTabValue(value)}>
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
  const tab = useMemo(() => tabs[tabValue], [tabs, tabValue]);
  if (!tab) {
    throw new Error(`No tab found for tabValue '${tabValue}'`);
  }

  return (
    <Box mt={2}>
      <ExampleDescription description={tab.description} />
      <ExampleRun>{tab.render}</ExampleRun>
    </Box>
  );
}

type Props = {
  tabs: Array<{
    label: string;
    description: string;
    render: JSX.Element;
  }>;
  docsUrl: string;
};
