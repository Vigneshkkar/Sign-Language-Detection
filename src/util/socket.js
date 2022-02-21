import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import UiHelper from './UiHelper';
import WebRTCHelper from './WebRtcHelper';

const SocketHelper = ({ room_id, display_name }) => {
  const [socket, setsocket] = useState(null);
  const [peerIds, setpeerIds] = useState([]);
  const [myId, setmyId] = useState(null);

  const [a, b, c, d, e, closeConnection, invite] = WebRTCHelper();

  const [videoGrid, addVideoElement, dum, removeVideoElement] = UiHelper();

  useEffect(() => {
    const newSocket = io('ws://127.0.0.1:5000', { autoConnect: false });
    newSocket.on('connect', () => {
      console.log('socket connected....', newSocket.id);
      newSocket.emit('join-room', {
        room_id: room_id || 'test_room',
        display_name: display_name, //newSocket.id,
      });
    });

    newSocket.on('user-connect', (data) => {
      console.log('user-connect ', data);
      addVideoElement(data['sid'], data['name']);
      setpeerIds([
        ...peerIds,
        { PeerId: data['sid'], displayName: data['name'] },
      ]);
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
