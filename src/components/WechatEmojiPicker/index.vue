<script setup lang="ts">
import { Ref, ref } from "vue";

interface Size { width: number, height: number }

const props = defineProps({
    scale: {
        type: Number,
        default: 0.5,
    },
});
const emits = defineEmits(["onSelect"]);

// 步进
const singleEmojiSize = 62;
const step: number = singleEmojiSize * props.scale;

// 获取图片大小
const getImgSize = (url: string): Promise<Size> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve({
                width: img.width,
                height: img.height,
            });
        };
        img.onerror = reject;
        img.src = url;
    });
};
// 图片大小
const imgSize: Ref<Size> = ref({ width: 0, height: 0 });

const getEmojiByPosition = (x: number, y: number): string => {
    const emojis: string[][] = [
        ['[微笑]', '[撇嘴]', '[色]', '[发呆]', '[得意]', '[流泪]', '[害羞]', '[闭嘴]', '[睡]', '[大哭]', '[尴尬]'],
        ['[发怒]', '[调皮]', '[呲牙]', '[惊讶]', '[难过]', '[酷]', '[冷汗]', '[抓狂]', '[吐]', '[偷笑]', '[愉快]'],
        ['[白眼]', '[傲慢]', '[饥饿]', '[困]', '[惊恐]', '[流汗]', '[憨笑]', '[悠闲]', '[奋斗]', '[咒骂]', '[疑问]'],
        ['[嘘]', '[晕]', '[疯了]', '[衰]', '[骷髅]', '[敲打]', '[再见]', '[擦汗]', '[抠鼻]', '[鼓掌]', '[糗大了]'],
        ['[坏笑]', '[左哼哼]', '[右哼哼]', '[哈欠]', '[鄙视]', '[委屈]', '[快哭了]', '[阴险]', '[亲亲]', '[吓]', '[可怜]'],
        ['[菜刀]', '[西瓜]', '[啤酒]', '[篮球]', '[乒乓]', '[咖啡]', '[饭]', '[猪头]', '[玫瑰]', '[凋谢]', '[嘴唇]'],
        ['[爱心]', '[心碎]', '[蛋糕]', '[闪电]', '[炸弹]', '[刀]', '[足球]', '[瓢虫]', '[便便]', '[月亮]', '[太阳]'],
        ['[礼物]', '[拥抱]', '[强]', '[弱]', '[握手]', '[胜利]', '[抱拳]', '[勾引]', '[拳头]', '[差劲]', '[爱你]'],
        ['[NO]', '[OK]', '[爱情]', '[飞吻]', '[跳跳]', '[发抖]', '[怄火]', '[转圈]', '[磕头]', '[回头]', '[跳绳]'],
        ['[投降]', '[Hooray]', '[Meditate]', '[Smooch]', '[TaiChi L]', '[TaiChi R]']
    ];

    const adjustedX = Math.floor(x / step);
    const adjustedY = Math.floor(y / step);
    if (
        adjustedX < 0 ||
        adjustedY < 0 ||
        adjustedX >= emojis[0].length ||
        adjustedY >= emojis.length
    ) {
        return '无效的坐标';
    }
    return emojis[adjustedY][adjustedX];
}

const emojiIcons = ref(null as unknown as HTMLImageElement);
const onClickEmoji = (e: MouseEvent) => {
    const rect = emojiIcons.value.getBoundingClientRect(); // 获取按钮元素的位置信息
    const x = e.clientX - rect.left; // 计算相对元素的水平位置
    const y = e.clientY - rect.top; // 计算相对元素的垂直位置
    emits("onSelect", getEmojiByPosition(x, y));
}

let lastEmoji: string;
const onMouseMove = (e: MouseEvent) => {
    const rect = emojiIcons.value.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const emoji = getEmojiByPosition(x, y);
    if (lastEmoji === emoji) {
        return;
    }
    lastEmoji = emoji;
    // 在鼠标上方显示文字
    const emojiPreview = document.getElementById('emoji-preview');
    if (!emojiPreview) {
        return;
    }
    if (!emoji) {
        emojiPreview.style.display = 'none';
        return;
    }
    emojiPreview.innerHTML = emoji;
    emojiPreview.style.display = 'block';
    emojiPreview.style.left = `${e.clientX + 10}px`;
    emojiPreview.style.top = `${e.clientY + 10}px`;
}

// 初始化
const emojiIconsSrc: Ref<string> = ref('');
const init = async () => {
    const { default: srcPath } = await import('../../assets/wechat-emoticons.png');
    emojiIconsSrc.value = srcPath;
    const emojiIconsSize = await getImgSize(emojiIconsSrc.value);
    imgSize.value.width = emojiIconsSize['width'] * props.scale;
    imgSize.value.height = emojiIconsSize['height'] * props.scale;
}
init()
</script>

<template>
    <div>
        <img ref="emojiIcons" :src="emojiIconsSrc" @mousemove="onMouseMove" @click="onClickEmoji"
            :style="`width: ${imgSize.width}px; height: ${imgSize.height}px`" />
        <div id="emoji-preview"></div>
    </div>
</template>

<style scoped>
#emoji-preview {
    position: fixed;
    display: none;
    color: white;
    background-color: black;
    padding: 2px 5px;
    border-radius: 5px;
    z-index: 1;
}
</style>
