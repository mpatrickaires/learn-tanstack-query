import { Typography } from '@mui/material';

export function ExampleDescription({ description }: Props) {
  return (
    <Typography
      lineHeight={1.5}
      textAlign="justify"
      whiteSpace="pre-line"
      mb={2}
    >
      {description}
    </Typography>
  );
}

type Props = {
  description: string;
};
