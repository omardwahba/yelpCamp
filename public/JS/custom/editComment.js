//this code just excuted when the page loads
//this portions of code fill the edit page with the comment data
/*getting the comment  rate and make it selected*/
let query = 'select option:nth-child(' + $("#hiddenInput").val() + ')' ;
console.log(query);
$(query).attr("selected","");
/*stars filling*/
var rate = $("select").val();
    rate = parseInt(rate);
    clearStars();
   for( var i =1 ; i <= rate ; i++){
       let selector = "#star" + i ;
       $(selector).addClass("checked");
   }  

function clearStars () {  
    $('span.fa-star').removeClass('checked');
}

 $("select").click(function (e) { 
     var rate = $("select").val();
     rate = parseInt(rate);
     clearStars();
    for( var i =1 ; i <= rate ; i++){
        let selector = "#star" + i ;
        $(selector).addClass("checked");
    }  
 });

 var star1 = $('#star1'),
     star2 = $("#star2"),
     star3 = $("#star3"),
     star4 = $("#star4"),
     star5 = $("#star5"),
     slecet= $("select");

star1.on('click' , function(e){
    clearStars();
    $(this).addClass('checked');
    slecet.val($('select option:nth-child(1)').val());
});

star2.on('click' , function(e){
    clearStars();
    star1.addClass('checked');
    $(this).addClass('checked');
    slecet.val($('select option:nth-child(2)').val());
});

star3.on('click' , function(e){
    clearStars();
    star1.addClass('checked');
    star2.addClass('checked');
    $(this).addClass('checked');
    slecet.val($('select option:nth-child(3)').val());
});

star4.on('click' , function(e){
    clearStars();
    star1.addClass('checked');
    star2.addClass('checked');
    star3.addClass('checked');
    $(this).addClass('checked');
    slecet.val($('select option:nth-child(4)').val());
});

star5.on('click' , function(e){
    clearStars();
    star1.addClass('checked');
    star2.addClass('checked');
    star3.addClass('checked');
    star4.addClass('checked');
    $(this).addClass('checked');
    slecet.val($('select option:nth-child(5)').val());
});
