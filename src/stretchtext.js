(function(){
	var TITLE_WHEN_CLOSED = 'Expand';
	var TITLE_WHEN_OPEN = 'Collapse';

	function toggleSummary(evt){
		// Prevent the text from being selected if rapidly clicked.
		// TODO: LINKS ARE STILL RESOLVING!!!
		evt.preventDefault();

		var summary = evt.target;
		var detail = findDetailFor(summary);

		// TODO: MAKE THIS ROBUST TO NO DETAIL ELEMENT BEING FOUND!!!

		// CSS Transitions don't work as expected on things set to 'display: none'. Make the
		// stretch details visible if needed, then use a timeout for the transition to take
		// effect.
		if (summary.classList.contains('stretchtext-open')){
			detail.style.display = 'none';
		} else {
			detail.style.display = isBlockLevelDetail(summary) ? 'block' : 'inline';
		}

		window.setTimeout(function(){
			summary.classList.toggle('stretchtext-open');
			detail.classList.toggle('stretchtext-open');

			if (summary.classList.contains('stretchtext-open')){
				summary.setAttribute('title', TITLE_WHEN_OPEN);
			} else {
				summary.setAttribute('title', TITLE_WHEN_CLOSED);
			}
		}, 1);
	}

	function isBlockLevelDetail(summary){
		return summary.nodeName.toLowerCase() === 'a';
	}

	function findDetailFor(summary){
		if (isBlockLevelDetail(summary)){
			// TODO: Make this robust to incorrect links!!!
			var id = summary.getAttribute('href').replace(/^#/, '');
			return document.getElementById(id);
		} else {
			return summary.nextElementSibling;
		}
	}

	function loaded(){
		var summaries = document.querySelectorAll('[epub-type="stretchsummary"]');
		Array.prototype.forEach.call(summaries, function(summary){
			summary.setAttribute('title', TITLE_WHEN_CLOSED);
			summary.addEventListener('mousedown', toggleSummary);
		});
	}

	window.addEventListener('DOMContentLoaded', loaded);
})();