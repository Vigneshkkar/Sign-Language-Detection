import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { SaveServices } from '../../services';
import { Grid, Skeleton, Stack, Typography } from '@mui/material';
import { textAlign } from '@mui/system';

const WordDetails = () => {
  const [data, setdata] = useState([]);
  useEffect(() => {
    SaveServices.getWords().then((data) => {
      console.log(data);
      setdata(data.data);
    });

    return () => {
      setdata(null);
    };
  }, []);

  return (
    <>
      <Grid container spacing={4}>
        <Grid sx={{ textAlign: 'center' }} item xs={12}>
          <Typography color={'#e84855'} variant='h3'>
            Words List
          </Typography>
        </Grid>
        <Grid sx={{ textAlign: '-webkit-center' }} item xs={12}>
          {data.length > 0 ? (
            <Paper sx={{ width: '250px' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align='center'>Word</TableCell>
                      <TableCell align='center'>Total Videos</TableCell>
                      {/* <TableCell align="right">Last Updated On</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row) => (
                      <TableRow
                        key={row._id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}>
                        <TableCell component='th' scope='row'>
                          {row._id}
                        </TableCell>
                        <TableCell align='center'>{row.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ) : (
            <Stack alignItems={'center'} spacing={0.1}>
              <Skeleton width={250} height={50} variant='text' />
              <Skeleton width={250} height={50} animation='wave' />
            </Stack>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default WordDetails;
