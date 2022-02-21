import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import styles from './index.module.scss';
import { useState } from 'react';
import JoinRoom from '../../components/JoinRoom';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const [open, setOpen] = useState(false);
  let navigate = useNavigate();
  return (
    <>
      <JoinRoom
        open={open}
        onClose={(name, id) => {
          console.log(name, id);
          setOpen(false);
          if (name && id) {
            navigate(`/chat/${id}/${name}`);
          }
        }}
      />
      <div className={styles.appBar}>
        <div className={styles.titile}>Loud Signers</div>
        <Button
          onClick={() => setOpen(true)}
          className={styles.button}
          variant='text'>
          Join Room
        </Button>
        <Button className={styles.button} variant='text'>
          Record Dataset
        </Button>
      </div>
      <div className={styles.container}></div>
    </>
  );
};

export default HomeScreen;
