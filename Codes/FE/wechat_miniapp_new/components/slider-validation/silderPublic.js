function product(width,height,s){
    var time = new Date().getTime(); //时间戳
    var randomNum = ("0000000" + 100000000 * Math.random()).match(/(\d{8})(\.|$)/)[1]; //8位随机数
    var imgSrc;
    var n = Math.floor(Math.random() * 3) + 1;
    imgSrc = `https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/miniapp/sliderBg0${n}.jpg`;
    var qX = width, qY = height;
    var rX = Math.random() * (qX - 3.5 * s) + 2 * s;
    var rY = Math.random() * (qY - 15 - 25 - s) + 15;
    var data = {
      time: time,
      imgSrc: imgSrc,
      randomNum: randomNum,
      x: rX,
      y: rY
    };
    return data;
  }
module.exports ={
  product: product  
}