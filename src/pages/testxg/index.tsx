import React, { useEffect } from "react";
import Player from 'xgplayer';
import 'xgplayer/dist/index.min.css';
import HlsJsPlugin from 'xgplayer-hls.js'
import { TSDemux, FLVDemux, MP4Demux,Events} from 'demuxer';

const Test = () => {

    useEffect(() => {
        init();
    }, []);

    // 秒换算成时分秒
    const formatSeconds = (value: number) => {
        let theTime = parseInt(value.toString());// 秒
        let theTime1 = 0;// 分
        let theTime2 = 0;// 小时
        if (theTime > 60) {
            theTime1 = parseInt((theTime / 60).toString());
            theTime = parseInt((theTime % 60).toString());
            if (theTime1 > 60) {
                theTime2 = parseInt((theTime1 / 60).toString());
                theTime1 = parseInt((theTime1 % 60).toString());
            }
        }
        let result = "" + parseInt(theTime).toString() + "秒";
        if (theTime1 > 0) {
            result = "" + parseInt(theTime1).toString() + "分" + result;
        }
        if (theTime2 > 0) {
            result = "" + parseInt(theTime2).toString() + "小时" + result;
        }
        return result;
    }


    const init = () =>{
        
        const demux = new TSDemux({
            debug: true
        }); 
        demux.on(Events.DEMUX_DATA, (e) => {
            console.log(e);
            const time = e.pes.PTS / 90000;
            let ss = formatSeconds(time);
            console.log(ss);
        });
        
        // 当push进来的数据都解析并吐出后，会产生如下事件。用来告诉使用者数据已经解析完毕
        demux.on(Events.DONE, (e) => {
            console.log(e);
            // 数据消耗完毕之后，管道进行了flush动作
        });
        let player = new Player({
            id: 'mse',
            url: 'https://cn-sdqd-cu-01-06.bilivideo.com/live-bvc/642696/live_503782061_65506909/index.m3u8?expires=1709546721&len=0&oi=3664301426&pt=web&qn=0&trid=10070ba00740af0b4ea5bbd1516ee4a56949&sigparams=cdn,expires,len,oi,pt,qn,trid&cdn=cn-gotcha01&sign=8e0d4e9b228d35bc28bbb95ca123269a&sk=1e583ec9e8478a2cae9397c7e5071e20&flvsk=bacac081f032cdba7074eeb756c53841&p2p_type=1&sl=1&free_type=0&mid=485321736&sid=cn-sdqd-cu-01-06&chash=1&bmt=1&sche=ban&bvchls=1&score=2&pp=rtmp&source=onetier&trace=10a9&site=00d6ead4836eeb47a0eb494f6b397605&qp=de_0&zoneid_l=151404546&sid_l=stream_name_cold&order=1',
            height: '300px',
            width: '300px',
            isLive: true,
            autoplay: true,
            plugins: [HlsJsPlugin],
            hlsJsPlugin:{
                hlsOpts:{
                    enableWorker: false,
                }
            }
        });
        player.on('loadeddata', () => {
           player.play();
           player.plugins.hlsjsplugin.hls.on('hlsFragLoaded', function (event, data) {
                console.log(event, data);
                demux.push(data.payload, {
                    // 本解码器支持推送部分数据
                    // 当done设置为true后，如果数据解码完毕没有剩余数据，则认为数据已经推送完毕，Events.DONE才会发出。
                    // 当done设置为false后，Events.DONE不会发出，等待后续数据推送
                    done: true
                });
           });
        })       
        // 开始拉流或者后续播放阶段时获取
        // player.on('core_event', ({ eventName, ...rest }) => { // eventName: hls 事件名; rest: hls 事件回调函数参数
        //     console.log(eventName, rest);
        // })
      
    }

    return (
        // <video controls style={{width: '300px',height:'300px'}} muted id="mse"></video>
        <div style={{width: '300px',height:'300px'}}  id="mse"></div>
    )
}

export default Test;