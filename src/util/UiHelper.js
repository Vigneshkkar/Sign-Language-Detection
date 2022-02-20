import { useRef } from 'react';

const UiHelper = () => {
  const videoGrid = useRef(null);

  const makeVideoElement = (element_id, display_name) => {
    let wrapper_div = document.createElement('div');
    let vid_wrapper = document.createElement('div');
    let vid = document.createElement('video');
    let name_text = document.createElement('div');

    wrapper_div.id = 'div_' + element_id;
    vid.id = 'vid_' + element_id;

    wrapper_div.className = 'shadow video-item';
    vid_wrapper.className = 'vid-wrapper';
    name_text.className = 'display-name';

    vid.autoplay = true;
    name_text.innerText = display_name;

    vid_wrapper.appendChild(vid);
    wrapper_div.appendChild(vid_wrapper);
    wrapper_div.appendChild(name_text);

    return wrapper_div;
  };

  const addVideoElement = (element_id, display_name) => {
    videoGrid.current.appendChild(makeVideoElement(element_id, display_name));
  };

  const getVideoObj = (element_id) => {
    return document.getElementById('vid_' + element_id);
  };
  const removeVideoElement = (element_id) => {
    let v = getVideoObj(element_id);
    if (v.srcObject) {
      v.srcObject.getTracks().forEach((track) => track.stop());
    }
    v.removeAttribute('srcObject');
    v.removeAttribute('src');

    document.getElementById('div_' + element_id).remove();
  };

  return [videoGrid, addVideoElement, getVideoObj, removeVideoElement];
};

export default UiHelper;
