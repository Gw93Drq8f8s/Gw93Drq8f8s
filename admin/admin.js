document.addEventListener('DOMContentLoaded', function() {

	// for add new user from Admin parentElement
	if( document.getElementById('user_form')  != null){
		let pass = document.getElementById("id_password");
		let span = document.createElement('span');
		span.innerHTML = ' <span style="color:red;">&nbsp; Do not create user here or edit the password here, Django will not hash the password!</span>';
		pass.insertAdjacentElement("afterend", span);
		pass.setAttribute("readonly", true);
	}
	// for great blacks
	else if( document.getElementById('greatblacks_form')  != null){
	   // message
	   let span = document.createElement('span');
	   span.innerHTML = ' <span style="color:grey;">&nbsp; Field for reference only (country from Wikipedia).</span>';
		 let country = document.getElementById("id_country");
	   country.insertAdjacentElement("afterend", span);
		 country.setAttribute("readonly", true);

		 let countries = document.getElementById("id_countries");
		 let parent = countries.closest("div");
		 let h3 = document.createElement("h3");
		 h3.id = "countriesWarningMessage";
		 parent.insertBefore(h3, parent.childNodes[2]);

	   document.getElementById("id_summary").addEventListener("change", validate);
	   countries.addEventListener("change", validate);

	   document.getElementById("id_birth_date").addEventListener("change", validate);
	   document.getElementById("id_birth_year").addEventListener("change", validate);
	   document.getElementById("id_death_date").addEventListener("change", validate);
	   document.getElementById("id_death_year").addEventListener("change", validate);

		 document.getElementById("id_category").addEventListener("change", validate);

     // reset numerique field with 0 value to empty
		 let birth_year = document.getElementById("id_birth_year");
		 let death_year = document.getElementById("id_death_year");
     if (birth_year.value == "0") birth_year.value = "";
     if (death_year.value == "0") death_year.value = "";

	   validate();
	}

	function validate(){
		// validate categories
    const categories = document.querySelectorAll('#id_category input[type="checkbox"]:checked');
		if(categories.length == 0) {
			document.querySelectorAll("#id_category label").forEach((el)=>{
				el.style.color = "red";
			});
			show_hideButtons("none"); console.log(categories);
			return;
		}
		else{
			document.querySelectorAll("#id_category label").forEach((el)=>{
				el.style.color = "#000";
			});
		}

    // validate dates
	   let birth_date = document.getElementById("id_birth_date").value.trim();
	   let birth_year = document.getElementById("id_birth_year").value.trim();
	   let death_date = document.getElementById("id_death_date").value.trim();
	   let death_year = document.getElementById("id_death_year").value.trim();

		 if(parseInt(birth_year) != NaN && parseInt(death_year) != NaN && parseInt(birth_year) >= parseInt(death_year) ){
			// border red
			document.getElementById("id_birth_year").style.borderColor = "red";
			document.getElementById("id_death_year").style.borderColor = "red";
			show_hideButtons("none");
			return;
	 	 }
		 else{
			 document.getElementById("id_birth_year").style.borderColor = "#ccc";
 			 document.getElementById("id_death_year").style.borderColor = "#ccc";
		 }
		 if(birth_date && birth_year && !birth_date.includes(birth_year+ '') ){
			// border red
			document.getElementById("id_birth_date").style.borderColor = "red";
			document.getElementById("id_birth_year").style.borderColor = "red";
			show_hideButtons("none");  console.log(birth_date, birth_year );
			return;
		 }
		 else{
			 document.getElementById("id_birth_date").style.borderColor = "#ccc";
			 document.getElementById("id_birth_year").style.borderColor = "#ccc";
		 }
		 if(death_date && death_year && !death_date.includes(death_year+ '') ){
			// border red
			document.getElementById("id_death_date").style.borderColor = "red";
			document.getElementById("id_death_year").style.borderColor = "red";
			show_hideButtons("none");
			return;
		 }
		 else{
			 document.getElementById("id_death_date").style.borderColor = "#ccc";
			 document.getElementById("id_death_year").style.borderColor = "#ccc";
		 }

		// validate countries
	   let summary = document.getElementById("id_summary").value.trim();

	  /* let c1 = c2 = n = null;
	   if(country.match(/\|/) != null) c1 = false;
	   else {
		   c1 = true;
		   n = country.split(',').length;
	   }*/
		 /* For CountryField
	   let countries = document.getElementById("id_countries").value;
		 const selected = document.querySelectorAll('#id_countries option:checked');
		 const values = Array.from(selected).map(el => el.value);
		  if(summary && c1 && countries && n >0 && n == values.length){
		 */
		 /* for MultiSelectField */
		 let countries = document.querySelectorAll('#id_countries input[type="checkbox"]:checked');
		 let selectValues = [];
		 document.querySelectorAll('#id_countries input[type="checkbox"]').forEach((a)=> {
			 let content = a.closest('li');
			 if(a.checked){
				 content.style.backgroundColor = "#0099ff";
				 content.querySelector("label").style.color = "#ffffff";
				 selectValues.push(content.textContent);
			 }
			 else{
				 content.style.backgroundColor = "";
				 content.querySelector("label").style.color = "";
			 }
		 });
     // allow more than 3 countries for some great BLACKS
		 if(countries && countries.length > 3){
			 document.querySelector("#countriesWarningMessage").innerHTML = `<span style="color:red;">Warning ${countries.length} countries selected!</span> <span>${selectValues}</span>`;
		 }
		 else {document.querySelector("#countriesWarningMessage").innerHTML = "";}
	   if(summary && countries.length != 0){
		   show_hideButtons("initial");
	   }
	   else{
		  show_hideButtons("none");
	   }
  	 console.log( countries );
	}

	function show_hideButtons(state){
		   document.querySelectorAll('#content-main input[type="submit"]').forEach((el)=>{
		   el.style.display = state;
	   });
	}
});
