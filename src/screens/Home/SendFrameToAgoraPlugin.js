import { VisionCameraProxy, Frame } from 'react-native-vision-camera'

const plugin = VisionCameraProxy.initFrameProcessorPlugin('sendFrame')

/**
 * Scans faces.
 */
export function sendFrame(frame) {
  'worklet'
  if (plugin == null) throw new Error('Failed to load Frame Processor Plugin "scanFaces"!')

  return plugin.call(frame)
}