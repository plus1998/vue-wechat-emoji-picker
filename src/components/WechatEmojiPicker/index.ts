import { App } from 'vue';
import WechatEmojiPicker from './index.vue';
WechatEmojiPicker.install = (app: App) => {
    app.component('WechatEmojiPicker', WechatEmojiPicker);
    return app;
}
export default WechatEmojiPicker;