import styles from './index.module.scss';
import Muted from '../../assets/muted.svg';
import Unmuted from '../../assets/unmuted.svg';
import VideoOn from '../../assets/video.svg';
import VideoOff from '../../assets/video-off.svg';

const VideoControls = ({ muted, videoOn, setmuted, setvideoOn }) => {
  return (
    <div className={styles.container}>
      <div onClick={() => setmuted(!muted)}>
        {muted ? <img src={Muted} /> : <img src={Unmuted} />}
      </div>
      <div onClick={() => setvideoOn(!videoOn)}>
        {videoOn ? <img src={VideoOn} /> : <img src={VideoOff} />}
      </div>
    </div>
  );
};

export default VideoControls;
