/*
$(document).ready(function(){
    
    var standalone = "standalone" in window.navigator && window.navigator.standalone;
    var iOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false );

    if (iOS && !standalone) {
        $(".ui-content").detach();
        $(".ui-header").detach();
        $(".ui-footer").detach();
    } else {
        $("#addToHomeScreen").detach();
    }

    // prevent rubber banding for header and footer
    if (iOS && standalone) {
        $(".ui-header, .ui-footer").bind('touchmove', function(e) {
            e.preventDefault();
        });
    }
    new ScrollFix($(".ui-content")[0]);

    var allpages = $.makeArray($("div[data-role='page']"));
    var currentpageIndex = 0;
    
});

$(document).bind("pageinit", function(evt) {
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;

    // Strage: Without that scrolling is not possible with android. With it ios can't scroll...
    if (isAndroid) {
        $("#hdr-txt").text("android 2 hack applied");
        $(evt.target).css("overflow-x", "visible");
        $(evt.target).find(".ui-content").css("overflow-x", "visible");
    }

    // Header and footer were added in the first page (to get easy enhancement)
    // Both are now removed from the first page and moved to the body
    var header = $(".ui-header");
    var footer = $(".ui-footer");
    $("body").prepend(header);
    $("body").prepend(footer);
    
});

$(document).bind("mobileinit", function() {

    function myslide(name, reverse, $to, $from) {
        var fromPageContainer = $from.parent();
        var deferred = new $.Deferred();

        var toPageContainer = $("<div class='ui-content'></div>");
        toPageContainer.append($to);
        new ScrollFix(toPageContainer[0]);
        $("body").append(toPageContainer);
        $from.show();
        $to.show();

        var w = $("div[data-role='page']").innerWidth();

        var translateTo = "translate(" + (!reverse ? w : -w) + "px,0px)";
        var translateFrom = "translate(" + ( reverse ? w : -w) + "px,0px)";

        toPageContainer.attr("style", "-webkit-transform: " + translateTo);
    }

    $.mobile.transitionHandlers["myslide"] = myslide;
    
});
*/

$(document).bind("pageinit", function(evt) {

    $('div[data-role="page"]').on('pageshow', function() {
		$("body").scrollTop(1);
		
        $(".ticket-table li").each(function (){
            $(this).find(".col:last").attr("style","border-right:0px");
        });

        $(".row2 div").each(function (){
            if($(this).hasClass('correct-score'))
            {
                $(this).parent().attr("class","correct-score-right");
                $(this).parent().parent().find('.left').attr("class","correct-score-left");

            }
        });
        $(".row2 div").each(function (){
            if($(this).hasClass('correct-score'))
            {
                $(this).parent().attr("class","correct-score-right");
                $(this).parent().parent().find('.left').attr("class","correct-score-left");

            }
        });

        $(".row2 div.correct-score-right").children().each(function (){
            if(!$(this).hasClass('correct-score'))
            {
                $(this).attr("class","correct-score");
                $(this).find("div:first-child").after("<div class='seperator'>&nbsp;</div>");
            }
        });

        $(".main-row li .tipp-row").each(function (key,val){

            if($(this).children("div").length==2)
            {
                //$(this).removeClass("tipp-row").addClass("tipp-row2");
				$(this).prepend('<div class="blank-div" style="width:57%; left:-25%; position: absolute;"><span class="text">'+$(this).parent().prev().html()+'</span></div>');
				$(this).parent().prev().html('&nbsp;');
            }
            else if($(this).children("div").length==1)
            {
                //$(this).removeClass("tipp-row").addClass("tipp-row1");
                $(this).children("div.col1").addClass("left-curve");
                $(this).prepend('<div class="blank-div"></div><div class="blank-div"><span class="text">'+$(this).parent().prev().html()+'</span></div>');
				$(this).parent().prev().html('&nbsp;');
            }

        });
		$('.content-outer').height($(window).height() - $(".ui-header").height() - 73);
		$(window).bind('orientationchange',function(){ $('.content-outer').height($(window).height() - $(".ui-header").height() - 73); });
    	//alert("Window height = "+$(window).height()+"/nHeader height="+$(".ui-header").height());
        
		
    });

});
$(document).ready(function(){
    var is_iPhone = /iPhone/.test(navigator.userAgent),
        counterOuter = $('.content-outer'),
        windowHeight = $(window).height(),
        uiHeaderHeight = $(".ui-header").height();

    if(is_iPhone){
        counterOuter.height(windowHeight - uiHeaderHeight - 13);
    }
    else{
        counterOuter.height(windowHeight - uiHeaderHeight - 73);
    }

    $(window).bind('orientationchange',function(){ 
        $("body").scrollTop(1);
        setTimeout(function(){
            windowHeight = $(window).height();
            uiHeaderHeight = $(".ui-header").height();

            if(is_iPhone){
                counterOuter.height(windowHeight - uiHeaderHeight - 13);
            }
            else{
                counterOuter.height(windowHeight - uiHeaderHeight - 73);
            }
        }, 300);
    });
});