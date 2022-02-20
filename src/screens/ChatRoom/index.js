import { useEffect, useState } from 'react';
import ChatScreen from './ChatScreen';
import { io } from 'socket.io-client';
import SocketHelper from '../../util/socket';
import WebRTCHelper from '../../util/WebRtcHelper';
import UiHelper from '../../util/UiHelper';

const ChatRoom = () => {
  // const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  const [previousPeers, updatePeers, setsocket, setsteams, setmyId] =
    WebRTCHelper();
  const [socket, peerIds, myId, videoGrid] = SocketHelper({
    room_id: 'test_room',
    display_name: 'Vicky',
  });

  useEffect(() => {
    console.log(peerIds);
    if (peerIds && peerIds.length > 0) updatePeers(peerIds);
    return () => {};
  }, [peerIds]);
  useEffect(() => {
    if (videoGrid.current && connected) socket.connect();
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
          //   myVideo.srcObject = stream;
          // camera_allowed = true;
          //   setAudioMuteState(audioMuted);
          //   setVideoMuteState(videoMuted);
          //start the socketio connection
          setsteams(stream);
          if (!connected) {
            // socket.connect();
            setConnected(true);
          }
        })
        .catch((e) => {
          console.log('getUserMedia Error! ', e);
          alert('Error! Unable to access camera or mic! ');
        });
    }

    return () => {
      if (socket) socket.close();
    };
  }, [socket]);

  return (
    <>
      {/* <div>working</div> */}
      <div ref={videoGrid} class='video-grid'></div>
      {/* <ChatScreen />; */}
    </>
  );
};

export default ChatRoom;
