import { Typography } from '@mui/material';

export function ExampleTitle({ docsUrl }: Props) {
  const pageName = window.location.pathname
    .replaceAll('/', '')
    .replaceAll('-', ' ');

  return (
    <Typography
      variant="h5"
      textTransform="capitalize"
      mb={2}
      sx={{
        '&:hover': {
          textDecorationLine: 'underline',
        },
      }}
      className="example-title"
    >
      <a href={docsUrl} target="_blank">
        {pageName}
      </a>
    </Typography>
  );
}

type Props = {
  docsUrl: string;
};
