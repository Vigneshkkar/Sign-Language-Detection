import { useCallback, useEffect, useState } from 'react';

const PC_CONFIG = {
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
        'stun:stun3.l.google.com:19302',
        'stun:stun4.l.google.com:19302',
      ],
    },
  ],
};
const log_error = (e) => {
  console.error('[ERROR] ', e);
};
var peerConnections = {};
var steams = null;
var myId = null;
var socketref = null;

const WebRTCHelper = () => {
  //   const [socketref, setsocket] = useState();
  const [previousPeers, setpreviousPeers] = useState([]);
  //   const [peerConnections, setpeerConnections] = useState({});
  //   const [myId, setmyId] = useState(null);
  //   const [steams, setsteams] = useState(null);
  const setsteams = (data) => {
    steams = data;
  };
  const setmyId = (data) => {
    myId = data;
  };
  const setsocket = (data) => {
    socketref = data;
  };
  const sendViaServer = useCallback(
    (data) => {
      socketref.emit('data', data);
    },
    [socketref]
  );

  useEffect(() => {
    if (socketref)
      socketref.on('data', (msg) => {
        switch (msg['type']) {
          case 'offer':
            handleOfferMsg(msg);
            break;
          case 'answer':
            handleAnswerMsg(msg);
            break;
          case 'new-ice-candidate':
            handleNewICECandidateMsg(msg);
            break;
        }
      });
    return () => {
      console.log(peerConnections);
    };
  }, [socketref]);

  const handleNewICECandidateMsg = (msg) => {
    console.log(`ICE candidate recieved from <${msg['sender_id']}>`);
    const peer_id = msg['sender_id'];
    // if (!(peer_id in peerConnections)) {
    //   createPeerConnection(peer_id);
    // }
    var candidate = new RTCIceCandidate(msg.candidate);
    peerConnections[msg['sender_id']]
      .addIceCandidate(candidate)
      .catch(log_error);
  };

  const handleAnswerMsg = (msg) => {
    const peer_id = msg['sender_id'];
    console.log(`answer recieved from <${peer_id}>`);
    // let desc = new RTCSessionDescription(msg['sdp']);
    // peerConnections[peer_id].setRemoteDescription(desc);
    // myPeerConnection
    // if (peerConnections[peer_id].signalingState == 'stable')
    peerConnections[peer_id]
      .setRemoteDescription(new RTCSessionDescription(msg['sdp']))
      .then(function () {
        console.log('remote description set for : ', peer_id);
      });
  };

  const handleOfferMsg = (msg) => {
    const peer_id = msg['sender_id'];

    console.log(`offer recieved from <${peer_id}>`);

    if (!(peer_id in peerConnections)) {
      createPeerConnection(peer_id);
    } else {
      //   closeConnection(peer_id);
      //   createPeerConnection(peer_id);
      return;
    }
    let desc = new RTCSessionDescription(msg['sdp']);
    peerConnections[peer_id]
      .setRemoteDescription(desc)
      .then(() => {
        console.log('remote description set for : ', peer_id);
        // let local_stream = myVideo.srcObject;
        // if (steams.getTracks().length > 0)
        try {
          steams.getTracks().forEach((track) => {
            peerConnections[peer_id].addTrack(track, steams);
          });
        } catch {}
      })
      .then(() => {
        return peerConnections[peer_id].createAnswer();
      })
      .then((answer) => {
        return peerConnections[peer_id].setLocalDescription(answer);
      })
      .then(() => {
        console.log(`sending answer to <${peer_id}> ...`);
        sendViaServer({
          sender_id: myId,
          target_id: peer_id,
          type: 'answer',
          sdp: peerConnections[peer_id].localDescription,
        });
      })
      .catch(log_error);
    // }
  };

  const handleICECandidateEvent = (event, peer_id) => {
    if (event.candidate) {
      sendViaServer({
        sender_id: myId,
        target_id: peer_id,
        type: 'new-ice-candidate',
        candidate: event.candidate,
      });
    }
  };

  const handleTrackEvent = (event, peer_id) => {
    console.log(`track event recieved from <${peer_id}>`);

    if (event.streams) {
      //   getVideoObj(peer_id).srcObject = event.streams[0];
      console.log(event.streams[0]);
      document.getElementById('vid_' + peer_id).srcObject = event.streams[0];
    }
  };

  const handleNegotiationNeededEvent = useCallback(
    (peer_id) => {
      peerConnections[peer_id]
        .createOffer()
        .then((offer) => {
          return peerConnections[peer_id].setLocalDescription(offer);
        })
        .then(() => {
          console.log(`sending offer to <${peer_id}> ...`);
          sendViaServer({
            sender_id: myId,
            target_id: peer_id,
            type: 'offer',
            sdp: peerConnections[peer_id].localDescription,
          });
        })
        .catch(log_error);
    },
    [myId]
  );

  const createPeerConnection = (peer_id) => {
    let temp = {};
    temp[peer_id] = new RTCPeerConnection(PC_CONFIG);
    temp[peer_id].dupPeer = peer_id + '';
    temp[peer_id].onicecandidate = (event) => {
      handleICECandidateEvent(event, peer_id);
    };
    temp[peer_id].ontrack = function (event) {
      //   handleTrackEvent(event, peer_id);
      // {
      console.log(`track event recieved from <${this.dupPeer}>`);

      if (event.streams && !this.alreadyAdded) {
        //   getVideoObj(peer_id).srcObject = event.streams[0];
        console.log(event.streams[0]);
        document.getElementById('vid_' + this.dupPeer).srcObject =
          event.streams[0];
        this.alreadyAdded = true;
      }
      //   }
    };
    temp[peer_id].onnegotiationneeded = function (evt) {
      //   handleNegotiationNeededEvent(peer_id);
      this.createOffer()
        .then((offer) => {
          return this.setLocalDescription(offer);
        })
        .then(() => {
          console.log(`sending offer to <${peer_id}> ...`);
          sendViaServer({
            sender_id: myId,
            target_id: peer_id,
            type: 'offer',
            sdp: this.localDescription,
          });
        })
        .catch(log_error);
    };
    // if (steams)
    //   steams.getTracks().forEach((track) => {
    //     temp[peer_id].addTrack(track, steams);
    //   });

    // setpeerConnections({ ...peerConnections, ...temp });
    peerConnections = { ...peerConnections, ...temp };
  };

  const invite = useCallback(
    (peer_id) => {
      if (peerConnections[peer_id]) {
        console.log(
          '[Not supposed to happen!] Attempting to start a connection that already exists!'
        );
      } else if (peer_id === '') {
        console.log('[Not supposed to happen!] Trying to connect to self!');
      } else {
        console.log(`Creating peer connection for <${peer_id}> ...`);
        createPeerConnection(peer_id);

        //   let local_stream = myVideo.srcObject;
        if (steams)
          steams.getTracks().forEach((track) => {
            peerConnections[peer_id].addTrack(track, steams);
          });
      }
    },
    [steams, myId]
  );
  const updatePeers = useCallback(
    (peers) => {
      if (steams)
        for (let i of peers) {
          if (previousPeers.includes(i.PeerId)) {
          } else {
            setpreviousPeers([...previousPeers, i.PeerId]);
            // invite(i.PeerId);
          }
        }
    },
    [steams, previousPeers, myId]
  );

  const closeConnection = (peer_id) => {
    if (peer_id in peerConnections) {
      peerConnections[peer_id].onicecandidate = null;
      peerConnections[peer_id].ontrack = null;
      peerConnections[peer_id].onnegotiationneeded = null;

      delete peerConnections[peer_id]; // remove user from user list
    }
  };

  const clearAll = () => {
    for (let peer_id in peerConnections) {
      peerConnections[peer_id].onicecandidate = null;
      peerConnections[peer_id].ontrack = null;
      peerConnections[peer_id].onnegotiationneeded = null;

      delete peerConnections[peer_id]; // remove user from user list
    }
    peerConnections = {};
    steams.getTracks().forEach(function (track) {
      track.stop();
    });
    steams = null;
  };

  return [
    peerConnections,
    updatePeers,
    setsocket,
    setsteams,
    setmyId,
    closeConnection,
    invite,
    clearAll,
  ];
};

export default WebRTCHelper;
