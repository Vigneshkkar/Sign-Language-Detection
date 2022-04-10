import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as HolisticHelper from '@mediapipe/holistic';
import { Holistic } from '@mediapipe/holistic';
import * as cam from '@mediapipe/camera_utils';
import * as drawUtil from '@mediapipe/drawing_utils';
import Webcam from 'react-webcam';
import styles from './index.module.scss';
import { getKeyPoints } from '../../util/Helper';
import * as tf from '@tensorflow/tfjs';
import { messageService } from '../../util/MessageService';

const FRAMES_TO_COLLECT = 40;
const VIDEOS_TO_COLLECT = 10;
const WAIT_TIME = 1000;

let test = [];

const RoomScreen = ({ model }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const drawConnectors = drawUtil.drawConnectors;
  const drawLandmarks = drawUtil.drawLandmarks;
  var camera = null;
  let fullFrames = [];
  const [Loading, setLoading] = useState(true);
  const [holi, setholi] = useState(null);
  // const [sentence, setsentence] = useState([]);
  // const wordCheck = useRef(null);

  // useEffect(() => {
  //   console.log(window.wordCheck);
  //   setsentence(window.wordCheck);
  //   return () => {};
  // }, [window.wordCheck]);

  function onResults(results) {
    return results;
  }

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
    const labels = [
      'fine',
      'help',
      'hi',
      'how',
      'i',
      'name',
      'no',
      'please',
      'sorry',
      'thank you',
      'yes',
      'you',
    ];
    const sentence = [];
    holistic.onResults((res) => {
      if (Loading) {
        setLoading(false);
      }
      const temp = getKeyPoints(onResults(res));
      if (fullFrames.length >= FRAMES_TO_COLLECT) {
        fullFrames.splice(0, 1);
        fullFrames.push(temp);
        if (!!res.leftHandLandmarks || !!res.rightHandLandmarks) {
          const predicted = model.predict(tf.tensor([fullFrames])).dataSync();
          const index = predicted.indexOf(Math.max(...predicted));
          const word = labels[index];
          console.log(word);
          if (
            sentence.at(-1) != word
            // &&
            // !(sentence.length != 0 && word == 'hi')
          ) {
            sentence.push(word);
            // test = sentence;
            // wordCheck.current.innerHTML = sentence.join(' ');
            messageService.sendMessage(word);
          }
        }
      } else {
        fullFrames.push(temp);
      }
    });

    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null
    ) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          if (webcamRef.current)
            await holistic.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
    setholi(holistic);

    return () => {
      const feed = webcamRef.current.video;

      // reset feed source
      feed.pause();
      feed.srcObject.getTracks().forEach((a) => a.stop());
      feed.srcObject = null;
    };
  }, []);

  return (
    <div className={styles.container}>
      {/* <div>
        <span ref={wordCheck}></span>
      </div> */}
      <div>
        <Webcam ref={webcamRef} className={styles.webcam} audio={false} />
        {/* <canvas ref={canvasRef} className={styles.webcam}></canvas> */}
      </div>
    </div>
  );
};

export default RoomScreen;
