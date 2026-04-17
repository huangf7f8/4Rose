// variables
var $window = $(window), gardenCtx, gardenCanvas, $garden, garden;
var clientWidth = $(window).width();
var clientHeight = $(window).height();
window.isMobileLayout = $(window).width() <= 768;
window.mobileHeartScale = 1;

$(function () {
    // setup garden
	$loveHeart = $("#loveHeart");
	var offsetX = $loveHeart.width() / 2;
	var offsetY = $loveHeart.height() / 2 - 55;
    $garden = $("#garden");
	gardenCanvas = $garden[0];

	if (window.isMobileLayout) {
		var mobileHeartHeight = Math.max(Math.floor($window.width() * 1.65), Math.floor($window.height() * 0.88), 620);
		window.mobileHeartScale = Math.min(($window.width() - 24) / 670, mobileHeartHeight / 625, 1);
		$("#content").css({
			width: "100%",
			height: "auto",
			marginTop: 0,
			marginLeft: 0
		});
		$("#code").css({
			float: "none",
			width: "100%",
			height: "auto"
		});
		$("#loveHeart").css({
			float: "none",
			display: "block",
			position: "relative",
			height: mobileHeartHeight + "px"
		});
		$("#words").css({
			position: "absolute",
			top: "49%",
			left: "50%",
			transform: "translate(-50%, -50%)",
			width: "86%",
			zIndex: 2
		});
		offsetX = $("#loveHeart").width() / 2;
		offsetY = $("#loveHeart").height() / 2 - 55 * window.mobileHeartScale;
	} else {
		$("#content").css("width", $loveHeart.width() + $("#code").width());
		$("#content").css("height", Math.max($loveHeart.height(), $("#code").height()));
		$("#content").css("margin-top", Math.max(($window.height() - $("#content").height()) / 2, 10));
		$("#content").css("margin-left", Math.max(($window.width() - $("#content").width()) / 2, 10));
		offsetX = $("#loveHeart").width() / 2;
		offsetY = $("#loveHeart").height() / 2 - 55;
	}

	gardenCanvas.width = $("#loveHeart").width();
	gardenCanvas.height = $("#loveHeart").height();
	gardenCtx = gardenCanvas.getContext("2d");
	gardenCtx.globalCompositeOperation = "lighter";
	garden = new Garden(gardenCtx, gardenCanvas);

    // renderLoop
	setInterval(function () {
		garden.render();
	}, Garden.options.growSpeed);

	setTimeout(function () {
		startHeartAnimation();
	}, 5000);

	timeElapse(together);
	setInterval(function () {
		timeElapse(together);
	}, 500);

	if (!window.isMobileLayout) {
		adjustCodePosition();
	}

	$("#code").typewriter();
});

$(window).resize(function() {
    var newWidth = $(window).width();
    var newHeight = $(window).height();
    if (newWidth != clientWidth && newHeight != clientHeight) {
        location.replace(location);
    }
});

function getHeartPoint(angle) {
	var t = angle / Math.PI;
	var scale = window.isMobileLayout ? window.mobileHeartScale : 1;
	var x = 19.5 * (16 * Math.pow(Math.sin(t), 3)) * scale;
	var y = - 20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale;
	return new Array(offsetX + x, offsetY + y);
}

function startHeartAnimation() {
	var interval = 50;
	var angle = 10;
	var heart = new Array();
	var animationTimer = setInterval(function () {
		var bloom = getHeartPoint(angle);
		var draw = true;
		for (var i = 0; i < heart.length; i++) {
			var p = heart[i];
			var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
			if (distance < Garden.options.bloomRadius.max * 1.3) {
				draw = false;
				break;
			}
		}
		if (draw) {
			heart.push(bloom);
			garden.createRandomBloom(bloom[0], bloom[1]);
		}
		if (angle >= 30) {
			clearInterval(animationTimer);
			showMessages();
		} else {
			angle += 0.2;
		}
	}, interval);
}

(function($) {
	$.fn.typewriter = function() {
		this.each(function() {
			var $ele = $(this), str = $ele.html(), progress = 0;
			// 先测量完整文本高度并锁定，避免逐字换行时整体上下跳动
			var $measure = $('<div class="typewriter-content"></div>').css({
				position: 'absolute',
				visibility: 'hidden',
				pointerEvents: 'none',
				left: 0,
				top: 0,
				width: '100%'
			}).html(str);
			$ele.append($measure);
			var finalHeight = $measure.outerHeight();
			$measure.remove();

			var $typewriterContainer = $('<div class="typewriter-content"></div>').css({
				height: finalHeight + 'px',
				minHeight: finalHeight + 'px'
			});
			$ele.html('').append($typewriterContainer);
			
			var timer = setInterval(function() {
				var current = str.substr(progress, 1);
				if (current == '<') {
					progress = str.indexOf('>', progress) + 1;
				} else {
					progress++;
				}
				var cursorClass = (progress & 1) ? 'typewriter-cursor' : 'typewriter-cursor is-hidden';
				$typewriterContainer.html(str.substring(0, progress) + '<span class="' + cursorClass + '">_</span>');
				if (progress >= str.length) {
					clearInterval(timer);
					$typewriterContainer.html(str);
				}
			}, 75);
		});
		return this;
	};
})(jQuery);

function timeElapse(date){
	var current = Date();
	var seconds = (Date.parse(current) - Date.parse(date)) / 1000;
	var days = Math.floor(seconds / (3600 * 24));
	seconds = seconds % (3600 * 24);
	var hours = Math.floor(seconds / 3600);
	if (hours < 10) {
		hours = "0" + hours;
	}
	seconds = seconds % 3600;
	var minutes = Math.floor(seconds / 60);
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	seconds = seconds % 60;
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	var result = "<span class=\"digit\">" + days + "</span> 天 <span class=\"digit\">" + hours + "</span> 小时 <span class=\"digit\">" + minutes + "</span> 分钟 <span class=\"digit\">" + seconds + "</span> 秒"; 
	$("#elapseClock").html(result);
}

function showMessages() {
	adjustWordsPosition();
	$('#messages').fadeIn(5000, function() {
		showLoveU();
	});
}

function adjustWordsPosition() {
	if (window.isMobileLayout) {
		$('#words').css({
			position: "absolute",
			top: "49%",
			left: "50%",
			transform: "translate(-50%, -50%)",
			width: "86%"
		});
		return;
	}
	$('#words').css("position", "absolute");
	$('#words').css("top", $("#garden").position().top + 195);
	$('#words').css("left", $("#garden").position().left + 70);
}

function adjustCodePosition() {
	if (window.isMobileLayout) {
		return;
	}
	$('#code').css("margin-top", ($("#garden").height() - $("#code").height()) / 2);
}

function showLoveU() {
	$('#loveu').fadeIn(3000);
}