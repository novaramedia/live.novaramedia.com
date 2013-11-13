/* CACHE STUFF */
var broadcastStatus = $('#broadcast-status');
var broadcastLivestream = $('#broadcast-livestream');
var broadcastTV = $('#broadcast-tv');
var broadcastFm = $('#broadcast-fm');
var socialMedia = $('section#social-media');
var sitePostsSection = $('section#site-posts');
var sitePosts = $('section#site-posts div.posts');

/* CHECK IF LIVE */
var live;
var isFM;
var isPosts;

function liveLogic() {
	var liveCheck = isLive();
	if (live && liveCheck) {
		initFm();
		sitePostsSection.hide();
		isPosts = false;
	} else if (live && !liveCheck) {
		my_jPlayer.jPlayer("clearMedia");
		broadcastFm.hide();
		broadcastStatus.html('Offline');
		initPosts();
		live = false;
		isFM = false;
	} else if (!live && liveCheck) {
		initFm();
		sitePostsSection.hide();
		isPosts = false;
		live = true;
	} else if (!live && !liveCheck) {
		broadcastFm.hide();
		broadcastStatus.html('Offline');
		initPosts();
		isFM = false;
	}
}
liveLogic();
var timer;
timer = setInterval(function() {
	liveLogic();
}, 1000);

/* FM PLAYER INIT FUNCTION */
function initFm() {
	if (!isFM) {
		broadcastFm.show();
		socialMedia.show();

		var stream = {
			title: "Renosance FM",
			/* mp3: "http://icecast.commedia.org.uk:8000/resonance_hi.mp3" */
			mp3: "http://radio.canstream.co.uk:8004/live.mp3"
		},
			ready = false;
		var my_jPlayer = $("#jplayer"),
			my_playState = $("#jp_container .play-state"),
			my_extraPlayInfo = $("#jp_container .extra-play-info");
		var opt_text_playing = "Now playing",
			opt_text_selected = "Track selected";
		$.jPlayer.timeFormat.padMin = false;
		$.jPlayer.timeFormat.padSec = false;
		$.jPlayer.timeFormat.sepMin = " min ";
		$.jPlayer.timeFormat.sepSec = " sec";
		my_playState.text(opt_text_selected);
		my_jPlayer.jPlayer({
			ready: function() {
				ready = true;
				$(this).jPlayer("setMedia", stream);
			},
			timeupdate: function(event) {
				my_extraPlayInfo.text(parseInt(event.jPlayer.status.currentPercentAbsolute, 10) + "%");
			},
			play: function(event) {
				my_playState.text(opt_text_playing);
			},
			pause: function(event) {
				my_playState.text(opt_text_selected);
				$(this).jPlayer("clearMedia");
			},
			ended: function(event) {
				my_playState.text(opt_text_selected);
			},
			error: function(event) {
				if (ready && event.jPlayer.error.type === $.jPlayer.error.URL_NOT_SET) {
					$(this).jPlayer("setMedia", stream).jPlayer("play");
				}
			},
			swfPath: "js",
			cssSelectorAncestor: "#jp_container",
			supplied: "mp3",
			preload: "none",
			wmode: "window"
		});

		broadcastFm.css('opacity', 1);
		socialMedia.css('opacity', 1);

		broadcastStatus.html('FM Live');

		isFM = true;
	}
}

/* THIS DISPLAYS LATEST POSTS FROM MAIN SITE IF PLAYER IS OFFLINE */
function initPosts() {
	if (!isPosts) {
		$.getJSON("http://novaramedia.com/api/all/?callback=?", null, function(data) {
			var posts_insert = [];
			$.each(data.posts, function(i, item) {
				posts_insert.push('<a target="_blank" href="' + item.permalink + '"><li>' + item.title + '</li></a>');
			});
			$('<ul/>', {
				'id': 'site-posts-posts',
				html: posts_insert.join('')
			}).prependTo(sitePosts);
		});
		sitePostsSection.show().css('opacity', 1);
		isPosts = true;
	}
}

/*
$(document).ready(function() {

});
*/