# popup demo of Chimee

> 可用以继承实现各种内容展示弹层交互需求

## 开始
开始使用前，需要先在页面中引入`popup.js`插件模块。
```html
<script type="text/javascript" src="./lib/index.browser.js"></script>
```
> JS模块引入后，将在全局产生一个用来生成popup `pluginConfig` 的工厂函数 `window.chimeePluginPopup`，调用该函数传入相应参数即可得到目标`popupPluginConfig`。

或者JS代码中
```javascript
import chimeePluginPopup from './lib/index.js';
```


> 通过`Chimee.install(popupPluginConfig)`把插件注册到`Chimee`类，即可在实例化播放器时在`option.plugin`数组上设定`popupPlugin`对应的name来启用UI组件。

我们用来实现一个居中弹层，使用方式示例：
```javascript
Chimee.install(chimeePluginPopup({
  name: 'cc_popup',
  title: '这是一个居中信息框',
  body: '这里是信息内容',
  offset: '50% 50%',
  width: '200px'
}));
const player = new Chimee({
  src: 'http://cdn.toxicjohann.com/lostStar.mp4',
  type: 'vod',
  box: 'mp4',
  wrapper: '#wrapper',
  plugin: ['cc_popup'],
  runtimeOrder: ['html5', 'flash'],
  auto: true
});
```

## 效果
  
  ![](http://p6.qhimg.com/dr/600__/t01c55babd4ae6974e5.png)
  
## 基本参数说明
  
可以配置设定的参数除了`pluginConfig`包含内容之外，你可能会比较容易用到的几组参数：
 
### 声明
  1. **name** 用来绑定实例化后的插件到Chimee实例上。<br>*比如上面代码示例中使用了`cc_popup`作为插件名字，那么在接下来就可以通过 `player.ccPopup` 来访问插件实例（注册时自动驼峰化）。*
### 坐标尺寸控制
  1. **offset** 控制popup的展示位置。 <br>*相对播放器区域四个边界的距离，可设定内容`像素:123px`或`百分比:12.3%`值，如：`0px 0px`、`10% 20%`。<br>设定方式支持: `'leftAndTop'`或`'left top'`或`'top right bottom left'`*
  2. **translate** 控制popup的偏移坐标。<br>*基于offset设定后的位置进行偏移，比如当offset的top或left为50%时，将默认translate相应方向为-50，以实现居中展示，数值设定规则与offset相同。*
  3. **width** 控制popup宽度，不设置则为auto，参数值必须带有单位
  4. **height** 控制popup高度，同上
### 展现内容
  1. **title** 默认浮层标题
  2. **body** 默认浮层展示的内容
  3. **html** 浮层UI对应的HTML模板，默认为：
    
```
<vs-pp-close class="_close">×</vs-pp-close>
<vs-pp-head>${title}</vs-pp-head>
<vs-pp-body>${body}</vs-pp-body>
```

### 状态控制
  1. **penetrate** 是否将交互事件同步到video元素(事件交互同步给video)，默认值false
  2. **operable** 是否启用事件交互（false则设置CSS事件穿透），默认 true
  3. **hide** 插件装载后是否默认为不展示（预先创建后，自行控制open时机），默认值 false
### 事件交互 
  **events** 用来实现交互控制，比如我们要通过右键控制popup的展示隐藏、位置移动，可以这么写：

```javascript
Chimee.install(chimeePluginPopup({
  name: 'menu_popup',
  ...
  hide: true,
  events: {
    contextmenu: function(e) {
      this.offset(e.offsetX + 'px ' + e.offsetY + 'px').open(e);
      e.preventDefault();
    },
    mousedown: function(e){
      e.button !==2 && this.close(e)
    }
  }
}));
```

比如我们要感知popup的开启关闭，做相应后续逻辑执行，可以使用popup实现时新增的生命周期钩子：

```javascript
Chimee.install(chimeePluginPopup({
  name: 'my_popup',
  ...
  opened(e, pluginTarget) {
    ...
  },
  closed (e, pluginTarget) {
    ...
  }
}));
```

如果想监听任意弹层组件的关闭，可以使用事件监听这么写：

```javascript
Chimee.install(chimeePluginPopup({
  name: 'my_popup',
  ...
  events: {
    popupOpen: function (e, pluginTarget) {
      if(this.__id === pluginTarget.__id){
        console.log('popupOpen:', e, this, pluginTarget);
      }
    },
    popupClose: function (e, pluginTarget) {
      if (this.__id === pluginTarget.__id) {
        console.log('popupClose:', e, this, pluginTarget);
      }
    }
  }
}));
```

也许你已经留意到了上面`if(this.__id === pluginTarget.__id)`的判断，这里因为 **events** 是针对全局范围任意插件或系统事件的监听（包括播放器本身的play、ended、pause、volumechange...），所以这里可以通过判断确定事件发出自哪个插件。


