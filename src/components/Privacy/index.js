import { Grid, Paper, Stack, Typography } from '@mui/material';
import { grid } from '@mui/system';

const terms = [
  {
    title: 'Video Collection',
    content: `We do not collect any of your video we extract the key point
    directly on the client and save only the key points. So dont
    worry about your bad hair days :)`,
  },
  {
    title: 'Video Confrence',
    content: `The webcam content and audio is not transmitted through any servers its peer to peer and encrpted so dont worry about video hijaking`,
  },
  {
    title: 'Mode Selection',
    content: `The mode selection weather you are a sign user or normal user while joining room is not stored anywhere dont worry about your decision you can always change later while again joining the room`,
  },
];
const Privacy = () => {
  return (
    <>
      <Stack spacing={2} alignItems={'center'} width={'100%'}>
        <Typography color={'#e84855'} variant='h3'>
          Privacy
        </Typography>
        <Grid container spacing={2}>
          {terms.map((term) => (
            <Grid item xs={4}>
              <Paper
                elevation={3}
                sx={{
                  maxWidth: 250,
                  padding: 3,
                  margin: 'auto',
                  //   height: 230,
                  //   justifyContent: 'center',
                }}>
                <Stack spacing={1} alignItems={'center'}>
                  <Typography sx={{ fontWeight: 'bold' }} variant='h6'>
                    {term.title}
                  </Typography>
                  <Typography sx={{ color: 'rgb(97 97 97)' }} variant='body1'>
                    {term.content}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </>
  );
};

export default Privacy;
