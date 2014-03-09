(function(){
	'use strict';

	var TITLE_WHEN_CLOSED = 'Expand';
	var TITLE_WHEN_OPEN = 'Collapse';

	// requestAnimationFrame shimming.
	var requestAnimationFrame =
		window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
        	window.setTimeout(callback, 1000 / 60);
        };

	function toggleSummary(evt){
		// Prevent the text from being selected if rapidly clicked.
		evt.preventDefault();

		var summary = evt.target;
		var detail = findDetailFor(summary);
		if (!detail){ return; }

		// CSS Transitions don't work as expected on things set to 'display: none'. Make the
		// stretch details visible if needed, then use a timeout for the transition to take
		// effect.
		if (summary.classList.contains('stretchtext-open')){
			detail.style.display = 'none';
		} else {
			detail.style.display = isBlockLevelDetail(summary) ? 'block' : 'inline';
		}

		requestAnimationFrame(function(){
			summary.classList.toggle('stretchtext-open');
			detail.classList.toggle('stretchtext-open');

			if (summary.classList.contains('stretchtext-open')){
				setTitle(summary, TITLE_WHEN_OPEN);
			} else {
				setTitle(summary, TITLE_WHEN_CLOSED);
			}
		});
	}

	function isBlockLevelDetail(summary){
		return summary.nodeName.toLowerCase() === 'a';
	}

	function setTitle(summary, title){
		// If the user placed a manual title on the summary leave it alone.
		if (summary.hasAttribute('title')){
			return;
		} else {
			summary.setAttribute('title', title);
		}
	}

	function findDetailFor(summary){
		if (isBlockLevelDetail(summary)){
			var id = summary.getAttribute('href').replace(/^#/, '');
			var detail = document.getElementById(id);
			if (!detail && window.console){
				console.error('No StretchText details element with ID: ' + id);
			}
			return detail;
		} else {
			var detail = summary.nextElementSibling;
			if (!detail && window.console){
				console.error('No StretchText details element found for: ', summary);
			}
			return detail;
		}
	}

	function getSummaries(){
		var results = [],
			summaries;

		// epub-type
		summaries = document.querySelectorAll('[epub-type="stretchsummary"]');
		Array.prototype.forEach.call(summaries, function(result){
			results.push(result);
		});

		// CSS class.
		summaries = document.getElementsByClassName('stretchsummary');
		Array.prototype.forEach.call(summaries, function(result){
			results.push(result);
		});

		return results;
	}

	var loadedCalled = false;
	function loaded(){
		if (loadedCalled){ return; }
		loadedCalled = true;
		// FIXME(slightlyoff): Add global handlers instead of one per item.
		getSummaries().forEach(function(summary){
			summary.setAttribute('title', TITLE_WHEN_CLOSED);

			// Listen on mousedown instead of click so that we can prevent text
			// selection if mouse is clicked rapidly.
			summary.addEventListener('mousedown', toggleSummary);

			summary.addEventListener('touchstart', toggleSummary);

			// Link resolving can't be canceled in mousedown event, only in click
			// event.
			summary.addEventListener('click', function(e){e .preventDefault(); });
		});
	}

	window.addEventListener('DOMContentLoaded', loaded);
	if (document.readyState == "complete"){
		loaded();
	}
})();