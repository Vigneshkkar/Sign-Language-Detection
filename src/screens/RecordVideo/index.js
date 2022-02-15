import { useState } from 'react';
import RecordVideoScreen from './RecordVideoScreen';

import { SaveServices } from '../../services';

const RecordVideo = () => {
  const [saving, setsaving] = useState(false);
  const [error, seterror] = useState(false);
  const data = (data, word) => {
    setsaving(true);
    seterror(false);
    const size = new TextEncoder().encode(JSON.stringify(data)).length;
    const kiloBytes = size / 1024;
    const megaBytes = kiloBytes / 1024;
    console.log(megaBytes);
    SaveServices.saveData({ word: word, data: data })
      .then((data) => {
        setsaving(false);
      })
      .catch((err) => {
        seterror(true);
        setsaving(false);
      });
  };

  return (
    <RecordVideoScreen
      collectionCompleted={data}
      isSaving={saving}
      isError={error}
    />
  );
};

export default RecordVideo;
