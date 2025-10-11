import type { JSX } from '@emotion/react/jsx-runtime';
import { Box, Typography } from '@mui/material';
import type { ComponentPropsWithoutRef } from 'react';
import { VerticalSeparator } from '../VerticalSeparator';

export function ExampleSections({ sections, titleProps }: Props) {
  return (
    <Box display="flex" gap={2}>
      {sections.map(({ title, render }, i) => (
        <>
          <Box>
            {title && (
              <Typography variant="h6" mb={2} {...titleProps}>
                {title}
              </Typography>
            )}
            {render}
          </Box>
          {i + 1 < sections.length && <VerticalSeparator />}
        </>
      ))}
    </Box>
  );
}

type Props = {
  sections: Array<{
    title?: string;
    render: JSX.Element;
  }>;
  titleProps?: ComponentPropsWithoutRef<typeof Typography>;
};
