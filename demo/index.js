const popupFactory = window.chimeePluginPopup;

Chimee.install(chimeePluginControlbar);
Chimee.install(popupFactory({
  name: 'ccPopup',
  title: '这是一个居中信息框',
  body: '这里是信息内容',
  offset: '50% 50%',
  width: '200px'
}));

Chimee.install(popupFactory({
  name: 'rc_popup',
  title: '这是一个右键信息框',
  body: '这里是菜单1<br>这里是菜单2<br>这里是菜单3<br>这里是菜单4',
  offset: '40% 40%',
  width: '160px',
  hide: true,
  create () {
    // 点击播放器之外的文档区域关闭右键菜单
    this._doc = new this.$domWrap.constructor(document);
    this._doc_click = e => this.close();
    this._doc.on('click', this._doc_click);
  },
  destroy () {
    this._doc.off('click', this._doc_click);
  },
  opened () {
    this.$bumpToTop();
  },
  events: {
    contextmenu (e) {
      this.offset(e.offsetX + 'px ' + e.offsetY + 'px').open(e);
      e.preventDefault();
    },
    mousedown (e) {
      e.button !== 2 && this.close(e);
    }
  }
}));

Chimee.install(popupFactory({
  name: 'br_popup',
  title: '这是一个右下角信息框',
  body: '这里是信息内容',
  offsetAttr: 'right bottom',
  offset: '2px 38px',
  width: '160px'
}));

Chimee.install(popupFactory({
  name: 'tl_popup',
  title: '这是一个顶部通栏信息框',
  body: '关闭我将打开全屏覆盖浮层',
  offset: '0 0 auto 0',
  closed () {
    // 如果当前浮层被关闭，则发出事件trbl_open
    this.$emit('trbl_open');
  }
}));

Chimee.install(popupFactory({
  name: 'trbl_popup',
  title: '这是一个全屏覆盖信息框',
  body: '这里是信息内容',
  offset: '0 0 0 0',
  hide: true,
  opened () {
    this.$bumpToTop();
  },
  events: {
    // 监听事件 trbl_open 发生则开启当前浮层
    trbl_open () {
      this.open();
    }
  }
}));

const player = new Chimee({
  // 播放地址
  src: 'http://cdn.toxicjohann.com/lostStar.mp4',
  // 直播:live 点播：vod
  isLive: false,
  // 编解码容器
  box: 'native',
  // dom容器
  wrapper: '#wrapper',
  plugin: [chimeePluginControlbar.name, 'cc_popup', 'br_popup', 'tl_popup', 'trbl_popup', 'rc_popup'],
  // video
  autoplay: true,
  controls: true
});
