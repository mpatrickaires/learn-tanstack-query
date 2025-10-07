import { Typography } from '@mui/material';
import { useLocation } from '@tanstack/react-router';

export function ExampleTitle({ docsUrl }: Props) {
  const location = useLocation();
  const pageName = location.pathname.replaceAll('/', '').replaceAll('-', ' ');

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
