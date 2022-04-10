// Adds the CPU backend.
// import '@tensorflow/tfjs-backend-cpu';
// Import @tensorflow/tfjs-core
import * as tf from '@tensorflow/tfjs';
// Import @tensorflow/tfjs-tflite.
// import * as tflite from '@tensorflow/tfjs-tflite';
import { useEffect, useState } from 'react';
import RoomScreen from './RoomScreen';
// import { io } from 'socket.io-client';

// tflite.setWasmPath('http://127.0.0.1:5000/api/v1/dataset/');
// tflite.setWasmPath(
//   'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@0.0.1-alpha.8/dist/'
// );

const Room = () => {
  const [model, setmodel] = useState(null);

  // useEffect(() => {
  //   if (socket) socket.connect();

  //   return () => {
  //     if (socket) socket.close();
  //   };
  // }, [socket]);

  useEffect(async () => {
    // const tfliteModel = await tflite.loadTFLiteModel(
    //   'http://127.0.0.1:5000/api/v1/dataset/static/image_model.tflite'
    // );
    // // tfliteModel.then((data) => console.log(data));
    // console.log(tfliteModel);
    let baseUrl = 'http://127.0.0.1:5000/api/v1/';
    if (process.env.REACT_APP_STAGE === 'production') {
      baseUrl = `${window.location.protocol}//${window.location.hostname}/api/v1/`;
    }
    const model = await tf.loadLayersModel(
      `${baseUrl}dataset/static/newjsModel/model.json`
    );
    setmodel(model);
    // model.predict([]);

    return () => {};
  }, []);

  return <>{model && <RoomScreen model={model} />};</>;
};

export default Room;
