import { WS_ADDRESS } from "../utils";
import store from "@/store";
import { ALREADY_READ, ATTENTION, COMMENT, INTERACTIVE, LIKE, PUBLISH, RingingToneList, SoketUrl, USER_MESSAGE, WITHDRAW } from "./message"

var ws = null
const wsUrl = WS_ADDRESS

function useWebSocket() {
    createWebSocket(WS_ADDRESS);

    var lockReconnect = false;  //避免ws重复连接

    function initEventHandle() {
        // ws.onclose = function (event) {
        //     reconnect(wsUrl);
        //     console.log("连接关闭!" + event);
        // };
        // ws.onerror = function () {
        //     // reconnect(wsUrl);
        //     console.log("连接错误!");
        // };
        ws.onopen = function (event) {
            heartCheck.reset().start();      //心跳检测重置
            console.log("连接成功!" + WS_ADDRESS);
        };
        ws.onmessage = function (event) {    //如果获取到消息，心跳检测重置
            heartCheck.reset().start();      //拿到任何消息都说明当前连接是正常的
            console.log("收到消息啦:" + event.data);
            let socketResult = JSON.parse(event.data)

            if (socketResult.type === USER_MESSAGE || socketResult.type === WITHDRAW) {//类型是消息，包括撤回和普通消息
                let new_message = JSON.parse(event.data);
                store.commit("saveChatRecord", new_message);
                store.dispatch('getChatRecord', new_message.data.fromUserId)

            } else if (socketResult.type === INTERACTIVE) {//收到的是互动消息类型
                let new_message = JSON.parse(event.data)
                let type = new_message.data.type

                let title = ''
                if (type === 'COMMENT') {
                    console.log('comment')
                    title = '评论'
                } else if (type === 'LIKE') {
                    title = '喜欢'

                } else if (type === 'ATTENTION') {
                    title = '关注'
                } else if (type === 'PUBLISH') {
                    title = '发布'
                }

                var note = `${new_message.data.username}${title}${title === '发布' ? '了一条新动态' : title === '关注' ? '了你' : '了你的动态'
                    }`
                store.commit('saveNote', note)
            }
            ;
        }
    }
    function createWebSocket(url) {
        try {
            if ('WebSocket' in window) {
                ws = new WebSocket(url);
            } else if ('MozWebSocket' in window) {
                ws = new MozWebSocket(url);
            } else {
                layui.use(['layer'], function () {
                    var layer = layui.layer;
                    layer.alert("您的浏览器不支持websocket协议,建议使用新版谷歌、火狐等浏览器，请勿使用IE10以下浏览器，360浏览器请使用极速模式，不要使用兼容模式！");
                });
            }
            initEventHandle();
        } catch (e) {
            reconnect(url);
            console.log(e);
        }
    }

    window.onbeforeunload = function () {
        ws.close();
    }

    function reconnect(url) {
        if (lockReconnect) return;
        lockReconnect = true;
        setTimeout(function () {     //没连接上会一直重连，设置延迟避免请求过多
            createWebSocket(url);
            lockReconnect = false;
        }, 2000);
    }

    var heartCheck = {
        timeout: 540000,        //9分钟发一次心跳
        timeoutObj: null,
        serverTimeoutObj: null,
        reset: function () {
            clearTimeout(this.timeoutObj);
            clearTimeout(this.serverTimeoutObj);
            return this;
        },
        start: function () {
            var self = this;
            this.timeoutObj = setTimeout(function () {
                //这里发送一个心跳，后端收到后，返回一个心跳消息，
                //onmessage拿到返回的心跳就说明连接正常
                ws.send("ping");
                console.log("ping!")
                self.serverTimeoutObj = setTimeout(function () {//如果超过一定时间还没重置，说明后端主动断开了
                    ws.close();     //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
                }, self.timeout)
            }, this.timeout)
        },
    }

    return ws;
}
export default useWebSocket;