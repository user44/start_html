$(document).ready(function() {

	//Цели для Яндекс.Метрики и Google Analytics
		// $(".count_element").on("click", (function() {
		// 	ga("send", "event", "goal", "goal");
		// 	yaCounterXXXXXXXX.reachGoal("goal");
		// 	return true;
		// }));

	//Chrome Smooth Scroll
		// try {
		// 	$.browserSelector();
		// 	if($("html").hasClass("chrome")) {
		// 		$.smoothScroll();
		// 	}
		// } catch(err) {};	

	$("img, a").on("dragstart", function(event) { event.preventDefault(); });

	//Ajax sendform
	$(".form").submit(function() { //Change
		var th = $(this);
		$.ajax({
			type: "POST",
			url: "mail.php", //Change
			data: th.serialize()
		}).done(function() {
			alert("Спасибо за заявку!");
			setTimeout(function() {
				// Done Functions
				th.trigger("reset");
			}, 1000);
		});
		return false;
	});

	

	
	
});

// $(window).load(function() {

// 	$(".loader_inner").fadeOut();
// 	$(".loader").delay(400).fadeOut("slow");

// });
