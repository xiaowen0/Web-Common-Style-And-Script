# 音频播放器 API 文档 #

---

### 创建方法 ###

createAudioPlayer()

返回一个对象

---

### AudioPlayer 对象属性 ###

**el**: Object  默认是一个 Audio 元素对象，包含 autoplay 和 preload 属性。

---

### AudioPlayer 对象方法 ###

###### **init(options)**: 初始化方法 ######

options: Object  初始化配置

###### **setController(audioElement)**: 设置新的 Audio 元素 ######

###### **setAudio(url)**: 设置新的音频文件 ######

###### **play()**: 播放音频 ######

成功返回 true，否则返回 false，有些浏览器会阻止自动播放。

###### **pause()**: 暂停播放 ######

###### **getStatus()**: 获取播放状态，返回布尔值。 ######

###### **toggle()**: 切换播放状态，返回布尔值。 ######

###### **getCurrentTime()**: 获取当前时间，单位是秒，数据类型是浮点数。 ######

###### **setCurrentTime(second)**: 设置新的当前时间。 ######

