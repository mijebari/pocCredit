var showDialog = function() {
      	    $('.container-right').width('33%');
  	    $('.container-left').width('33%');
  	        $('.container-center').show(300);
    $('.container-center').css('display', 'inline-block');

    }



    var hideDialog = function() {
  	    $('.container-center').hide(300);
  	    $('.container-right').width('45%');
  	    $('.container-left').width('45%');

    }



    $(".button-hideDialog").click(function(event, param) {
hideDialog();
console.log("&nkimation");

        // $('.nano-content').animate({
        //     scrollTop: $('.nano-content').prop("scrollHeight")
        // }, 800);



    });

        $(".button-showDialog").click(function(event, param) {
showDialog();

        // $('.nano-content').animate({
        //     scrollTop: $('.nano-content').prop("scrollHeight")
        // }, 800);



    });