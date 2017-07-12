import {deepAssign, isObject, isFunction, $} from 'chimee-helper';
import './index.css';

/**
 * 生产一个popup插件配置
 * @param {Object} optons 针对popup扩展了定制化参数，另外也用来重写部分PluginConfig配置
 * @param {String} optons.name 插件名
 * @param {String} optons.tagName Popup DOM容器的tagName
 * @param {String} optons.className Popup DOM容器的className
 * @param {String} optons.title Popup 标题，当设置值为 false 则不渲染title对应DOM
 * @param {String} optons.body Popup 内容，当设置值为 false 则不渲染body对应DOM
 * @param {String} optons.html html 用于构架popup的模板，重写后上面的title、body无效
 * @param {String} optons.offset 设定相对播放器要展示的坐标位置，空格分割的坐标值：'X:left Y:top'||'top right bottom left', 具体的像素百分比值或者auto；实例化后可重写 popupplugin.offset('0 0 0 0')
 * @param {String} optons.offsetAttr offset对应的CSS属性key，默认'left top'、'top right bottom left'-当offset空格分割的参数值多余2个时，便于只设定个别或特定方向边距
 * @param {String} optons.translate 在offset基础上的偏移量，格式如："leftVal topVal"，当offset为50%这里没设定值，则默认偏移-50%；实例化后可重写 popupplugin.translate('0 0')
 * @param {String} optons.width 宽度值（需要带单位）；实例化后可重写 popupplugin.width('100px')
 * @param {String} optons.height 高度值（需要带单位）；实例化后可重写 popupplugin.height('100px')
 * @param {Boolean} optons.hide 初始状态是否设置为关闭，默认值 false
 * @param {Function} optons.opened 开启时执行
 * @param {Function} optons.closed 关闭时执行
 * @param {Boolean} optons.penetrate 是否将交互事件同步到video元素(点击当前popup同样实现video的暂停播放)，默认值 false
 * @param {Boolean} optons.operable 是否启用事件交互（false则设置CSS事件穿透），默认值 true
 * @return {PluginConfig}
 */
export default function popupFactory ({
  tagName = 'chimee-popup',
  className,
  name = 'popup',
  html,
  title = '这是一个信息框',
  body = '这里是信息内容',
  offsetAttr = 'left top', /* 取值范围 top bottom left right */
  offset = '50% 50%', /* 'X:left Y:top'||'top right bottom left', 具体的像素百分比值或者auto*/
  translate = '', /* X Y在offset基础上的偏移量，当offset为50%这里没设定值，则默认偏移-50% */
  width,
  height,
  level,
  init,
  inited,
  data,
  create,
  beforeCreate,
  destroy,
  events,
  computed,
  methods = {},
  penetrate = false, // 是否将交互事件同步到video元素(点击当前popup同样实现video的暂停播放)
  operable = true, // 是否启用事件交互（false则设置CSS事件穿透）
  hide = false, // 默认隐藏（预先创建后，自行控制open时机）
  opened,
  closed,
  autoFocus
} = {}) {
  const defaultConfig = {
    html: html || `
      <cm-pp-close>×</cm-pp-close>
      ${title !== false ? `<cm-pp-head>${title}</cm-pp-head>` : ''}
      ${body !== false ? `<cm-pp-body>${body}</cm-pp-body>` : ''}
    `,
    closeSelector: '._close'
  };

  return {
    name,
    el: tagName,
    className,
    beforeCreate ({events, methods} = {}, option) {
      if (isObject(option)) {
        isObject(option.events) && deepAssign(events, option.events);
        isObject(option.methods) && deepAssign(methods, option.methods);
      }
      beforeCreate && beforeCreate.apply(this, arguments);
    },
    create (...args) {

      const config = isObject(this.$config) ? deepAssign(defaultConfig, this.$config) : defaultConfig;
      const $dom = this.$domWrap = $(this.$dom).css('display', 'none');

      $dom.html(config.html).delegate('cm-pp-close, ' + config.closeSelector, 'click', this.close);

      this.width(width).height(height).offset(offset).translate(translate);

      this._hide = hide;
      create && create.apply(this, args);
      !this._hide && this.open();
    },
    destroy (...args) {
      destroy && destroy.apply(this, args);
      this.$domWrap.undelegate(this.$config.closeSelector, 'click', this.close).remove();
    },
    level,
    init,
    inited,
    data,
    events,
    computed,
    penetrate,
    operable,
    autoFocus,
    methods: deepAssign({
      open (...args) {
        if (this.destroyed) return this;
        this.$domWrap.css('display', 'block');
        this._hide = false;
        this.$emit('popupOpen', args, this);
        isFunction(opened) && opened.apply(this, args);
        return this;
      },
      close (...args) {
        if (this.destroyed) return this;
        this.$domWrap.css('display', 'none');
        this._hide = true;
        this.$emit('popupClose', args, this);
        isFunction(closed) && closed.apply(this, args);
        return this;
      },
      width (width) {
        width && this.$domWrap.css('width', width);
        return this;
      },
      height (height) {
        height && this.$domWrap.css('height', height);
        return this;
      },
      offset (vals) {
        const trblArr = `${vals || ''}`.split(' ');
        const cssObj = {};
        if (trblArr.length > 2) {
          ['top', 'right', 'bottom', 'left'].forEach((dir, i) => {
            if (trblArr[i] && trblArr[i] !== 'auto') {
              cssObj[dir] = trblArr[i];
            }
          });
          this.$domWrap.css(cssObj);
          return this;
        }
        const [left, _top] = trblArr;
        if (left === '') {
          return this;
        }
        const top = _top || left;
        const xyAttr = offsetAttr.split(' ');
        cssObj[xyAttr[0]] = left;
        cssObj[xyAttr[1]] = top;
        this.$domWrap.css(cssObj);

        const translateXY = [];
        if (left === '50%') {
          translateXY.push('-50%');
        }
        if (top === '50%') {
          translateXY.push('-50%');
        }
        translateXY.length > 0 && this.translate(translateXY.join(' '));
        return this;
      },
      translate (xy) {
        const [x, y] = `${xy || ''}`.split(' ');
        x && this.$domWrap.css('transform', `translate(${x}, ${y || x})`);
        return this;
      }
    }, methods)
  };
}
