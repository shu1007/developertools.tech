import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';

import Heading from '../components/Heading';
import Layout from '../components/Layout';

export default function IndexPage() {
  return (
    <Layout>
      <Box textAlign='center'>
        <Heading>Oof! You are offline!</Heading>
        <Typography paragraph>
          Please try again when you have a network connection.
        </Typography>
      </Box>
    </Layout>
  );
}
