export const getKeyPoints = (res) => {
  const posemark = res.poseLandmarks
    ? res.poseLandmarks.map((o) => [o.x, o.y, o.z, o.visibility]).flat()
    : new Array(33 * 4).fill(0);
  const lh = res.leftHandLandmarks
    ? res.leftHandLandmarks.map((o) => [o.x, o.y, o.z]).flat()
    : new Array(21 * 3).fill(0);
  const rh = res.rightHandLandmarks
    ? res.rightHandLandmarks.map((o) => [o.x, o.y, o.z]).flat()
    : new Array(21 * 3).fill(0);
  const face = res.faceLandmarks
    ? res.faceLandmarks.map((o) => [o.x, o.y, o.z]).flat()
    : new Array(468 * 3).fill(0);

  return [...posemark, ...lh, ...rh, ...face];
};
