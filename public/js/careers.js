$(function(){
    var bgimage = new Image();      
    bgimage.src="../public/images/about.jpg";       
    $(bgimage).load(function(){
  		$('.about-hero').addClass('visible');                  
    });
});