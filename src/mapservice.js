export default class MapServices {
  constructor() {
    this.services = [];
    this.register('google', 'https://www.google.com/maps/@${lat},${long},${range}m/data=!3m1!1e3');
    this.register('bing', 'https://www.bing.com/maps/?v=2&cp=${lat}~${long}&style=h&lvl=16');
    this.register('google.cn', 'http://www.google.cn/maps/@${lat},${long},${range}m/data=!3m1!1e3');
    this.register('bing.cn', 'https://www.bing.com/ditu/?v=2&cp=${lat}~${long}&style=h&lvl=16');
    this.register('openstreetmap', 'http://www.openstreetmap.org/#map=16/${lat}/${long}');
    this.register('baidu',
      'http://api.map.baidu.com/marker?location=${lat},${long}&title=_&content=${addr}&output=html&autoOpen=true'
    );
  }
  register(name, template) {
    this.services[name] = template;
  }
  unregister(name) {
    delete this.services[name];
  }
  format(name, location) {
    return this.services[name]
      .replace('${lat}', location.latitude)
      .replace('${long}', location.longitude)
      .replace('${range}', location.accuracy)
      .replace('${addr}', location.address);
  }
}
