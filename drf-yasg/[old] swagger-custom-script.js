document.addEventListener('DOMContentLoaded', function() {
	let loaded1 = false;
	let loaded2 = false;
	function appyCustomJS(e){ console.log(e.target)
		if (loaded1 == false && e.target.closest("#operations-Great_Black-GreatBlack_list")) {
			loaded1 = true;
			applyReally(e);
		}
		else if (loaded2 == false && e.target.closest("#operations-Random_Great_Black-GreatBlack_Random_list")) {
			loaded2 = true;
			applyReally(e);
		}
	}
	
	function applyReally(e){
		
		let timeout = setTimeout(function(){
			/*let greatBlacks = document.getElementById("operations-Random_Great_Black-GreatBlack_Random_list");
			// setup error messages
			let input1 = greatBlacks.querySelector('table.parameters tr[data-param-name="limit"] input[type="text"]')
			let input2 = greatBlacks.querySelector('table.parameters tr[data-param-name="offset"] input[type="text"]')
			if(input1 != null && input2 != null){
				input1.addEventListener("change", function(){
					let valInput1 = this.value;
					let varInput2 = input2.value;
					if(valInput1 != "" && varInput2 != "") {
						console.log("Noo!");
					    console.log(valInput1,varInput2);
						let error1 = document.createElement("span");
						error1.className = "error-limit-offset";
						error1.innerHTML = "limit or offset not both";
						error1.style.color = "red";
						error1.style.marginLeft = "5px";
						if(greatBlacks.querySelector(".error-limit-offset") == null){
							this.parentNode.insertBefore(error1, this.nextSibling)
						    input2.parentNode.insertBefore(error1.cloneNode(true), input2.nextSibling)
							greatBlacks.querySelector(".execute-wrapper button.execute").setAttribute("disabled",true);
						}
					}
					else{
						if(greatBlacks.querySelector(".error-limit-offset") != null) {
							greatBlacks.querySelector(".error-limit-offset").remove();
							greatBlacks.querySelector(".execute-wrapper button.execute").removeAttribute("disabled");
						}
					}
				});
				input2.addEventListener("change", function(){
					let valInput1 = input1.value;
					let varInput2 = this.value;
					if(valInput1 != "" && varInput2 != "") {
						console.log("Noo2!");
					    console.log(valInput1,varInput2);
						let error2 = document.createElement("span");
						error2.className = "error-limit-offset";
						error2.innerHTML = "limit or offset not both";
						error2.style.color = "red";
						error2.style.marginLeft = "5px";
						if(greatBlacks.querySelector(".error-limit-offset") == null){
							this.parentNode.insertBefore(error2, this.nextSibling)
						    input1.parentNode.insertBefore(error2.cloneNode(true), input1.nextSibling)
							greatBlacks.querySelector(".execute-wrapper button.execute").setAttribute("disabled",true);
						}
					}
					else{
						if(greatBlacks.querySelector(".error-limit-offset") != null) {
							greatBlacks.querySelector(".error-limit-offset").remove();
							greatBlacks.querySelector(".execute-wrapper button.execute").removeAttribute("disabled");
						}
					}
				});
			}*/
			
			let collapse = e.target.closest(".opblock");
			
			let tabs = collapse.querySelector(".responses-table tr.response ul.tab")
				if(tabs){  console.log("remove");
					tabs = tabs.children;
					tabs[0].classList.add("active");
					if(tabs.length > 1) tabs[1].remove();
					tabs[0].children[0].click();
				}

			let observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
					if(mutation.type === 'attributes' ){
						
						
						const modal_link = collapse.querySelector('.responses-table tr.response ul.tab a.tablinks[data-name="model"]');
						if(modal_link){
							console.log("mutation", mutation);
							console.log("exist");
						// remove usless tab
						let tabs = collapse.querySelector(".responses-table tr.response ul.tab")
							if(tabs){console.log("remove");
								tabs = tabs.children;
								tabs[0].classList.add("active");
								if(tabs.length > 1) tabs[1].remove();
								tabs[0].children[0].click();
							}
						}
						else {
							console.log("exist pas");
							
						}

					}
				});
			});
			observer.observe(collapse, {
			  attributes: true,
			  attributeOldValue : true,
			  attributeFilter: ['class'],
			  characterData: true,
			  subtree: true
			});
			
			
			console.log("i am in");
			// stop lookup
			loaded = true;
			
		},100);
	}
	let intervalId = setInterval(function(){ 
		   if(document.getElementById("operations-Great_Black-GreatBlack_list") != null){
			   document.getElementById("operations-Great_Black-GreatBlack_list").addEventListener("click", appyCustomJS);
			   clearInterval(intervalId); 
		   }
		   if(document.getElementById("operations-Random_Great_Black-GreatBlack_Random_list") != null){
			   document.getElementById("operations-Random_Great_Black-GreatBlack_Random_list").addEventListener("click", appyCustomJS);
			   clearInterval(intervalId); 
		   }
	    },100);

});
