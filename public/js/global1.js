$(window).load(function(){
        $(document).ready(function(){
         $("html").niceScroll();	
         scrollTo(($(document).width() - $(window).width()) / 2, 0);
         scrollTo(($(document).height() - $(window).height()) / 2, 0);
    });
});