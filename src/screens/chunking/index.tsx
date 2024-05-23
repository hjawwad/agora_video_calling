import React, {useEffect, useRef, useState} from 'react';
import {View, Button, Platform} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {runOnJS} from 'react-native-reanimated';
import RNFS from 'react-native-fs';
import {FFmpegKit} from 'ffmpeg-kit-react-native';
// import {FFmpeg} from '@ffmpeg/ffmpeg';

const Chunking = () => {
  const camera = useRef(null);
  const device = useCameraDevice('front');

  const [isRecording, setIsRecording] = useState(false);
  const [frames, setFrames] = useState<any>([]);
  const [chunkStartTime, setChunkStartTime] = useState(Date.now());
  const chunkDuration = 6000; // 6 seconds

  // const ffmpeg = new FFmpeg();

  useEffect(() => {
    const requestCameraPermission = async () => {
      const status = await Camera.requestCameraPermission();
      console.log('Camera permission status:', status);
    };

    requestCameraPermission();
  }, []);

  const frameProcessor = useFrameProcessor(frame => {
    const currentTime = Date.now();
    if (isRecording) {
      setFrames((prevFrames: any) => [...prevFrames, frame]);

      if (currentTime - chunkStartTime >= chunkDuration) {
        createVideoChunk(frames);

        setFrames([]);
        setChunkStartTime(currentTime);
      }
    }
  }, []);

  const startRecording = async () => {
    setIsRecording(true);
    setChunkStartTime(Date.now());
    setFrames([]);
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Process any remaining frames
    if (frames.length > 0) {
      createVideoChunk(frames);
      setFrames([]);
    }
  };

  const createVideoChunk = Worklets.createRunOnJS(async (frames: any) => {
    console.log('coming herer', frames);
    // Convert frames to video
    // const fileName = `${Date.now()}.mp4`;
    // const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    // if (!ffmpeg.loaded) {
    //   await ffmpeg.load();
    // }
    // const inputFrames = frames.map((frame: any, index: any) => ({
    //   path: `${RNFS.CachesDirectoryPath}/frame_${index}.jpg`,
    //   data: frame.data,
    // }));
    // for (const frame of inputFrames) {
    //   await RNFS.writeFile(frame.path, frame.data, 'base64');
    // }
    // const inputPaths = inputFrames.map((frame: any) => frame.path).join('|');
    // await ffmpeg.exec([
    //   `-i ${inputPaths} -vcodec libx264 -pix_fmt yuv420p ${filePath}`,
    // ]);
    // // Clean up frame files
    // for (const frame of inputFrames) {
    //   await RNFS.unlink(frame.path);
    // }
    // // Create low-res version
    // const lowResFilePath = `${
    //   RNFS.DocumentDirectoryPath
    // }/${Date.now()}_low.mp4`;
    // await FFmpegKit.execute(
    //   `-i ${filePath} -vf scale=320:240 ${lowResFilePath}`,
    // );
    // console.log('High-res video saved to:', filePath);
    // console.log('Low-res video saved to:', lowResFilePath);
    // // Upload low-res file to Agora or your streaming service
    // await uploadToAgora(lowResFilePath);
    // // Handle video files (e.g., upload hi-res for later processing)
    // await uploadHighRes(filePath);
  });

  const uploadToAgora = async (filePath: any) => {
    // Implement the logic to upload the low-res file to Agora
    console.log('Uploading to Agora:', filePath);
  };

  const uploadHighRes = async (filePath: any) => {
    // Implement the logic to upload the high-res file to your storage
    console.log('Uploading high-res video:', filePath);
  };

  if (device == null) return <View />;

  return (
    <View style={{flex: 1}}>
      <Camera
        ref={camera}
        style={{flex: 1}}
        device={device}
        isActive={true}
        video={true}
        frameProcessor={frameProcessor}
      />
      <Button title="Start Recording" onPress={startRecording} />
      <Button title="Stop Recording" onPress={stopRecording} />
    </View>
  );
};

export default Chunking;
