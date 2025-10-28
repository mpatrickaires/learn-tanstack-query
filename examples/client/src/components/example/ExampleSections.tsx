import type { JSX } from '@emotion/react/jsx-runtime';
import { Box, Typography } from '@mui/material';
import { Fragment, type ComponentPropsWithoutRef } from 'react';
import { VerticalSeparator } from '../VerticalSeparator';

export function ExampleSections({ titleProps, ...props }: Props) {
  const sections = props.sections.filter(({ show }) => show !== false);

  return (
    <Box display="flex" gap={2}>
      {sections.map(({ title, render }, i) => (
        <Fragment key={title}>
          <Box>
            {title && (
              <Typography variant="h6" mb={2} {...titleProps}>
                {title}
              </Typography>
            )}
            {render}
          </Box>
          {i + 1 < sections.length && <VerticalSeparator />}
        </Fragment>
      ))}
    </Box>
  );
}

interface Props {
  sections: {
    title?: string;
    render: JSX.Element;
    show?: boolean;
  }[];
  titleProps?: ComponentPropsWithoutRef<typeof Typography>;
}
