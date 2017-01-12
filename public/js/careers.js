$(function(){
    var bgimage = new Image();      
    bgimage.src="../public/images/About.jpg";       
    $(bgimage).load(function(){
  		$('.About-hero').addClass('visible');                  
    });
});