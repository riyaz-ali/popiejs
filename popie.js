//The MIT License (MIT)
//Copyright (c) 2016 Riyaz Ali
//
//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//
//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//SOFTWARE.

/*
 * Popie.js - A small javascript plugin to ease-out the process of creating and manipulating modals / dialogs
 *
 * @dependency - jQuery > 1.5
 * 
 * @todo - 	-- Remove jQuery Dependency by creating an alternative animation handler
 * 			-- Provide customisation options via params
 * 			-- Add css to its own stylesheet (not so important)
 */

(function( $, window ){
	
	//add styles to the DOM
	var css = 
		".modal-overlay {position:fixed;top:0;left:0;z-index:9999;background:#000;background:rgba(0,0,0,.5);width:100%;height:100%;display:none;opacity:0}" +
		".modal{position:relative;background-color:#fefefe;margin:-500px auto 20px;padding:15px;display:block;border-radius:2px;box-shadow:0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12);width:100%}" +
		"@media screen and (min-width:768px){.modal{margin:-500px auto 20px;width:50%}}" +
		".modal-title{width:100%;display:inline-block;margin-top:-15px}" +
		".modal-close{position:absolute;top:0;right:0;padding:5px 7px;text-align:right;width:20%;display:inline-block}" +
		".modal-close a{color:#777;cursor:pointer}" +
		".modal-close a:hover{color:#333;text-decoration:none}";
	
	var style = document.createElement("style");
		style.innerHTML = css;
	document.head.appendChild(style);
	
	window.popie = function(params){
		
		var defaults = {
			addCloseButton: false
		};
		
		var settings = extend({}, defaults, params);
		
		//creating the modal
		//ative elements here to speed up things
		var _overlay = document.createElement("div");
			_overlay.className = "modal-overlay";
		var _modal = document.createElement("div");
			_modal.className = "modal";
		var _content = document.createElement("div");
			_content.className = "modal-content";
		
		//Adding modal to DOM
		_modal.appendChild(_content);			//content arena
		_overlay.appendChild(_modal);			//the modal
		document.body.appendChild(_overlay);	//the overlay
		
		
		//caching objects for jQuery
		var _o = $(_overlay);
		var _m = $(_modal);
		
		var obj = { };	//interface object
				
		// 1> Display the Modal
		obj.show = function(){			
			_o.css({'display': 'block'});
			_o.animate({"opacity": 1}, 300).promise().pipe(function(){var offset = ($(window).height() - _m.height()) / 2; _m.animate({"marginTop": offset}, 450); }); 	
			return this;	//facilitate chaining
		}
		
		// 2> Close the Modal
		obj.hide = function(){
			_m.animate({"marginTop": "-500px"}, 300).promise()
			  .pipe(function(){ return _o.animate({"opacity": 0}, 200).promise(); })
			  .pipe(function(){ return _o.css({"display": "none"}).promise(); });
			
			return this;	//facilitate chaining
		}
		
		// 3> Setting the content of the modal
		obj.setContent = function(txt){
			_content.innerHTML = txt;
			return this;
		}
		
		// 4> To extend the Modal itself
		obj.append = function(x){
			_content.appendChild(x);
			return this;
		}
		
		
		/* Close Gesture! */
		_overlay.addEventListener("click", function(evt){
			evt.preventDefault();
			if(evt.target == _overlay){
				obj.hide();
			}
		});
		
		
		/* Additional */
		if(settings.addCloseButton === true){
			var _close = document.createElement("div");
				_close.className = "modal-close";
			var _close_button = document.createElement("a");
				_close_button.innerHTML = "&times;";
			_close.appendChild(_close_button);
			_modal.appendChild(_close);
			
			//close handler
			_close_button.addEventListener("click", function(evt){
				evt.preventDefault();
				obj.hide();
			});
		}
		
		return obj;
	}
	
	
	//Re-creation of jQuery.extend to remove un-necessary dependency
	//taken from http://youmightnotneedjquery.com/#extend
	function extend(out){
		var out = out || {};
		
		for(var i=1; i<arguments.length; i++){
			var obj = arguments[i];
			
			if(!obj)continue;
			
			for(var key in obj){
				if(obj.hasOwnProperty(key))
					out[key] = obj[key];
			}
		}
		
		return out;
	}
	
}(jQuery, window));