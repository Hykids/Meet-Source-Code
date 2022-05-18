import store from "@/store"

const BASE_URL = 'buguxingqiu.xyz/webSocketServer'
var TOKEN = store.state.token

export const WS_ADDRESS = "wss://buguxingqiu.xyz/webSocketServer/" + TOKEN