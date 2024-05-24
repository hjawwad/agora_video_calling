package com.videochat.framerecorder

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.util.Log
import android.app.Activity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
import com.mrousavy.camera.frameprocessors.VisionCameraProxy
import com.visioncameraresizeplugin.ResizePlugin
import io.agora.rtc2.Constants
import io.agora.rtc2.IRtcEngineEventHandler
import io.agora.rtc2.RtcEngine
import io.agora.rtc2.*∂

object FrameRecorderPlugin(proxy: VisionCameraProxy, options: Map<String, Any>?): FrameProcessorPlugin() {
    private var TAG = "FrameRecorderPlugin"
    private var PERMISSION_REQ_ID = 22
    private var REQUESTED_PERMISSIONS = arrayOf(
        Manifest.permission.RECORD_AUDIO,
        Manifest.permission.CAMERA
    )
    private var agoraEngine: RtcEngine? = null
    
    private lateinit var mContext: Context
    private lateinit var channelName: String
    private var localUid: Int = 0
    private var isJoined = false
    private var isBroadcaster = true

    fun init(context: Context) {
        mContext = context
        checkSelfPermission()
    }

    private fun checkSelfPermission() {
        if (ContextCompat.checkSelfPermission(
                mContext,
                REQUESTED_PERMISSIONS[0]
            ) != PackageManager.PERMISSION_GRANTED ||
            ContextCompat.checkSelfPermission(
                mContext,
                REQUESTED_PERMISSIONS[1]
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(
                mContext as Activity,  // Pass Activity reference here
                REQUESTED_PERMISSIONS,
                PERMISSION_REQ_ID
            )
        } else {
            setupAgoraEngine()
        }
    }

    private fun setupAgoraEngine() {
        try {
            var config = RtcEngineConfig()
            config.mContext = mContext
            config.mAppId = "your_agora_app_id"
            config.mEventHandler = iRtcEngineEventHandler
            agoraEngine = RtcEngine.create(config)
            agoraEngine?.enableVideo()
        } catch (e: Exception) {
            Log.e(TAG, "Error initializing Agora Engine: ${e.message}")
        }
    }

    fun joinChannel(channelName: String, token: String?): Int {
        // Ensure that necessary Android permissions have been granted
        // if (checkSelfPermission()) {
        //     sendMessage("Permissions were not granted")
        //     return -1
        // }
        this.channelName = channelName

        if (agoraEngine == null) setupAgoraEngine()

        var options = ChannelMediaOptions()

        options.channelProfile = Constants.CHANNEL_PROFILE_COMMUNICATION
        options.clientRoleType = Constants.CLIENT_ROLE_BROADCASTER
        agoraEngine!!.startPreview()

        agoraEngine!!.joinChannel(token, channelName, localUid, {})
        return 0
    }


    // protected open val iRtcEngineEventHandler: IRtcEngineEventHandler?
    // get() = object : IRtcEngineEventHandler() {
    //     override fun onUserJoined(uid: Int, elapsed: Int) {
    //         // sendMessage("Remote user joined $uid")
    //         remoteUids.add(uid)
    //         if (isBroadcaster && (currentProduct == ProductName.INTERACTIVE_LIVE_STREAMING
    //                     || currentProduct == ProductName.BROADCAST_STREAMING)
    //         ) {
    //         } else {
    //             setupRemoteVideo(uid)
    //         }
    //     }

    //     override fun onJoinChannelSuccess(channel: String, uid: Int, elapsed: Int) {
    //         isJoined = true
    //         sendMessage("Joined Channel $channel")
    //         localUid = uid
    //         mListener!!.onJoinChannelSuccess(channel, uid, elapsed)
    //     }

    //     override fun onUserOffline(uid: Int, reason: Int) {
    //         sendMessage("Remote user offline $uid $reason")
    //         remoteUids.remove(uid)
    //         mListener!!.onRemoteUserLeft(uid)
    //     }

    //     override fun onError(err: Int) {
    //         when (err) {
    //             ErrorCode.ERR_TOKEN_EXPIRED -> sendMessage("Your token has expired")
    //             ErrorCode.ERR_INVALID_TOKEN -> sendMessage("Your token is invalid")
    //             else -> sendMessage("Error code: $err")
    //         }
    //     }
    // }


    override fun callback(frame: Frame, params: Map<String, Any>?): Any? {
        // Process video frame here
        init()
        return "RECORDED FRAME"
    }
}
