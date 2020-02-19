(function($) {
	$.fn.gridify = function(options) {
		var $el = this,
		settings = $.extend({
			mapName: '',
			image: 'images/desert.jpg',
			cols: 12,
			clickable: true,
			allowPopups: true,
			pinImg: 'images/pin-sm.png',
			showGrid: false
		}, options);

		// Update the realtime popup content and flyover blurb content
		function updateRealtimeNotes(id) {
			$('#' + id + '-popup .block-notes').val($('#' + id + '-popup .block-notes').val());
			$('#' + id + ' .gridify-blurb').html('<p>Block: <span>' + id + '</span></p><p>' + $('#' + id + '-popup .block-notes').val() + '</p>');
		}

		// Check to make sure a map name is set
		if(settings.mapName != '') {
			// Wrap the gridify element in a div
			this.wrapAll('<div id="gridify"><div class="gridify-inside" /></div>');

			// Set the gridify element to position: relative by default
			// and add the gridify-element class
			this.css('position', 'relative').addClass('gridify-element');

			// If showGrid is true then add the class show-grid to the gridify element
			if(settings.showGrid) {
				this.addClass('show-grid');
			}

			// Create a new image using the image that's been passed in
			var img = new Image();
			img.src = settings.image;

			// Once the new image is loaded set the default width and height
			// to the image width and height if no width and height were set
			// otherwise use the values set by the user
			img.onload = function() {
				if(options['width'] === undefined) {
					settings.width = img.width;
				}
				if(options['height'] === undefined) {
					settings.height = img.height;
				}

				// Create the grid
				// ---------------------------------------------------------------------------------------
				var blockWidth = parseInt(settings.width) / settings.cols,
				bgSize = settings.width > settings.height ? 'auto ' + parseInt(settings.height) + 'px' : parseInt(settings.width) + 'px auto',
				totalRows = Math.ceil(settings.height / blockWidth) - 1,
				totalBlocks = settings.cols * totalRows,
				letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
				letterTracker = 0,
				counter = 1,
				$wrapper = $('.gridify-inside'),
				$outer = $('#gridify');

				/*===================================================================
				Comment this section
				it adds additional elements to the letters array. For example,
				if the number of columns exceeds 26 then we'll have to add a
				new set of double letter "aa, bb, cc" and so on.
				===================================================================*/
				if(Math.floor(settings.cols/26) >= 1) {
					var total = Math.floor(settings.cols/26),
					newLetter = '',
					inc = 1;
					for(var n=0; n<total; n++) {
						for(var i=0; i<26; i++) {
							newLetter = letters[i];
							for(var j=0; j<counter; j++) {
								newLetter += letters[i];
							}
							letters.push(newLetter);
						}
						inc++;
					}
				}

				// Apply the width and height to the gridify element and its wrapper
				$outer.css({minWidth: settings.width + blockWidth, minHeight: settings.height + blockWidth});
				$wrapper.css({width: settings.width + blockWidth, height: settings.height + blockWidth});
				$el.css({width: settings.width, height: blockWidth * totalRows});

				// Add top column labels
				$wrapper.prepend('<div class="top-column-labels" style="width:' + settings.width + 'px; height:' + blockWidth + 'px;" />');
				for(i=1; i<=settings.cols; i++) {
					$('.top-column-labels').append('<div class="col-' + i + ' block-label" style="' +
					'width:' + blockWidth + 'px;' +
					'height:' + blockWidth + 'px;' +
					'float: left;' +
					'text-align: center;' +
					'line-height: ' + blockWidth + 'px;' +
					'">' + i + '</div>');
				}

				// Add left row labels
				$wrapper.prepend('<div class="left-row-labels" style="width:' + blockWidth + 'px; height:' + (parseInt(settings.height) + blockWidth) + 'px;" />');
				// Add a blank block
				$('.left-row-labels').append('<div style="' + 'width:' + blockWidth + 'px;' + 'height:' + blockWidth + 'px;' + 'float: left;" />');
				for(i=0; i<totalRows; i++) {
					$('.left-row-labels').append('<div class="row-' + letters[i] + ' block-label" style="' +
					'width:' + blockWidth + 'px;' +
					'height:' + blockWidth + 'px;' +
					'float: left;' +
					'text-align: center;' +
					'line-height: ' + blockWidth + 'px;' +
					'">' + letters[i] + '</div>');
				}

				// Create all grid blocks and assign them unique alphanumeric IDs
				// ID format is a1, b1, c1, a2, b2, c2...
				for(i=1; i<=totalBlocks; i++) {
					var gridId = letters[letterTracker] + counter,
					tagType = settings.clickable ? 'a' : 'div';

					$el.append('<' + tagType + ' href="#' + gridId + '-popup" id="' + gridId + '" class="grid-block fancybox col-' + parseInt(gridId.match(/\d+/, '')) + ' row-' + letters[letterTracker] + '" style="' +
					'width:' + blockWidth + 'px;' +
					'height:' + blockWidth + 'px;' +
					'float: left;' +
					'background: url(' + settings.image + ') no-repeat left top / ' + bgSize + ';' +
					'" />');

					// Add an interface that the user can interact with to add data
					// to pin point areas. This is added to each new block that's
					// created directly above
					if(settings.clickable && settings.allowPopups) {
						$('#' + gridId).append('<div class="hide">' +
						'<div id="' + gridId + '-popup">' +
						'<form class="gridify-interface">' +
						'<p>Block ID: ' + gridId + '</p>' +
						'<p><textarea name="blockNoes" class="block-notes"></textarea></p>' +
						'<p data-parentId="' + gridId + '" class="close-btn">Close</p>' +
						'<p data-parentId="' + gridId + '" class="remove-pin">Remove Pin</p>' +
						'<input type="submit" name="' + gridId + 'saveData" class="save-data" value="Save Data" data-parentId="' + gridId + '" /></p></form></div>' +
						'</div>');
					}

					// Each time a new row is started reset the counter and move on
					// to the next row letter
					if(counter >= settings.cols) {
						counter = 1;
						letterTracker++;
					} else {
						counter++;
					}
				}

				// Add hover effect to entire row/column when hovered
				$('.grid-block').hover(function() {
					var col = '.' + $(this).attr('class').match(/col-\d+/).toString(),
					row = '.' + $(this).attr('class').match(/row-\w+/).toString();
					$(col + ',' + row).addClass('block-active');
					$(this).removeClass('block-active');
				}, function() {
					var col = '.' + $(this).attr('class').match(/col-\d+/).toString(),
					row = '.' + $(this).attr('class').match(/row-\w+/).toString();
					$(col + ',' + row).removeClass('block-active');
				});

				// Set the background position of each grid block so that the map
				// appears as 1 large image
				$el.children('.grid-block').each(function() {
					var block = $(this),
					leftPos = block.position().left,
					topPos = block.position().top;
					block.css('background-position', '-' + leftPos + 'px -' + topPos + 'px');
				});

				// If clickable is true then allow the placement of pins on the map along
				// with custom block specific data
				if(settings.clickable) {
					var pin = new Image();
					pin.src = settings.pinImg;
					pin.onload = function () {
						$('.grid-block').on('click', function() {
							var block = $(this);

							// Check and make sure a pin hasn't already been added
							if(!block.children().is('.pin-container')) {
								var pinLeft = blockWidth / 2 - pin.width / 2,
								pinTop = blockWidth / 2 - pin.height / 2;
								block.append('<div class="pin-container"><img src="' + settings.pinImg + '" alt="Pin" style="' +
								'position:absolute;' +
								'left:' + pinLeft + 'px;' +
								'bottom: 40%' +
								'" /></div>');

								// If popups are allowd then add a blurb section
								if(settings.allowPopups) {
									block.children('.pin-container').append('<div class="gridify-blurb"><p>Block: <span>' + block.attr('id') + '</span></p></div>');
								}
							}
						});

						// Load data into each block and set the pin when the page loads
						$.getJSON('includes/get-map-data.php?mapName=' + settings.mapName, function(data) {
							$.each($.parseJSON(data), function(key, val) {
								var block = $('#' + key);
								// Place the notes for the current block
								$('#' + key + ' form .block-notes').val(val);

								// Add pin to the current block
								var pinLeft = blockWidth / 2 - pin.width / 2,
								pinTop = blockWidth / 2 - pin.height / 2;
								block.append('<div class="pin-container"><img src="' + settings.pinImg + '" alt="Pin" style="' +
								'position:absolute;' +
								'left:' + pinLeft + 'px;' +
								'bottom: 40%' +
								'" /></div>');

								// If popups are allowd then add a blurb section
								if(settings.allowPopups) {
									block.children('.pin-container').append('<div class="gridify-blurb"><p>Block: <span>' + key + '</span></p><p>' + val + '</p></div>');
								}
							})
						}).done(function() {
							console.log('GetJSon success!');
						}).fail(function(xhr, status, error) {
							// If something went wrong then show an error
							console.log('Something when wrong: ' + status);
						});

						// If popups are allowd then add a blurb section
						if(settings.allowPopups) {
							// Save the current block notes to the jSon file
							$('.save-data').on('click', function(e) {
								e.preventDefault();
								var id = $(this).attr('data-parentId'),
								notes = $('#' + id + '-popup .block-notes').val();
								$.ajax({
									url: 'includes/set-map-data.php?mapName=' + settings.mapName + '&id=' + id + '&notes=' + notes
								}).done(function() {
									alert('Grid data has been saved.');
								}).always(function() {
									// Always update the realtime popup content and flyover blurb content
									updateRealtimeNotes(id);
									$.fancybox.close();
								});
							});
						}
					}

					// If popups are allowed then add fancybox functionality
					if(settings.allowPopups) {
						// Close button functions
						$('.close-btn').on('click', function() {
							var id = $(this).attr('data-parentId');
							updateRealtimeNotes(id);
							$.fancybox.close();
						});

						// Bind the fancybox even to all grid-block elements
						$('.fancybox').fancybox({
							'modal': true
						});

						// Remove the pin and reset the notes
						$('.remove-pin').on('click', function() {
							var id = $(this).attr('data-parentId');
							$('#' + id + ' .pin-container').remove();
							$('#' + id + '-popup .block-notes').val('').html('');

							// Remove the pin content from the json file
							$.ajax({
								url: 'includes/remove-map-data.php?mapName=' + settings.mapName + '&id=' + id
							}).done(function() {
								alert('Grid data has been removed.');
							});

							$.fancybox.close();
						});
					}
				}
			}

			// Return the element being gridified to allow the chaining of other
			// jQuery methods
			return this;
		} else {
			alert('Please set a map name.');
		}
	}
}(jQuery));
