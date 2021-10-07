new Swiper('.swiper',{

    navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
    pagination: {
       el: '.swiper-pagination',
       clickable: true,
  },
    loop: true,
    
    slidesPerView: 5,
    
    spaceBetween: 0,
    
    slidesPerGroup: 2,
}); 

var timeOut;
function goUp() {
   var top = Math.max(document.body.scrollTop,document.documentElement.scrollTop);
   if(top > 0) {
      window.scrollBy(0,-100);
      timeOut = setTimeout('goUp()',20);
   } else clearTimeout(timeOut);
}