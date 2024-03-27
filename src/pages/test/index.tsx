import React, { useEffect } from "react";
// import { TSDemuxer, ErrCodes } from 'ts-demuxer';
import Hls from 'hls.js';  
import { TSDemux, FLVDemux, MP4Demux, Events } from 'demuxer';
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
            // debug: true
        }); 
        demux.on(Events.DEMUX_DATA, (e:any) => {
            console.log(e);
            const time = e.pes.PTS / 90000;
            let ss = formatSeconds(time);
            console.log(ss);
        });
        
        // 当push进来的数据都解析并吐出后，会产生如下事件。用来告诉使用者数据已经解析完毕
        demux.on(Events.DONE, (e:any) => {
            console.log(e);
            // 数据消耗完毕之后，管道进行了flush动作
        });
        
        const video:any = document.querySelector('video');  
        const hls = new Hls();  
        hls.loadSource('http://172.16.151.204:58080/live/204live03/hls.m3u8');  
        hls.attachMedia(video);  
        hls.on(Hls.Events.MANIFEST_PARSED, () => {  
            video.play();  
        });
        hls.on(Hls.Events.FRAG_LOADED, function (event, data) {
            debugger
            demux.push(data.payload, {
                // 本解码器支持推送部分数据
                // 当done设置为true后，如果数据解码完毕没有剩余数据，则认为数据已经推送完毕，Events.DONE才会发出。
                // 当done设置为false后，Events.DONE不会发出，等待后续数据推送
                done: true
            });
        });       
    }

    return (
        <video controls style={{width: '300px',height:'300px'}} muted id="mse"></video>
    )
}

export default Test;