import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Stack, TextField } from '@mui/material';
import styles from './index.module.scss';
import { useState } from 'react';
import JoinRoom from '../../components/JoinRoom';
import { useNavigate } from 'react-router-dom';
import WordDetails from '../../components/WordDetails';
import Privacy from '../../components/Privacy';

import Logo from '../../assets/sign-language.png';

const HomeScreen = () => {
  const [open, setOpen] = useState(false);
  let navigate = useNavigate();
  return (
    <>
      <JoinRoom
        open={open}
        onClose={(name, id, signUser) => {
          console.log(name, id);
          setOpen(false);
          if (name && id) {
            navigate(`/chat/${signUser}/${id}/${name}`);
          }
        }}
      />
      <div className='appBar'>
        <div className='titile'>Loud Signers</div>
        <Button onClick={() => setOpen(true)} className='button' variant='text'>
          Join Room
        </Button>
        <Button
          onClick={() => navigate('/record')}
          className='button'
          variant='text'>
          Record Dataset
        </Button>
      </div>
      {/* <div className={styles.container}> */}
      <Stack alignItems={'center'} margin={2} spacing={2}>
        <img width={100} src={Logo} />
        <Typography
          color={'#e84855'}
          fontWeight='bold'
          align='center'
          variant='h2'>
          Sign Language Detection
        </Typography>
        <Privacy />
        <WordDetails />
      </Stack>
      {/* </div> */}
    </>
  );
};

export default HomeScreen;
