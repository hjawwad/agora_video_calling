package com.videochat.framerecorder

import android.util.Log

import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
import com.mrousavy.camera.frameprocessors.VisionCameraProxy

class FrameRecorderPlugin private constructor(private val proxy: VisionCameraProxy, private val options: Map<String, Any>?) : FrameProcessorPlugin() {
   fun init() {}
    override fun callback(frame: Frame, params: Map<String, Any>?): Any? {
        Log.d("CALLED RECORDER PLUGIN", "CALLBACK")
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

