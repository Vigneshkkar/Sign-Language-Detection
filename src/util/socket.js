import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import UiHelper from './UiHelper';
import WebRTCHelper from './WebRtcHelper';

import Toastify from 'toastify-js';
import { messageService } from './MessageService';

var msg = new SpeechSynthesisUtterance();
var voices = window.speechSynthesis.getVoices();
msg.voice = voices[10];
msg.volume = 1; // From 0 to 1
msg.rate = 1; // From 0.1 to 10
msg.pitch = 2; // From 0 to 2
msg.lang = 'en';
// msg.text = "Como estas Joel";
// speechSynthesis.speak(msg);
var disp_const = '';

const SocketHelper = ({ room_id, display_name }) => {
  disp_const = display_name;
  const [socket, setsocket] = useState(null);
  const [peerIds, setpeerIds] = useState([]);
  const [myId, setmyId] = useState(null);

  const [a, b, c, d, e, closeConnection, invite] = WebRTCHelper();

  const [videoGrid, addVideoElement, dum, removeVideoElement] = UiHelper();

  const [subscription, setsubscription] = useState(null);

  useEffect(() => {
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const newSocket = io(
      process.env.REACT_APP_STAGE === 'production'
        ? `wss://loud-signers.com:3001`
        : 'ws://127.0.0.1:5000',
      { autoConnect: false }
    );
    // const newSocket = io('https://6454-142-115-62-84.ngrok.io', {
    //   autoConnect: false,
    // });
    newSocket.on('connect', () => {
      console.log('socket connected....', newSocket.id);
      newSocket.emit('join-room', {
        room_id: room_id || 'test_room',
        display_name: display_name, //newSocket.id,
      });
    });
    const sub = messageService.getMessage().subscribe((message) => {
      console.log(newSocket);
      newSocket.emit('broadcast-predicted', {
        room_id: room_id || 'test_room',
        sender_id: myId,
        type: 'predicted_msg',
        display_name: disp_const,
        text: message.text,
      });
    });
    setsubscription(sub);

    newSocket.on('user-connect', (data) => {
      console.log('user-connect ', data);
      addVideoElement(data['sid'], data['name']);
      setpeerIds([
        ...peerIds,
        { PeerId: data['sid'], displayName: data['name'] },
      ]);
    });

    newSocket.on('get-predicted', (data) => {
      console.log('get-predicted', data);
      Toastify({
        text: `${data.display_name} : ${data.text}`,
        duration: 4000,
        newWindow: true,
        close: false,
        gravity: 'bottom', // `top` or `bottom`
        position: 'left', // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: 'linear-gradient(to right, #5931fc, #e84855)',
          borderRadius: '10px',
        },
        onClick: function () {}, // Callback after click
      }).showToast();
      msg.text = data.text;
      speechSynthesis.speak(msg);
    });

    newSocket.on('user-disconnect', (data) => {
      console.log('user-disconnect ', data);
      let peer_id = data['sid'];
      closeConnection(peer_id);
      removeVideoElement(peer_id);
      setpeerIds(peerIds.filter((o) => o.PeerId != peer_id));
    });
    newSocket.on('user-list', (data) => {
      console.log('user list recvd ', data);
      if (myId != data['my_id']) setmyId(data['my_id']);
      if ('list' in data) {
        // not the first to connect to room, existing user list recieved
        let recvd_list = data['list'];
        // add existing users to user list
        let ids = [];
        for (var peer_id in recvd_list) {
          display_name = recvd_list[peer_id];
          ids = [...ids, { PeerId: peer_id, displayName: display_name }];
          addVideoElement(peer_id, display_name);
        }
        //for testing
        // new Array(100).fill(1).map((o, i) => addVideoElement(o, i));
        for (var peer of ids) {
          invite(peer.PeerId);
        }
        setpeerIds(ids);
      }
    });

    setsocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return [socket, peerIds, myId, videoGrid];
};

export default SocketHelper;
