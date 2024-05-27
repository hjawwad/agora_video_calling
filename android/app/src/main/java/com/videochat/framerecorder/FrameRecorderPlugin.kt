package com.videochat.framerecorder

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.media.Image
import android.util.Log
import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
import com.mrousavy.camera.frameprocessors.VisionCameraProxy
import com.visioncameraresizeplugin.ResizePlugin

class FrameRecorderPlugin(proxy: VisionCameraProxy, options: Map<String, Any>?): FrameProcessorPlugin() {
  override fun callback(frame: Frame, params: Map<String, Any>?): Any? {
    Log.d("CALLED REACRDER PLUGIN ", " CALLBACK")
    return "RECORDED FRAME"
  }

    companion object {
        @Volatile
        private var INSTANCE: FrameRecorderPlugin? = null

        fun getInstance(proxy: VisionCameraProxy, options: Map<String, Any>?): FrameRecorderPlugin {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: FrameRecorderPlugin(proxy, options).also { INSTANCE = it }
            }
        }
    }
}