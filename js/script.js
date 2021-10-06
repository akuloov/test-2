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