
/**
 * chimee-plugin-popup v0.0.1
 * (c) 2017 huzunjie
 * Released under ISC
 */

function __$styleInject(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  head.appendChild(style);
  return returnValue;
}

import _slicedToArray from 'babel-runtime/helpers/slicedToArray';
import { $, deepAssign, isFunction, isObject } from 'chimee-helper';

__$styleInject("chimee-popup{position:absolute;color:#fff;background-color:rgba(88,88,88,.5);font-size:13px;font-family:sans-serif;border:1px solid hsla(0,0%,100%,.08);padding:3px}chimee-popup cm-pp-close{float:right;color:#fff;text-decoration:none;opacity:.8;line-height:14px;text-shadow:0 0 1px #000;font-size:15px;padding:0 3px;cursor:pointer}chimee-popup cm-pp-close:hover{opacity:1}chimee-popup cm-pp-body,chimee-popup cm-pp-head{display:block;padding:3px 3px 6px}chimee-popup cm-pp-head{font-weight:700;border-bottom:1px solid hsla(0,0%,100%,.18);padding:0 5px 4px;margin-bottom:5px}chimee-popup cm-pp-body{font-size:12px}", undefined);

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
function popupFactory() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$tagName = _ref.tagName,
      tagName = _ref$tagName === undefined ? 'chimee-popup' : _ref$tagName,
      className = _ref.className,
      _ref$name = _ref.name,
      name = _ref$name === undefined ? 'popup' : _ref$name,
      html = _ref.html,
      _ref$title = _ref.title,
      title = _ref$title === undefined ? '这是一个信息框' : _ref$title,
      _ref$body = _ref.body,
      body = _ref$body === undefined ? '这里是信息内容' : _ref$body,
      _ref$offsetAttr = _ref.offsetAttr,
      offsetAttr = _ref$offsetAttr === undefined ? 'left top' : _ref$offsetAttr,
      _ref$offset = _ref.offset,
      offset = _ref$offset === undefined ? '50% 50%' : _ref$offset,
      _ref$translate = _ref.translate,
      translate = _ref$translate === undefined ? '' : _ref$translate,
      width = _ref.width,
      height = _ref.height,
      level = _ref.level,
      init = _ref.init,
      inited = _ref.inited,
      data = _ref.data,
      _create = _ref.create,
      _beforeCreate = _ref.beforeCreate,
      _destroy = _ref.destroy,
      events = _ref.events,
      computed = _ref.computed,
      _ref$methods = _ref.methods,
      methods = _ref$methods === undefined ? {} : _ref$methods,
      _ref$penetrate = _ref.penetrate,
      penetrate = _ref$penetrate === undefined ? false : _ref$penetrate,
      _ref$operable = _ref.operable,
      operable = _ref$operable === undefined ? true : _ref$operable,
      _ref$hide = _ref.hide,
      hide = _ref$hide === undefined ? false : _ref$hide,
      opened = _ref.opened,
      closed = _ref.closed,
      autoFocus = _ref.autoFocus;

  var defaultConfig = {
    html: html || '\n      <cm-pp-close>\xD7</cm-pp-close>\n      ' + (title !== false ? '<cm-pp-head>' + title + '</cm-pp-head>' : '') + '\n      ' + (body !== false ? '<cm-pp-body>' + body + '</cm-pp-body>' : '') + '\n    ',
    closeSelector: '._close'
  };

  return {
    name: name,
    el: tagName,
    className: className,
    beforeCreate: function beforeCreate() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          events = _ref2.events,
          methods = _ref2.methods;

      var option = arguments[1];

      if (isObject(option)) {
        isObject(option.events) && deepAssign(events, option.events);
        isObject(option.methods) && deepAssign(methods, option.methods);
      }
      _beforeCreate && _beforeCreate.apply(this, arguments);
    },
    create: function create() {

      var config = isObject(this.$config) ? deepAssign(defaultConfig, this.$config) : defaultConfig;
      var $dom = this.$domWrap = $(this.$dom).css('display', 'none');

      $dom.html(config.html).delegate('cm-pp-close, ' + config.closeSelector, 'click', this.close);

      this.width(width).height(height).offset(offset).translate(translate);

      this._hide = hide;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _create && _create.apply(this, args);
      !this._hide && this.open();
    },
    destroy: function destroy() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      _destroy && _destroy.apply(this, args);
      this.$domWrap.undelegate(this.$config.closeSelector, 'click', this.close).remove();
    },

    level: level,
    init: init,
    inited: inited,
    data: data,
    events: events,
    computed: computed,
    penetrate: penetrate,
    operable: operable,
    autoFocus: autoFocus,
    methods: deepAssign({
      open: function open() {
        if (this.destroyed) return this;
        this.$domWrap.css('display', 'block');
        this._hide = false;

        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        this.$emit('popupOpen', args, this);
        isFunction(opened) && opened.apply(this, args);
        return this;
      },
      close: function close() {
        if (this.destroyed) return this;
        this.$domWrap.css('display', 'none');
        this._hide = true;

        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        this.$emit('popupClose', args, this);
        isFunction(closed) && closed.apply(this, args);
        return this;
      },
      width: function width(_width) {
        _width && this.$domWrap.css('width', _width);
        return this;
      },
      height: function height(_height) {
        _height && this.$domWrap.css('height', _height);
        return this;
      },
      offset: function offset(vals) {
        var trblArr = ('' + (vals || '')).split(' ');
        var cssObj = {};
        if (trblArr.length > 2) {
          ['top', 'right', 'bottom', 'left'].forEach(function (dir, i) {
            if (trblArr[i] && trblArr[i] !== 'auto') {
              cssObj[dir] = trblArr[i];
            }
          });
          this.$domWrap.css(cssObj);
          return this;
        }

        var _trblArr = _slicedToArray(trblArr, 2),
            left = _trblArr[0],
            _top = _trblArr[1];

        if (left === '') {
          return this;
        }
        var top = _top || left;
        var xyAttr = offsetAttr.split(' ');
        cssObj[xyAttr[0]] = left;
        cssObj[xyAttr[1]] = top;
        this.$domWrap.css(cssObj);

        var translateXY = [];
        if (left === '50%') {
          translateXY.push('-50%');
        }
        if (top === '50%') {
          translateXY.push('-50%');
        }
        translateXY.length > 0 && this.translate(translateXY.join(' '));
        return this;
      },
      translate: function translate(xy) {
        var _$split = ('' + (xy || '')).split(' '),
            _$split2 = _slicedToArray(_$split, 2),
            x = _$split2[0],
            y = _$split2[1];

        x && this.$domWrap.css('transform', 'translate(' + x + ', ' + (y || x) + ')');
        return this;
      }
    }, methods)
  };
}

export default popupFactory;
