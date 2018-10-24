
const config =require('../config.js');
const _page=Page;

Page=function Page(options){
  options.data = Object.assign({bosHost:config.bosHost}, options.data);
  _page(options);
}


