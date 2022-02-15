import { FaceMesh } from '@mediapipe/face_mesh';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as Facemesh from '@mediapipe/face_mesh';
import * as HolisticHelper from '@mediapipe/holistic';
import { Holistic } from '@mediapipe/holistic';
import * as cam from '@mediapipe/camera_utils';
import * as drawUtil from '@mediapipe/drawing_utils';
import Webcam from 'react-webcam';
import styles from './index.module.scss';
import LoadingButton from '@mui/lab/LoadingButton';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const FRAMES_TO_COLLECT = 40;
const VIDEOS_TO_COLLECT = 10;
const WAIT_TIME = 1000;
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const RecordVideoScreen = ({ collectionCompleted, isSaving, isError }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const drawConnectors = drawUtil.drawConnectors;
  const drawLandmarks = drawUtil.drawLandmarks;
  var camera = null;
  let finalResult = [];

  const [Loading, setLoading] = useState(true);
  const [startCollection, setstartCollection] = useState(false);
  const [holi, setholi] = useState(null);
  const [videos, setvideos] = useState(0);
  const [completeVid, setcompleteVid] = useState([]);
  const [frames, setFrames] = useState(0);
  const [paused, setpaused] = useState(false);
  const [word, setword] = useState(null);
  function onResults(results) {
    // finalResult.push(results);

    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // Set canvas width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d');
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    // console.log(results);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    drawConnectors(
      canvasCtx,
      results.poseLandmarks,
      HolisticHelper.POSE_CONNECTIONS,
      {
        color: '#00FF00',
        lineWidth: 4,
      }
    );
    drawLandmarks(canvasCtx, results.poseLandmarks, {
      color: '#FF0000',
      lineWidth: 2,
    });
    drawConnectors(
      canvasCtx,
      results.faceLandmarks,
      HolisticHelper.FACEMESH_TESSELATION,
      {
        color: '#C0C0C070',
        lineWidth: 1,
      }
    );
    drawConnectors(
      canvasCtx,
      results.leftHandLandmarks,
      HolisticHelper.HAND_CONNECTIONS,
      {
        color: '#CC0000',
        lineWidth: 5,
      }
    );
    drawLandmarks(canvasCtx, results.leftHandLandmarks, {
      color: '#00FF00',
      lineWidth: 2,
    });
    drawConnectors(
      canvasCtx,
      results.rightHandLandmarks,
      HolisticHelper.HAND_CONNECTIONS,
      {
        color: '#00CC00',
        lineWidth: 5,
      }
    );
    drawLandmarks(canvasCtx, results.rightHandLandmarks, {
      color: '#FF0000',
      lineWidth: 2,
    });
    canvasCtx.restore();
    return results;
  }
  useEffect(() => {
    if (!!holi) {
      let temp;
      finalResult = [];
      let completeVid = [];
      let videos = 1;
      holi.onResults(null);
      let paused = false;
      if (startCollection) {
        holi.onResults((res) => {
          temp = onResults(res);
          delete temp.image;
          if (videos <= VIDEOS_TO_COLLECT) {
            if (finalResult.length < FRAMES_TO_COLLECT && !paused) {
              setFrames(finalResult.length);
              finalResult.push(temp);
            } else if (finalResult.length == FRAMES_TO_COLLECT && !paused) {
              setcompleteVid(completeVid.push(finalResult));
              finalResult = [];
              setvideos(videos++);
              paused = true;
              setpaused(true);
              setTimeout(() => {
                paused = false;
                setpaused(false);
              }, WAIT_TIME);
            }
          } else {
            // console.log(completeVid);
            setvideos(0);
            setFrames(0);
            collectionCompleted(completeVid, word);
            setstartCollection(false);
          }
        });
      } else {
        holi.onResults((res) => {
          onResults(res);
        });
      }
    }
    return () => {
      // finalResult = [];
    };
  }, [startCollection]);

  useEffect(() => {
    const holistic = new Holistic({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      },
    });

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: false,
      enableSegmentation: false,
      smoothSegmentation: false,
      refineFaceLandmarks: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    let startTime = null;
    let flag = true;
    let temp;
    holistic.onResults((res) => {
      if (Loading) {
        setLoading(false);
      }
      onResults(res);
    });

    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null
    ) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await holistic.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
    setholi(holistic);
  }, []);
  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  return (
    <div className={styles.container}>
      <div>
        <Webcam ref={webcamRef} className={styles.webcam} />
        <canvas ref={canvasRef} className={styles.webcam}></canvas>
      </div>
      {/* {frames + ':' + videos + ':' + paused + ':' + word} */}
      <div className={styles.details}>
        {paused ? (
          <span className={styles.paused}>
            Paused for resetting hand Position
          </span>
        ) : null}
        <span className={styles.video}>
          Collecting Data for Video #{videos}
        </span>
        <span className={styles.frame}>Capturing Frame {frames}</span>
      </div>
      <div className={styles.buttonCont}>
        <TextField
          onInput={(val) => setword(val.target.value)}
          label='Word'
          variant='outlined'
          disabled={isSaving}
        />
        <LoadingButton
          disabled={isSaving}
          loading={Loading || startCollection}
          loadingPosition='start'
          startIcon={<PlayCircleFilledWhiteIcon />}
          onClick={() => {
            if (!word) setOpen(true);
            else setstartCollection(true);
          }}
          variant='outlined'>
          {startCollection ? 'Collecting Frames' : 'Start'}
        </LoadingButton>
      </div>
      {isSaving ? (
        <span className={styles.saving}>
          Saving the data for the word {word} please wait...
        </span>
      ) : null}
      {isError ? (
        <span className={styles.error}>
          Error while saving data for the word {word} please try again...
        </span>
      ) : null}

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
          Cannot start collecting data without entering word.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RecordVideoScreen;
