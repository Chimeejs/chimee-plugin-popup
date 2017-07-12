import popupFactory from 'index';
import {addTransMethod, $} from 'chimee-helper';

let createCount = 0;
let destroyCount = 0;
const popupConf = popupFactory({
  create () { createCount++; },
  opened () {},
  closed () {},
  destroy () { destroyCount++; },
  beforeCreate () {}
});

const $domWrap = $('<div />').appendTo(document.body);

// 模拟构造之
popupConf.$dom = $domWrap[0];
popupConf.$config = {};
popupConf.bindMethods = ()=>{};
popupConf.$emit = ()=>{};
for(const key in popupConf.methods) {
  popupConf[key] = function () {
    return popupConf.methods[key].apply(popupConf, arguments);
  };
}
test('beforeCreate', () => {
  popupConf.events = {};
  const fun = ()=>{};
  popupConf.beforeCreate(popupConf, {
    events: {
      fun
    }, methods: {
      fun
    }
  });
  expect(popupConf.events.fun).toBe(fun);
  popupConf.beforeCreate();
  expect(popupConf.events.fun).toBe(fun);
});

test('create', () => {
  popupConf.create();
  expect(createCount).toBe(1);
  expect($domWrap[0].parentNode).toBe(document.body);
});

test('close', () => {
  popupConf.close();
  expect($domWrap.css('display')).toBe('none');
});
test('open', () => {
  popupConf.open();
  expect($domWrap.css('display')).toBe('block');
});

test('width', () => {
  popupConf.width('1px');
  popupConf.width();
  expect($domWrap.css('width')).toBe('1px');
});
test('height', () => {
  popupConf.height('1px');
  popupConf.height();
  expect($domWrap.css('height')).toBe('1px');
});

test('offset', () => {
  expect(popupConf.offset()).toBe(popupConf);

  const trblVal = '12px 11px 10px 9px';
  const trblArr = trblVal.split(' ');
  popupConf.offset(trblVal);
  expect($domWrap.css('top')).toBe(trblArr[0]);
  expect($domWrap.css('right')).toBe(trblArr[1]);
  expect($domWrap.css('bottom')).toBe(trblArr[2]);
  expect($domWrap.css('left')).toBe(trblArr[3]);

  popupConf.offset('auto auto auto auto');
  expect($domWrap.css('top')).toBe(trblArr[0]);
  expect($domWrap.css('right')).toBe(trblArr[1]);
  expect($domWrap.css('bottom')).toBe(trblArr[2]);
  expect($domWrap.css('left')).toBe(trblArr[3]);

  let tlVal = '2px';
  popupConf.offset(tlVal);
  expect($domWrap.css('left')).toBe(tlVal);
  expect($domWrap.css('top')).toBe(tlVal);

  tlVal = '3px 4px';
  popupConf.offset(tlVal);
  expect($domWrap.css('left')).toBe('3px');
  expect($domWrap.css('top')).toBe('4px');

});

test('translate', () => {
  popupConf.translate('1px 2px');
  expect($domWrap.css('transform')).toBe('translate(1px, 2px)');

  popupConf.translate('3px');
  expect($domWrap.css('transform')).toBe('translate(3px, 3px)');
});

test('destroy', () => {
  popupConf.destroy();
  expect(destroyCount).toBe(1);
  expect($domWrap[0].parentNode).toBeNull();
});

// ---------分支覆盖 ---
const popupConf2 = popupFactory({
  hide: true,
  title: false,
  body: false
});

const $domWrap2 = $('<div />').appendTo(document.body);

// 模拟构造之
addTransMethod(popupConf2);
popupConf2.$dom = $domWrap2[0];
popupConf2.bindMethods = ()=>{};
popupConf2.$emit = ()=>{};
for(const key in popupConf2.methods) {
  popupConf2[key] = function () {
    return popupConf2.methods[key].apply(popupConf2, arguments);
  };
}
test('$config is undefined', () => {
  popupConf2.create();
  expect($domWrap2.css('display')).toBe('none');
});

// ---------分支覆盖 ---
const popupConf3 = popupFactory();

const $domWrap3 = $('<div />').appendTo(document.body);

// 模拟构造之
addTransMethod(popupConf3);
popupConf3.$dom = $domWrap3[0];
popupConf3.destroyed = true;
popupConf3.bindMethods = ()=>{};
popupConf3.$emit = ()=>{};
for(const key in popupConf3.methods) {
  popupConf3[key] = function () {
    return popupConf3.methods[key].apply(popupConf3, arguments);
  };
}
test('options is undefined', () => {
  popupConf3.create();
  expect($domWrap3.hasClass('t-cls2')).toBe(false);
  popupConf3.close();
  expect($domWrap2.css('display')).toBe('none');
});
