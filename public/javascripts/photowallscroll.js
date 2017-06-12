var firefox = navigator.userAgent.indexOf('Firefox') !== -1;

function MouseWheel(id) {
	var event = event || window.event;

	if (event.stopPropagation) {
		event.stopPropagation();
	} else {
		event.cancelBubble = true;
	}

	if (event.preventDefault) {
		event.preventDefault();
	} else {
		event.returnValue = false;
	}

	var obj = document.getElementById(id);
	var speed = 30;
	if (firefox) {
		obj.scrollLeft += event.detail / 3 * speed;
	} else {
		obj.scrollLeft -= event.wheelDelta / 120 * speed;
	}
}

function MouseWheel_waiting() {
	MouseWheel("waiting");
}

function MouseWheel_processed() {
	MouseWheel("processed");
}

function show_scroll(obj) {
	obj.style.overflowX = "scroll";
}

function hide_scroll(obj) {
	obj.style.overflowX = "hidden";
}

$(function () {
	var waiting = document.getElementById("waiting");
	var processed = document.getElementById("processed");
	if (firefox) {
		waiting.addEventListener("DOMMouseScroll", MouseWheel_waiting, false);
		processed.addEventListener("DOMMouseScroll", MouseWheel_processed, false);
	} else {
		waiting.onmousewheel = MouseWheel_waiting;
		processed.onmousewheel = MouseWheel_processed;
	}
})
