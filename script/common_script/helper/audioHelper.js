/**
 *
 */
import domHelper from './domHelper';
import consoleHelper from './consoleHelper';

export default {
    createAudioPlayer : function (){
        var audioPlayer = {
            el : domHelper.createElement('audio', {
                autoplay : true,
                preload : true,
                muted : false
            }),
            networkStateMap : {
                0 : '音频/视频尚未初始化',                               // NETWORK_EMPTY
                1 : '音频/视频是活动的且已选取资源，但并未使用网络',   // NETWORK_IDLE
                2 : '浏览器正在下载数据',                                // NETWORK_LOADING
                3 : '未找到音频/视频来源'                                // NETWORK_NO_SOURCE
            },
            playlist : [
                // data structure:
                // {
                //     title : '',
                //     artist : '',
                //     path : ''
                // }
            ],
            currentPlayIndex : 0,
            init : function (options){

                var me = this;
                var loadedmetadata  = options.loadedmetadata || null;
                var timeupdate      = options.timeupdate || null;
                var ended           = options.ended || (function(){

                });
                var error           = options.error || null;
                var canplaythrough  = options.canplaythrough || null;
                if (loadedmetadata)
                {
                    this.el.addEventListener("loadedmetadata", loadedmetadata);
                }
                if (timeupdate)
                {
                    this.el.addEventListener("timeupdate", timeupdate);
                }
                if (ended)
                {
                    this.el.addEventListener("ended", ended);
                }
                if (canplaythrough)
                {
                    this.el.addEventListener("canplaythrough", canplaythrough);
                }
                else {
                    if (this.el.autoplay)
                    {
                        this.el.addEventListener("canplaythrough", function (){
                            me.play();
                        });
                    }
                }
                if (error)
                {
                    this.el.addEventListener("error", error);
                }
                else
                {
                    this.el.addEventListener.on("error", function(errorEvent){
                        consoleHelper.logDebug(errorEvent);
                        consoleHelper.logError('An error occurred: ');
                        consoleHelper.log('  current source url: ' + this.currentSrc);
                        consoleHelper.log('  current time: ' + this.currentTime);
                        var networkStatus = this.networkState;
                        if (typeof(me.networkStateMap[networkStatus]) != 'undefined')
                        {
                            consoleHelper.log('  network status: ' + me.networkStateMap[networkStatus]);
                        }
                    });
                }
            },
            /**
             * set a new controller
             * @param  Object(AudioHTMLElement)  audioElement
             */
            setController : function (audioElement){
                this.el = audioElement;
            },
            addAudio : function (item) {
                this.playlist.push(item);
            },
            cleanPlaylist : function () {
                this.playlist = [];
            },
            /**
             * set audio file
             * @param  String  url
             */
            setAudio : function (url){
                this.pause();
                this.el.src = url;
                this.play();
            },
            /**
             * play audio
             * @return  {boolean}
             */
            play : function (){

                if (!this.el.paused)
                {
                    return true;
                }

                // try to play
                try
                {
                    this.el.play();
                }
                catch (e)
                {
                    // play fail
                    return false;
                }

                // check play status, some browser not allow auto play.
                if (this.el.paused) {
                    // play fail
                    return false;
                }

                return true;
            },
            playNext : function () {
                if (this.playlist.length < 1)
                {
                    return;
                }
                if (this.currentPlayIndex + 1 >= this.playlist.length)
                {
                    this.currentPlayIndex = 0;
                }
                else
                {
                    this.currentPlayIndex++;
                }

                this.setAudio(this.playlist[this.currentPlayIndex].path);
                this.play();
            },
            /**
             * pause audio
             * @return  {boolean}
             */
            pause : function()
            {
                if (this.paused)
                {
                    return true;
                }

                // try to pause
                this.el.pause();

                // check play status
                if (!this.el.paused) {
                    // still playing, pause fail
                    return false;
                }

                return true;
            },

            /**
             * get music play status
             * @return  boolean
             */
            getStatus : function()
            {
                // return status
                return !this.el.paused;
            },

            /**
             * toggle play status
             * @return  boolean
             */
            toggle : function()
            {
                // check status
                if (this.getStatus()) {
                    // playing then pause
                    return this.pause();
                }
                else {
                    // pausing then play
                    return this.play();
                }
            },

            getCurrentTime : function (){
                return this.el.currentTime;
            },
            setCurrentTime : function (second) {
                this.el.currentTime = second;
            }
        };  // end audioPlayer object define

        return audioPlayer;
    }
};
