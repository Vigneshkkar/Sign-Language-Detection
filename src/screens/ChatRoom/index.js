import { useEffect, useState } from 'react';
import ChatScreen from './ChatScreen';
import SocketHelper from '../../util/socket';
import WebRTCHelper from '../../util/WebRtcHelper';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import styles from './index.module.scss';

import VideoControls from '../../components/VideoControls';
import Webcam from 'react-webcam';
var steamRef = null;
const ChatRoom = () => {
  let params = useParams();
  let navigate = useNavigate();
  const [muted, setmuted] = useState(true);
  const [videoOn, setvideoOn] = useState(true);

  useEffect(() => {
    if (steamRef) {
      steamRef.getAudioTracks()[0].enabled = !muted;
      steamRef.getVideoTracks()[0].enabled = videoOn;
    }
  }, [muted, videoOn]);
  const [connected, setConnected] = useState(false);
  const [
    previousPeers,
    updatePeers,
    setsocket,
    setsteams,
    setmyId,
    a,
    b,
    clearAll,
  ] = WebRTCHelper();
  const [socket, peerIds, myId, videoGrid] = SocketHelper({
    room_id: params.RoomId,
    display_name: params.userName,
  });

  useEffect(() => {
    console.log(peerIds);
    if (peerIds && peerIds.length > 0) updatePeers(peerIds);
    return () => {};
  }, [peerIds]);
  useEffect(() => {
    if (videoGrid.current && connected) socket.connect();
    return () => {
      if (socket) {
        socket.close();
        clearAll();
      }
    };
  }, [videoGrid, connected]);

  useEffect(() => {
    setmyId(myId);
  }, [myId]);

  useEffect(() => {
    console.log(previousPeers);
  }, [previousPeers]);

  useEffect(() => {
    if (socket) {
      setsocket(socket);
      navigator.mediaDevices
        .getUserMedia({
          audio: true, // We want an audio track
          video: {
            height: 360,
          }, // ...and we want a video track
        })
        .then((stream) => {
          steamRef = stream;
          steamRef.getAudioTracks()[0].enabled = false;
          setsteams(stream);
          if (!connected) {
            setConnected(true);
          }
        })
        .catch((e) => {
          console.log('getUserMedia Error! ', e);
          alert('Error! Unable to access camera or mic! ');
        });
    }

    return () => {
      // if (socket) socket.close();
    };
  }, [socket]);

  return (
    <>
      {/* <div>working</div> */}
      <div className='appBar'>
        <div className='titile'>Room ID: {params.RoomId}</div>
        <Button onClick={() => navigate('/')} className='button' variant='text'>
          Exit Room
        </Button>
      </div>
      <div ref={videoGrid} className='video-grid'></div>
      <VideoControls
        muted={muted}
        videoOn={videoOn}
        setmuted={setmuted}
        setvideoOn={setvideoOn}
      />
      {params.UserType == 'true' ? (
        <ChatScreen enblePrediction={params.UserType} />
      ) : (
        <div className={styles.container}>
          {/* <div> */}
          <Webcam className={styles.webcam} audio={false} />
          {/* </div> */}
        </div>
      )}
    </>
  );
};

export default ChatRoom;
