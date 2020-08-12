// fixe warning "Found 2 elements with non-unique id #id_username" from django default field
let djangoField = document.getElementById("id_username");
if(djangoField) djangoField.id = "id_username1";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

let static = 'https://storage.googleapis.com/greatblacks/static/';

let desc = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente, explicabo!Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente, explicabo!Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente, explicabo!Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente, explicabo!Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente, explicabo.";
/*  using now on blackVue.dataImages*/
let old_urlsImages = [{"data-x": "2", "url": static+"/greatblacks/images/1.png", "name": "Martin Luther King 1", "extracts": "1 "+desc, "category":["art", "activist", "spiritual"]},
             {"data-x": "1", "url": static+"greatblacks/images/2.png", "name": "Martin Luther King 2", "extracts":"2 Description", "category":["art"]},
             {"data-x": "0", "url": static+"greatblacks/images/3.png", "name": "Martin Luther King 3", "extracts":"3 Description", "category":["activist", "spiritual"]},
             {"data-x": "-1", "url": static+"greatblacks/images/4.png", "name": "Martin Luther King 4", "extracts":"4 "+desc, "category":["spiritual"]},
             {"data-x": "-2", "url": static+"greatblacks/images/5.png", "name": "Martin Luther King 5", "extracts":"5 Description", "category":["art", "spiritual"]},
             {"data-x": "", "url": static+"greatblacks/images/6.png", "name": "Martin Luther King 6", "extracts":"6 Description", "category":[]},
             {"data-x": "", "url": static+"greatblacks/images/7.png", "name": "Martin Luther King 7", "extracts":"7 "+desc, "category":["art", "activist", "spiritual"]},
             {"data-x": "", "url": static+"greatblacks/images/8.png", "name": "Martin Luther King 8", "extracts":"8 Description", "category":["politic"]}
           ];




Vue.component('imagelist-component', {                 // component is like an element we can duplicate as many we want, tike a card of product including all its fonctionalities
  props:{                                        //# in order to send data from the parent <componant-name> to a component. IMPORTANT: componant-name must be lowcase!!!!
    name: {
      type: String,
      value: String
    },
    url:{
      type: String,
      value: String
    },
  },
  delimiters: ["[[", "]]"],
  template: `<div class="responsive" @click="toggleDetails"><div class="gallery">
               <div class="desc">[[name]]</div>
               <img :src="[[url]]" alt="">
               <div title="share" class="share"><span class="shareLogo"></span></div>
             </div></div>;`,
  data(){                       // data() replace the default data!
    return {
     toto: "",
    }
  },
  methods:{
    toggleDetails(e){   // this.$emit('add-to-cart', id)     //# will send event from the component to the parent <componantName></componantName>
      //console.log("comp:",this.$options.components)
console.log("toggleDetails:", e.target, e.target.tagName);
        //galleries[i].onclick = function(e){ console.log("this",this);
          e.stopPropagation();
          let galleries = document.querySelectorAll(".responsive .gallery");
          // show share modal
          if( ["share","shareLogo"].includes(e.target.className) ) blackVue.toggleShareModal(e);
          else if(e.target.tagName == "IMG"){
            let gallery = e.target.closest('.gallery');
            for (let j = 0; j < galleries.length; j++) {
              if(galleries[j] != gallery) galleries[j].classList.remove("active");
            }
            gallery.classList.toggle("active");
            if(gallery.classList.contains("active"))   document.querySelector(".carousel-container .description").classList.add("visible");
            else  {document.querySelector(".carousel-container .description").classList.remove("visible");}
            // update description hidden or not
            const img = document.querySelector('.gallery.active img');
            console.log("image: ",img);
            if(img){
              const dataId = blackVue.lastBlobImages2[img.src];
              if( blackVue.dataImages[dataId] && blackVue.dataImages[dataId].url ) {
                blackVue.blackName = blackVue.dataImages[dataId].name;
                blackVue.extracts = blackVue.shortVersionExtracts(blackVue.dataImages[dataId].extracts);
                blackVue.categories = blackVue.dataImages[dataId].category.join(', ');   //"category":[art, activist, spiritual]
                blackVue.wiki_link = blackVue.dataImages[dataId].wiki_link;
                blackVue.internal_link =  blackVue.dataImages[dataId].internal_link;
                // scroll to top description
                document.querySelector(".carousel-container .description-content p").scrollTop = 0;
              }
            }
          }
    }
  },
  computed:{

  },
});

let blackVue = new Vue({
  delimiters: ["[[", "]]"],
  el:'#app',
//  components: myComponent,
  data: {
     username: document.getElementById("user-username").innerHTML,
     authenticated: (document.getElementById("isAuthenticated").innerHTML == 'True'),
     currentAddTab: 0,   // Current tab is set to be the first tab (0)
     animationChecks: true,
     wikiLinkChange: true,
     addSubmited: false,
     waitForPromise: false,
     carousel: null,
     cardsContainer: null,
     cardsCarousel: null,
     cardsController: null,
     beforedatavalidated: null,
     lastScrollDirection: {"direction":"","srcChanged":true, "cursorState":null},
     onePixelUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNiYAAAAAkAAxkR2eQAAAAASUVORK5CYII=',
     blackName: "",
     extracts: "",
     countryCode: null,
     categories: "",
     internal_link: window.location.origin+'/',
     wiki_link: "#",
     queryPeriod: [null,null],
     queryCategory: ["activist", "scientist", "politic", "art", "sport", "spiritual", "other"],
     listMarkers: {},
     blacksData: null,
     currentYear: (new Date()).getFullYear(),
     timeLine: [],
     dataImages: [],
     dataImagesComponent: [],   // will be a copy of urlsImages used for component, charge 3 images first...
     dataImages_lastIndex: 0,
     dataImagesComponent_backup: [],
     slug: "",
     isDeath: true,
     isMobile: (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || document.querySelector(".carousel-container").clientWidth < 400),   // (removed |iPad|)
     openPolygon_timeStamp: Date.now(),
     postAxiosResponses: [],
     tempBlobImage: "",
     objectURL: (window.URL || window.webkitURL),
     objectURL2: (window.URL || window.webkitURL),
     lastBlobImages: {'count':[]},
     lastBlobImages2: {},
     isViewModeList: false
  },
  methods:{
    addListImages: function(list){  console.log("addListImages");
      let divList = document.querySelector(".carousel-container .list");
      divList.style.display = "block";
      if(this.dataImagesComponent.length == 0){
        this.dataImagesComponent = this.changeDataUriToBlob(this.dataImages.slice(0, 4));
        this.dataImages_lastIndex = 4;
        divList.onscroll = this.loadNext20Images;
      }
    },
    loadNext20Images: function(e){
        let divList = document.querySelector(".carousel-container .list");
        if( divList.scrollTop >= (divList.scrollHeight - divList.offsetHeight)*0.75 ){
          if( divList.children.length > 0 && blackVue.dataImages_lastIndex < blackVue.dataImages.length && divList.scrollTop > 300 ){ console.log("Load more image");
            blackVue.dataImages_lastIndex += 20;
            blackVue.dataImagesComponent = blackVue.changeDataUriToBlob(blackVue.dataImages.slice(0, blackVue.dataImages_lastIndex));
          }
        }
    },
    changeDataUriToBlob: function(data){
      let dataComponent = JSON.parse(JSON.stringify(data));   // deeep copy of neasted array!!!!!
      for (let i = 0; i < data.length; i++) {
        dataComponent[i]["url"] = blackVue.getCleanImage2(data[i]["url"]);
      }
      return dataComponent;
    },
    toggleMenu: function(){   // on click menu icon
      //let vm = this;
      //setInterval(function(){console.log("Vue", vm.authenticated)}, 1000);
        this.closeOtherStuff();
        let x = document.getElementById("menuLinks");
        if (x.style.display === "block") {
          x.style.display = "none";
          document.getElementById("content").style.opacity = "1";
        } else {
          x.style.display = "block";
          document.getElementById("content").style.opacity = "0.1";
          // when click outside
          event.stopPropagation();
          document.querySelector(".container").addEventListener("click", function y(){
            x.style.display = "none";
            document.getElementById("content").style.opacity = "1";
            this.removeEventListener("click", y);
          });
        }
    },
    menuItem: function(e){   // on click menu item
        this.closeOtherStuff();
        let link = e.target.dataset.link;
        if(link == "greatblacks") {
          document.getElementById("map").style.display = "block";
          if(this.authenticated) document.getElementById("myAccount").style.display = "none";
        }
        else if(link == "myAccount") { console.log(this.authenticated)
          if(this.authenticated ){
              document.getElementById("map").style.display = "none";
              document.getElementById("myAccount").style.display = "block";
              document.getElementById("add").click();
          }
          else{
              // Get the login modal
              let modal = document.getElementById("loginModal");
              this.toggleModal(modal);
          }

        }
        else if(link == "api"){
          // Open API page
          //window.location.href = "/api";       // redirect
          window.open(window.location.origin+"/api/", "_blank");  // new tab
        }
        else if(link == "about"){ console.log(this.username, this.authenticated)
            // Get the about modal
            let modal = document.getElementById("aboutModal");
            this.toggleModal(modal);
        }
        else if(link == "logout"){
            let vm = this;
            axios.get(window.location.origin+"/logout/?redirect=no")
            .then((res) => {
              console.log(res.data)
              if(res.data.status == "success"){
                vm.authenticated = false;
                document.querySelector('#menuLinks a[data-link="greatblacks"]').click();
              }
            }, (error) => {   console.log('error',error); }
            );
        }
    },
    toggleModal: function(modal, ...other){   console.log("toggleModal");
      modal.classList.toggle("active");
      if(modal.classList.contains("active")){
        // hide all other modal if open  and  hide caroussel if open
        if (other.length > 0) { console.log("other:",other);
          this.closeOtherStuff(modal, ...other);  // skip additinal modal(list)
        }
        else {
          this.closeOtherStuff(modal);
        }

        document.querySelector(".container").style.opacity = "0.2";
        // When the user clicks anywhere outside of the modal, close it
        if(modal.id != "loginModal"){
          window.onclick = function(event) {
            if (event.target == modal) {
              modal.classList.remove("active")
              document.querySelector(".container").style.opacity = "1";
            }
          }
        }
      }
      else document.querySelector(".container").style.opacity = "1";
    },
    closeModal: function(e){
      let cross = e.target;
      let modal = cross.closest(".modal");
      modal.classList.remove("active");
      document.querySelector(".container").style.opacity = "1";
      if (modal.id == "showcase") {
        this.updateSlug(true);
      }
    },
    closeOtherStuff: function(modal, ...modals){
      // hide all other modal if open
        const listModal = ["showcase", "aboutModal", "loginModal", "share-modal"];
        let modals_ids = [];
        if(modals && Array.isArray(modals) && modals.length > 0){  // optional because ...param will be packaged to array
          modals_ids = modals.map((item) => { return item.id });
          modals_ids.push(modal.id);
           //console.log("map:", modal.id, modals_ids.length, Array.isArray(modals_ids) , modals_ids, "---", modals);
        }
        else if(modal && modals.length == 0 ){
          modals_ids = Array(modal.id);
        }
        for (let i = 0; i < listModal.length; i++) {
          const iModal = document.querySelector("#"+listModal[i]);
          if (modal) {
            if(iModal && !modals_ids.includes(listModal[i]) ) iModal.classList.remove("active");
          }
          else {
            if(iModal) iModal.classList.remove("active");
          }
        }
        // hide caroussel if open
        if(!modal && this.carousel) document.querySelector(".container").click();
    },
    openTab: function(e) { // on click myAccount tabs
       let target = e.target.closest("button");
       let i, tabcontent, tablinks;
       tabcontent = document.getElementsByClassName("tabcontent");
       for (i = 0; i < tabcontent.length; i++) {
         tabcontent[i].style.display = "none";
       }
       tablinks = document.getElementsByClassName("tablink");
       for (i = 0; i < tablinks.length; i++) {
         tablinks[i].classList.remove("active");
       }
       document.querySelector('.tabcontent[data-tab='+target.id+']').style.display = "block";
       target.classList.add("active"); console.log("tab:", target);
       // if after add new Great Black
       if(target.id == "add" && this.addSubmited) {
         this.resetAddTabAfterSubmit();
         this.addSubmited = false;
       }
    },
    resetAddTabAfterSubmit: function(){
      this.afterWikiRequest("show", null, true);
      document.querySelectorAll('.container-add .confirmation img.addGifSuccessOrError').forEach(e => e.parentNode.removeChild(e));
      //document.querySelector('.container-add .confirmation img#addError').remove();
      document.querySelector('.container-add .confirmation div.message').innerHTML = "";
      this.currentAddTab = 1;
      this.nextPrev(-1);
      this.initAddGreatBlack(null,false);
      // remove image photo
      document.querySelector('.confirm-details .photo img').src = this.onePixelUrl;
    },
    switchLoginTab: function(e){
      let tab = e.target;
      if(tab.id == "logInTab"){
        document.getElementById("signInTab").className = "";
        document.querySelector(".formRegister").style.display = "none";
        document.querySelector("#signInTab").style.opacity = "0.5";
        document.querySelector("#logInTab").style.opacity = "1";
        document.querySelector(".formLogin").style.display = "block";
      }
      else{
        document.getElementById("logInTab").className = "";
        document.querySelector(".formLogin").style.display = "none";
        document.querySelector("#logInTab").style.opacity = "0.5";
        document.querySelector("#signInTab").style.opacity = "1";
        document.querySelector(".formRegister").style.display = "block";
      }
      tab.className = "activeTab";
      // remove error message
      document.getElementById("loginMessage").innerHTML = "";
    },
    loginFormSubmit: function(e){
      console.log(e.target, e.target.action)
      const datas = {
        'username': e.target.querySelector('input[name="username"]').value
      }
      if(e.target.className == "formLogin") datas["password"] = e.target.querySelector('input[name="password"]').value
      else if(e.target.className == "formRegister") {
        datas["password1"] = e.target.querySelector('input[name="password1"]').value
        datas["password2"] = e.target.querySelector('input[name="password2"]').value;
        if(datas["password1"] != datas["password2"]) {
          document.getElementById("loginMessage").innerHTML = "The passwords are not identical.";
          return false;
        }
        else if(datas["password1"].length < 6) {
          document.getElementById("loginMessage").innerHTML = "Password must be greater than 5 characters.";
          return false;
        }
      }
      let vm = this;
      this.postAxios(e.target.action, datas, function(response){
        console.log(response)
        if(response.data.status == "success"){
            vm.authenticated = true;    // will automatically close modal
            vm.username = response.data.user;
            if(e.target.className == "formLogin") {vm.getUserData();}
            // show myAccount
            // setTimeout to fix bug trying to get myAccount when not yet rendring
            setTimeout(() => { // setTimeout to put this into event queue
              document.getElementById("map").style.display = "none";
              document.getElementById("myAccount").style.display = "block";
            }, 0)
            document.querySelector(".container").style.opacity = "1";
        }
        else{
           if(response.data.message != undefined) document.getElementById("loginMessage").innerHTML = response.data.message;
        }
      });

    },
    alertRecovery: function(){
      alert("Forgot your password?\n"+
             "Don't take the hassle out of it, create a new account!");
    },
    changePassword: function(){
      let currentPassword = document.querySelector('.changePassword input[name=current-password]').value;
      let newPassword = document.querySelector('.changePassword input[name=new-password]').value;
      if(currentPassword.length < 6 || newPassword.length < 6){
        document.querySelector('#changePasswordMessage').innerHTML = '<span class="red">Password must be greater than 5 characters.</span>';
        return false;
      }
      const datas = {
        'username': this.username,
        'password': currentPassword,
        'new_password': newPassword
      }
      this.postAxios(window.location.origin+"/changePassword/", datas, function(result){
        console.log(result.data)
        if(result.data.status == "success") document.querySelector('#changePasswordMessage').innerHTML = '<span class="green">Passsword Changed successfully.</span>';
        else{
          if(result.data.message != undefined && result.data.message != "") {
            document.querySelector('#changePasswordMessage').innerHTML = '<span class="red">'+result.data.message+'</span>';
          }
          else{
            document.querySelector('#changePasswordMessage').innerHTML = '<span class="red">Password change was not successful.</span>';
          }
        }
      });
    },
    generateToken: function(){
      document.querySelector(".apiKey #apikeyMessage").innerHTML = "";
      if(document.querySelector(".apiKey button#generateToken").className == "disabled") return;
      const datas = {
        'username': this.username
      }
      this.postAxios(window.location.origin+"/generateToken/", datas, function(result){
        console.log(result.data)
        if(result.data.status == "success"){
          let inputToken = document.querySelector(".apiKey .token input.input-token");
          if(inputToken) inputToken.value = result.data.token;
          let button = document.querySelector(".apiKey button#generateToken");
          if(button) button.className = "disabled";
        }
        else{
          document.querySelector(".apiKey #apikeyMessage").innerHTML = '<span class="red">Something went wrong, please try again.</span>';
        }
      });
    },
    copyToken: function(){
          if(document.querySelector(".apiKey .token input.input-token").value == "") return;
          // select the token text OPTIONAL
          document.querySelector(".apiKey .token input.input-token").select();
          // copy token text
          document.execCommand("copy");
    },
    deleteToken: function(){
      if(document.querySelector(".apiKey .token input.input-token").value == "") return;
      let vm = this;
      document.querySelector(".apiKey .token button.delete").style.display = "none";
      document.querySelector("#undo").style.display = "initial";
      let token = document.querySelector(".apiKey .token input.input-token").value;
      document.querySelector(".apiKey .token input.input-token").value = ""; // clear token
      const datas = {"username": this.username}
      let delay = setTimeout(function(){
        vm.postAxios(window.location.origin+"/deleteToken/", datas, function(result){
          document.querySelector(".apiKey .token button.delete").style.display = "initial";
          document.querySelector("#undo").style.display = "none";
          if(result.data.status == "success") {
            document.querySelector(".apiKey button#generateToken").className = "generateToken";  // activate button
            document.querySelector(".apiKey .token input.input-token").value = "";  // clear token input value
          }
        });
      },5000);
      document.querySelector("#undo").onclick = function(){
        clearTimeout(delay);
        document.querySelector(".apiKey .token button.delete").style.display = "initial";
        document.querySelector("#undo").style.display = "none";
        document.querySelector(".apiKey .token input.input-token").value = token;
      }

    },
    deleteMyAccount:function(){
      let pass = document.querySelector(".delete-account input").value;
      const datas = {
        'username': this.username,
        'password': pass,
      }
      if(pass != "" && pass.length >= 6){
          this.postAxios(window.location.origin+"/deleteAccount/", datas, function(result){
            console.log(result.data)
            if(result.data.status == "success") window.location.reload();
          });
      }

    },
    getUserData: function(){
      // get user token
      const datas = { "username": this.username};
      this.postAxios(window.location.origin+"/getUserData/", datas, function(result){
        if(result.data.token.status == "success" && result.data.token.token != ""){
          // fill token if exist
          document.querySelector(".apiKey .token input.input-token").value = result.data.token.token;
          document.querySelector(".apiKey button#generateToken").className = "disabled";
        }
        else{
          document.querySelector(".apiKey button#generateToken").className = "generateToken";  // activate button
          document.querySelector(".apiKey .token input.input-token").value = "";  // clear token input value
        }
        if(result.data.history.status == "success" && result.data.history.list != ""){
            document.querySelectorAll(".container-history li.table-row").forEach((el)=>{
              el.remove();
            });
          let list = []
          try{
            list = JSON.parse(result.data.history.list);
          }
          catch{
            console.log("JSON Error");
          }
          let rows = "";
          for (let i=list.length-1; i >= 0; i--) {
            let status = "PENDING";
            if(parseInt(list[i]['status']) == 2) status = '<span class="greenLigth">COMPLETED</span>';
            else if(parseInt(list[i]['status']) == 3) status = '<span class="red">DECLINED</span>';
            const name = (status.match("COMPLETED")) ? ('<a href="'+list[i]['internal_link'] + '">'+list[i]['name']+'</a>') : list[i]['name']
            rows += '<li class="table-row"><div data-label="Id" class="col col-1">'+(i+1)+
                    '</div> <div data-label="Name" class="col col-2">'+ name +
                    '</div> <div data-label="Date" class="col col-3">'+ list[i]['date'] +
                    '</div> <div data-label="Status" class="col col-4">' + status + '</div></li>';
          }
          const header = document.querySelector(".container-history ul").innerHTML;
          document.querySelector(".container-history ul").innerHTML = header + rows;
        }
        console.log(result.data)
      });
    },
    initAddGreatBlack: function(e, reverse=true){
      if(reverse == true){  console.log("init1:",this.currentAddTab);
        document.querySelector(".container-add button#add-new-black").style.display = "none";
        document.querySelector(".container-add #addForm").style.display = "initial";
        this.showAddTab(this.currentAddTab); // Display the current add slide (.tab)
      }
      else { console.log("init2:",this.currentAddTab)
        document.querySelector(".container-add button#add-new-black").style.display = "initial";
        document.querySelector(".container-add #addForm").style.display = "none";
        this.currentAddTab = 0; // Display the current add slide (.tab)
        document.querySelector("#addForm input#wiki-link").value = "";
      }
      // load loading gif only once and be ready
      let loading = document.querySelector('#addWiki-loading');
      if(!loading.classList.contains("loaded")) {
        loading.classList.add("loaded");
        loading.src = static+"greatblacks/images/loading.gif";
      }
    },
    showAddTab: function(n) {
      // This function will display the specified tab of the form...
      let x = document.querySelectorAll(".container-add .tab");
      x[n].style.display = "block";
      //... and fix the Previous/Next buttons:
      if (n == 0) {
        document.getElementById("prevBtn").style.display = "none";
      } else {
        document.getElementById("prevBtn").style.display = "inline";
      }
      if (n == (x.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Submit";
      } else {
        document.getElementById("nextBtn").innerHTML = "Next";
      }
    },
    nextPrev:function(n){    // n == -1 for prevBtn, n == 1 for nextbtn
       if(blackVue.wikiLinkChange == "stop" || this.addSubmited ) return false;  // do not try again
        // This function will figure out which tab to display
        let x = document.getElementsByClassName("tab");
        // Exit the function if any field in the current tab is invalid:
        let validate = this.validateAddForm(n);
        if (n == 1 && !validate) return false;
        // Hide the current tab:
        x[this.currentAddTab].style.display = "none";
        // Increase or decrease the current tab by 1:
        this.currentAddTab = this.currentAddTab + n;
        // if you have reached the end of the form...
        if(this.currentAddTab >= x.length) {
          // ... the form gets submitted:
          if(validate) document.getElementById("addForm").submit();
          return false;
        }
        // Otherwise, display the correct tab:
        this.showAddTab(this.currentAddTab);
    },
    onConfirmDetails: function(){
      const isVisible = window.getComputedStyle(document.querySelector(".container-add #prevBtn")).display === "none";
      return !isVisible;
    },
    validateDate: function(input){
      if(event && event.type == "change") input = event.target;
      const date = new Date();  console.log("input:", input);
      const year = date.getFullYear();
      let pattern = false;  // redefined here
      const res = input.value.trim().match(/^(([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})$)|^([0-9]{4}$)|^(-[0-9]+$)/);
      if(res != null){
        pattern = true;
        if(res[1] != undefined){   // date 2000-12-01
          if(res[2] != undefined && res[3] != undefined && res[4] != undefined){
            if(Date.parse(res[1]) > date) pattern = false;   // check if date 2000-12-01 not in the future
            if(!(parseInt(res[2]) <= year && parseInt(res[2]) >= 0 &&   // year
               parseInt(res[3]) <= 12 && parseInt(res[3]) > 0 &&   // month
               parseInt(res[4]) <= 31 && parseInt(res[4]) > 0     // day
             )) pattern = false;
          }
          else pattern = false;
        }
        if(res[5] != undefined){   // year 2000
          if(!(parseInt(res[5]) <= year && parseInt(res[5]) >= 0)) pattern = false;
        }
        if(res[6] != undefined){   // BC -2000
          if(!(parseInt(res[6]) < 0 )) pattern = false;
        }
      }
      if(input.attributes.name.value == "death" && input.value.trim() == "") pattern = true;  // for empty death
      // change icon for indufidual input change
      if(input.attributes.name.value == "born") {
        if(pattern) {
          this.toggleCheckIcon("born", "dataUri-check-circle");
          input.classList.remove("invalid");
        }
        else this.toggleCheckIcon("born", "dataUri-times-circle");
      }
      if(input.attributes.name.value == "death") {
        if(pattern) {
          this.toggleCheckIcon("death", "dataUri-check-circle");
          input.classList.remove("invalid");
        }
        else this.toggleCheckIcon("death", "dataUri-times-circle");
      }

      return pattern;
    },
    validateAddForm: function(n, ignoreButtonIsDisabled=false){
      // remove error messages
      document.querySelectorAll('.tab span.red').forEach((item) => {
        item.innerHTML = "";
      });
      // This function deals with validation of the form fields
      let tab, input, i, valid = true;
      tab = document.getElementsByClassName("tab")[this.currentAddTab];
      input = tab.querySelectorAll('input[type="text"]');
      // A loop that checks every input field in the current tab:
      for (i = 0; i < input.length; i++) {
        if(input[0].id == "wiki-link") break;   // to skip field verification on add step
        let pattern = true;  console.log("input:",input);
        input[i].classList.remove("invalid");
        if(input[i].attributes.readonly != undefined) continue;   // do not check readonly field
        if(input[i].attributes.name.value == "born" || input[i].attributes.name.value == "death") {  console.log("born or death", input[i].attributes.name.value);
           pattern = this.validateDate(input[i]);
        }
        if(input[i].attributes.name.value == "country"){ console.log("length:",input[i].value.length)
          if(input[i].value.trim().match(/^[a-z][a-z \.-]+$/i) == null || input[i].value.length > 50) pattern = false;
        }
        if(input[i].className == "disabled") pattern = true; // to skip the disabled one in case not formated well

        console.log(input[i].attributes.name.value, pattern);
        let icon = input[i].nextSibling;
        // If a field is empty...
        if ((input[i].value == "" && input[i].attributes.required != undefined) || pattern == false) { console.log("eval:",input[i].attributes.name.value, input[i].value,pattern);
          input[i].className += " invalid";    // add an "invalid" class to the field:
          valid = false;   // and set the current valid status to false
          // show error icon
          if(icon) icon.className = "dataUri-times-circle";
        }
        else{
          if(icon) icon.className = "dataUri-check-circle";  // show success icon
        }

      }

      // check category
      if(document.querySelectorAll('.confirm-details ul[name="category"] input[type="checkbox"]:checked').length == 0){
        valid = false;
        this.toggleCheckIcon("category", "dataUri-times-circle");
      }
      else this.toggleCheckIcon("category", "dataUri-check-circle");
      // check country
      const checkedCountry = document.querySelectorAll('.confirm-details select[name="country"] option:checked');
      if( checkedCountry.length == 0 || checkedCountry.length > 3 || checkedCountry[0].value == ""){
        valid = false;
        this.toggleCheckIcon("country", "dataUri-times-circle");
      }else this.toggleCheckIcon("country", "dataUri-check-circle");

      // check button buton disabled
      if (!ignoreButtonIsDisabled){
        if (document.querySelector("#nextBtn.disabled") != null) {
          valid = false;
        }
      }

      if(tab != undefined){
        console.log(tab, input)
        if( tab.dataset.name == "addWikiLink" ){
          // remove preview data
          document.querySelector(".container-add .preview .image").innerHTML = "";
          document.querySelector(".container-add .preview .link").innerHTML = "";
          // check if wiki url provided
          console.log(input, input[0])
          if(input[0].value.trim().match(/^https:\/\/[a-zA-Z-.]+\.wikipedia\.org\/wiki\/[^\s]+$/) == null){
            valid = false;
            tab.querySelector("span.red").innerHTML = "Please provide a Wikipedia link.";
          }
          else{
            tab.querySelector("span.red").innerHTML = "";
            if(blackVue.wikiLinkChange == true){
                console.log("input:",input[0].value)
                // reset variables
                black_name = birth_date = birth_place = death_date = death_place = wikiName = country = imageName = image_url =
                             occupation = known_for = category = summary = undefined;
                console.log("...", black_name, birth_date, birth_place, death_date, death_place, wikiName, country, occupation, known_for);
                // make Api Call
                const wiki_Name = input[0].value.trim().replace(/.*\//,"").replace(/#.*/,"").replace(/\?.*/,"");
                /*
                // get revisions
                https://en.wikipedia.org/w/api.php?format=json&action=query&prop=revisions&rvprop=content&rvsection=0&titles="+wiki_Name
                // get image way 1
                https://en.wikipedia.org/w/api.php?format=json&action=query&prop=pageimages&format=json&pithumbsize=400&titles="+encodeURIComponent(wikiName)
                // get image way 2, see far below
                https://en.wikipedia.org/w/api.php?format=json&action=query&titles=Image:'+imageName+'&prop=imageinfo&iiprop=url
                // summary
                https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles="+wikiName
                */
                // combo call API
                const url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts|revisions|pageimages|imageinfo"+
                          "&rvslots=main&rvprop=content&rvsection=0&pithumbsize=400&exintro&explaintext&redirects=1&titles="+decodeURIComponent(wiki_Name);
                blackVue.fetchAsScript(decodeURIComponent(wiki_Name), url, "checkWiki1", "checkWikiData1");
                // stop and wail until request finish
                document.querySelector('.tab[data-name="addWikiLink"]').style.display = "none";
                document.querySelector('#addForm button#nextBtn').style.display = "none";
                document.querySelector('#addWiki-loading').style.display = "initial";
                blackVue.wikiLinkChange = false;
                console.log("url1:",url, "wiki_Name:",wiki_Name)
                return false;
            }
            else{  // show old confirmDetails
              console.log("here confirm-details again");
              blackVue.confirmDetailsInfos();
              return false;
            }
          }
        }
        else if( tab.dataset.name == "confirm-details" && valid == true && !blackVue.addSubmited ){
          if(n != 1 || !blackVue.onConfirmDetails() ) return false;
          // submit data AddForm
           console.log("here confirm-details");
           document.querySelector('.container-add div[data-name="confirm-details"]').style.display = "none";
           document.querySelector('#addForm button#prevBtn').style.display = "none";
           document.querySelector('#addForm button#nextBtn').style.display = "none";
           document.querySelector('#addWiki-loading').style.display = "initial";
           // get categories
           if(category != undefined) category = category.substring(0, 100)+"|"      // limit category string in case long text pass, 100 for cat from Wiki and 100 from user
           else  category = "";
           document.querySelectorAll('.confirm-details .checkboxList input[type="checkbox"]').forEach((el) => {
               category += (el.checked) ? el.name+"," : "";
           });
           category = category.replace(/\|$/,"").replace(/,$/,"");
           // get countries
           let country_user = [];
           document.querySelectorAll('.confirm-details select[name="country"] option:checked').forEach((el) => {
               country_user.push(el.value);
           });
           const data = {
             'wikiName':  (wikiName) ? decodeURIComponent(wikiName.replace(/\s/g,"_")) : null,
             'image_url':  image_url || null,
             'summary':  summary || null,
             'black_name': (black_name) ? decodeURIComponent(black_name.replace(/_/g," ")) : null || (wikiName) ? decodeURIComponent(wikiName.replace(/_/g," ")) : null,         // other way ternary
             'birth_date': birth_date || document.querySelector('.confirm-details input[name="born"]').value,
             'death_date': death_date || document.querySelector('.confirm-details input[name="death"]').value,
             'country_user':  country_user || null,
             'country_wiki':  country || null,
             'category': category || null
           };
           this.submitNewGreatBlack(data);
           return false;
        }
      }
      return valid; // return the valid status
    },
    formatStrDate: function(date){
        date = date.replace(/\(.*\)/,"");
        let d = new Date(date);  // undefined or invalid date, if not a string date

        if(d && !isNaN(d.getTime())){
          let month = '' + (d.getMonth() + 1);
          let day = '' + d.getDate();
          let year = d.getFullYear();

          if (month.length < 2) month = '0' + month;
          if (day.length < 2) day = '0' + day;

          return [year, month, day].join('-');
        }
        else return "";
    },
    checkWikiData1: function(data){
        console.log("data:",data);
        const page = data.query.pages;
        console.log(data.query.pages);

        const pageId = Object.keys(data.query.pages)[0];
        wikiName = decodeURIComponent(document.querySelector("#checkWiki1").dataset.wikiName);
        //blackVue.wikiLinkChange = true;
        // data exist
        console.log("pageId:",pageId, "page[pageId]:",page[pageId].revisions)
        if(pageId != -1){

          let content;
          // get image name
          imageName = page[pageId].pageimage

          try{
            content = page[pageId].revisions[0]['slots']['main']['*'];
            content = content.replace(/\\n/g,"\\").replace(/[↵\r\n]/g,"\\");  // to avoid js convertin break lines to ↵
            if(imageName == undefined ){
              let search_Image = content.match(/\|\s*image\s*=([^\\<]+)/i);
              if(search_Image != null && search_Image[1].trim() != "" && imageName == undefined) {
                imageName = encodeURIComponent(search_Image[1].trim().replace(/ /g,"_"));
              }
            }
            console.log("hereeeeeeeeeeee",imageName);
          } catch (e) {
            console.log(e)
            return;
          }


          // update wiki_name if was REDIRECTED
          if(data.query.redirects) wikiName = data.query.redirects[0].to.replace(/\s/g,"_");
          // get name
          black_name = page[pageId].title

          // get summary
          summary = page[pageId].extract

          let waitForPromise = false;

          // check if url image exist
          if(page[pageId].thumbnail != undefined){
              image_url = page[pageId].thumbnail.source;
              console.log("image_url:", image_url);
          }
          else{  console.log("image_url not found chech another way:", imageName);
            // check url image again with another way
            if(imageName != undefined){
              waitForPromise = true;
              const url = 'https://en.wikipedia.org/w/api.php?format=json&action=query&titles=Image:'+imageName+'&prop=imageinfo&iiprop=url';
              blackVue.fetchAsScript("imageName", url, "checkWikiImage2", "checkWikiImage2");
            }
          }

          //console.log("step1:","black_name:",black_name, "imageName:",imageName,"summary:",summary, "image_url:", image_url);
          // ckech content for more info
          if(page[pageId].revisions != undefined && content){
                //console.log("content:",content)
                let search_Name = content.match(/\|\s*name\s*=([^\n\\<]+)/i);
                let search_Image = content.match(/\|\s*image\s*=([^\\<]+)/i);
                //let search_Image = content.match(/\|\s*image\s*=\s*(.+\.(jpg|jpeg|png|apng|svg|BMP|JFIF|Exif|TIFF|GIF|WebP))\s*\n\s*\|/i);
                let search_birth_date = content.match(/\|\s*birth_date\s*=\s*([^}\\<]+)/i);
                let search_birth_place = content.match(/\|\s*birth_place\s*=([^\\<]+)/i);
                let search_death_date = content.match(/\|\s*death_date\s*=\s*([^}\\<]+)/i);
                let search_death_place = content.match(/\|\s*death_place\s*=([^\\<]+)/i);
                let search_occupation = content.match(/\|\s*occupation\s*=([^\\<]+)/i);
                let search_known_for = content.match(/\|\s*known_for\s*=([^\\<]+)/i);

                //console.log("Init search_Name:",search_Name, "search_birth_date:",search_birth_date, "search_birth_place:",search_birth_place);
                if(search_Name != null && black_name == undefined){
                  black_name = search_Name[1].replace(/[\[\]{}|]/g,"").trim();
                }
                if(search_birth_date != null ){
                  let strDate = blackVue.formatStrDate(search_birth_date[1]);
                  if( strDate == ""){
                    birth_date = search_birth_date[1].replace(/[^0-9]*\|/,"").replace(/\|[^0-9]*$/,"").replace(/ [^\|]*/,"").replace(/\|/g,"-").replace(/[^0-9-]*/g,"").trim();
                  }
                  else birth_date = strDate;
                }
                if(search_birth_place != null){
                  birth_place = search_birth_place[1].replace(/.*, /,"").replace(/.*\|/,"").replace(/[\[\]{}|]/g,"").replace(/[0-9]/g,"").trim();
                }
                if(!imageName && search_Image != null && search_Image[1].trim() != "" && imageName == undefined) {  // not sure it's use full to search again
                  imageName = encodeURIComponent(search_Image[1].trim().replace(/ /g,"_"));
                }
                if(search_death_date != null && search_death_date[1].trim() != "") {
                  let strDate = blackVue.formatStrDate(search_death_date[1]);
                  if( strDate == ""){
                    death_date = search_death_date[1].replace(/[^0-9]*\|/,"").replace(/\|[^0-9]*$/,"").replace(/\|/g,"-").replace("-"+birth_date,"").replace(/[^0-9-]*/g,"").trim();
                  }
                  else death_date = strDate;
                }
                if(search_death_place != null && search_death_place[1].trim() != "") {
                  death_place = search_death_place[1].replace(/.*, /,"").replace(/.*\|/,"").replace(/[\[\]{}|]/g,"").replace(/[0-9]/g,"").trim();
                }
                if(search_occupation != null && search_occupation[1].trim() != "") {
                  occupation = search_occupation[1].replace(/[\[\]{}|]/g,"").trim();
                  category = occupation + ',';
                }
                if(search_known_for != null && search_known_for[1].trim() != "") {
                  known_for = search_known_for[1].replace(/[\[\]{}|]/g,"").trim();
                  category = (occupation != undefined) ? occupation + ',' + category : category;
                }
                category = (category != undefined) ? category.replace(/,$/,"") : undefined;
                country = (birth_place != undefined && birth_place != death_place && death_place != undefined) ? birth_place +','+ death_place : birth_place;

                console.log("End black_name:", black_name, "End Birth:", birth_date, birth_place, "death:", death_date, death_place, "occupation:", occupation, known_for);
                if(image_url){
                  blackVue.checkDatabase();
                }
                else {  // show tab
                  if(!waitForPromise){
                    blackVue.afterWikiRequest("show", "Sorry I couldn't find a picture of the person.", true); //This link does not appear to be the page of a person with photo.
                  }
                }
                return;
            }
        }
        else{
          console.log("error exist", page, pageId);
            // show tab
          blackVue.afterWikiRequest("show", "Sorry, this wikipedia page does not seem to exist.", true);
        }
    },
    checkWikiImage2: function(data){
        console.log("data3:",data);
        const pages = data.query.pages;
        for( pageId in pages){
          if(pages[pageId].imageinfo != undefined) {
            image_url = pages[pageId].imageinfo[0]["url"];
            break;
          }
        }
        if(image_url != undefined && image_url != ""){  // raison for waitForPromise
          blackVue.checkDatabase();
          console.log("image_url:", image_url);
        }
        else{
          // image not found, stop: store link for check later raison="image_url == null"
          blackVue.afterWikiRequest("show", "This link does not appear to be the page of a person with photo.", true);
        }
        blackVue.waitForPromise = false;
        blackVue.afterWikiRequest(null);
    },
    checkDatabase: function(){
        // check if wikilink already exists
        this.postAxios(window.location.origin+"/doesGreatBlackExist/", {'wiki_Name': decodeURIComponent(wikiName)}, function(response){
          console.log(response)
          if(response.data.exist == "yes"){
            console.log("yes exist");
            blackVue.afterWikiRequest("show", null, "stop");  // undefined to do not allow try again

            // check if link was not already rejected (DECLINED)
            if(response.data.status == "DECLINED"){
              document.querySelector('.container-add div[data-name="addWikiLink"] span.red').innerHTML = "Thanks, but this link has already been submitted and declined.";
              return;
            }
            let previewImage = document.querySelector(".container-add .preview .image");
            let previewLink = document.querySelector(".container-add .preview .link");
            document.querySelector('.container-add div[data-name="addWikiLink"] span.red').innerHTML = "Thanks, but this link has already been added.";
            let i = document.createElement("img");
            i.src = response.data.image;
            i.onload = function (){
              let t = document.createElement("h3");
              t.innerHTML = response.data.name;
              previewLink.appendChild(t);
              if(response.data.status == "PENDING"){
                let d = document.createElement("div");
                d.innerHTML = 'STATUS: PENDING';
                previewLink.appendChild(d);
              }
              else{
                let d = document.createElement("div");
                d.innerHTML = '<a href="'+response.data.internal_link+'" >'+response.data.internal_link+'</a>';
                previewLink.appendChild(d);
              }
            }
            previewImage.appendChild(i);
          }
          else{
            // show next step confirm Details
            blackVue.confirmDetailsInfos();
            blackVue.afterWikiRequest("", null, false);
          }
        });
    },
    confirmDetailsInfos: function(){
          // image found we can proceed
          document.querySelector('.confirm-details .photo img').src = image_url;
          // move to next tab
          blackVue.currentAddTab = 1;
          blackVue.showAddTab(blackVue.currentAddTab);
          // all good fill data  or  allow user to input data
          document.querySelectorAll('.confirm-details .details input').forEach((el)=>{
            el.value = "";
            el.className = "";
            el.removeAttribute("readonly");
          });
          // unselect category checkboxes
          document.querySelectorAll('.confirm-details .details .checkboxList li').forEach((el)=>{
            el.querySelector('input[type="checkbox"]').checked = false;
            el.className = "";
            el.removeAttribute("readonly");
          });
          // unselect copuntry selections
          document.querySelector('.confirm-details select[name="country"]').selectedIndex = -1;
          // hide checks
        /*  document.querySelectorAll('.confirm-details .details i[name]').forEach((el)=>{
            el.style.visibility = "hidden";
          });*/

        console.log("name:", black_name, decodeURIComponent(wikiName).replace(/\(.*/,"").replace(/[_]/g," "))
        this.toggleCheckIcon("name", "dataUri-check-circle", 300);
        if(black_name){
          document.querySelector('.confirm-details .details input[name="name"]').value = black_name;
          document.querySelector('.confirm-details .details input[name="name"]').className = "disabled";
          document.querySelector('.confirm-details .details input[name="name"]').setAttribute("readonly", true);
        }
        else{
          document.querySelector('.confirm-details .details input[name="name"]').value = decodeURIComponent(wikiName).replace(/\(.*/,"").replace(/[_]/g," ");
          document.querySelector('.confirm-details .details input[name="name"]').className = "disabled";
          document.querySelector('.confirm-details .details input[name="name"]').setAttribute("readonly", true);
        }
        // for category: too much work and not enougth standard category

        // category: show icon by default
        this.toggleCheckIcon("category", "dataUri-times-circle", 600);

        if(birth_date && birth_date.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/) ){
          document.querySelector('.confirm-details .details input[name="born"]').value = birth_date;
          document.querySelector('.confirm-details .details input[name="born"]').className = "disabled";
          document.querySelector('.confirm-details .details input[name="born"]').removeAttribute("required");
          document.querySelector('.confirm-details .details input[name="born"]').setAttribute("readonly", true);
          this.toggleCheckIcon("born", "dataUri-check-circle", 900);
        }
        else{
          birth_date = "";
          this.toggleCheckIcon("born", "dataUri-times-circle", 900);
        }
        if(death_date && death_date.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/)){
          document.querySelector('.confirm-details .details input[name="death"]').value = death_date;
          document.querySelector('.confirm-details .details input[name="death"]').className = "disabled";
          document.querySelector('.confirm-details .details input[name="death"]').setAttribute("readonly", true);
          this.toggleCheckIcon("death", "dataUri-check-circle", 1200);  // else optional (enpty)
        }
        else death_date = "";

        /*
        if(country){   //country get from API, now skiped because not relevante
          document.querySelector('.confirm-details .details input[name="country"]').value = country;
          document.querySelector('.confirm-details .details input[name="country"]').className = "disabled";
          document.querySelector('.confirm-details .details input[name="country"]').removeAttribute("required");
          document.querySelector('.confirm-details .details input[name="country"]').setAttribute("readonly", true);
          setTimeout(function(){
            document.querySelector('.confirm-details .details i[name="country"]').style.visibility = "visible";
          },1200)
        }*/
        //  show icon by default
        this.toggleCheckIcon("country", "dataUri-times-circle", 1500);
        // for back from first step
        this.checkCategory();
        this.chooseCountry();
        // not enougth info found, stop: store link for ckeck later raison="search_Name != null && search_birth_date != null && search_birth_place != null"
        console.log("IMAGE: Name:", black_name, "birth_date:", birth_date, birth_place, "death_date:", death_date, death_place, "wikiName:",wikiName, "country:", country, "occupation:",occupation, known_for);
        // document.querySelector('.tab[data-name="addWikiLink"] span.red').innerHTML = "An error occured please try another link."
    },
    toggleCheckIcon: function(name, classname, time){
      if(time && this.animationChecks){
        setTimeout(function(){
          document.querySelector('.confirm-details .details i[name="'+name+'"]').className = classname;
        },time)
        this.animationChecks = false;
      }
      else{
        document.querySelector('.confirm-details .details i[name="'+name+'"]').className = classname;
      }
    },
    afterWikiRequest: function(status, message=null, change=null){
      if(status == "show") document.querySelector('.tab[data-name="addWikiLink"]').style.display = "block";
      if(message != null) document.querySelector('.tab[data-name="addWikiLink"] span.red').innerHTML = message;
      if(change !== null) blackVue.wikiLinkChange = change;     // if true, allow him/her to try again the same link without change
      document.querySelector('#addForm button#nextBtn').style.display = "initial";
      document.querySelector('#addWiki-loading').style.display = "none";
    },
    clickCheckboxCategory: function(e){
      let checkbox;
      if(e.target.tagName != "INPUT") checkbox = e.target.querySelector("input");   // "LI","P"
      else {
        checkbox = e.target;
        checkbox.checked = !checkbox.checked;
      }
      // stop for readonly li
      if(e.target.closest("li").attributes.readonly != undefined) return;
      console.log(e.target)
      if(checkbox.checked == false) {
        e.target.closest("li").className = "selected";
        checkbox.checked = true;
      }
      else{
        e.target.closest("li").className = "";
        checkbox.checked = false;
      }
      // check if other is checked
      if(document.querySelector('.confirm-details .checkboxList input[type="checkbox"][name="other"]').checked){
        document.querySelectorAll('.confirm-details .checkboxList input[type="checkbox"]').forEach((el) => {
            if(el.attributes.name.value != "other"){
              el.checked = false;
              el.closest('li').classList.remove('selected')
            }
        });
      }
      this.checkCategory();
    },
    checkCategory: function(){
      if(document.querySelectorAll('.confirm-details ul[name="category"] input[type="checkbox"]:checked').length == 0){
        this.toggleCheckIcon("category", "dataUri-times-circle");
      } else  this.toggleCheckIcon("category", "dataUri-check-circle");
    },
    chooseCountry: function(){
        const selectedCountries = document.querySelectorAll('.confirm-details select[name="country"] option:checked');
        if(selectedCountries.length == 0 || selectedCountries.length > 3 || selectedCountries[0].value == ""){
          this.toggleCheckIcon("country", "dataUri-times-circle");
          if(selectedCountries.length > 3){
              selectedCountries[0].closest("div").parentElement.querySelector("span[title] sup").innerHTML = '3 max!';
              return;
          }
        } else {
          this.toggleCheckIcon("country", "dataUri-check-circle");
        }
        document.querySelector('.confirm-details select[name="country"]').closest("div").parentElement.querySelector("span[title] sup").innerHTML = '';

    },
    fetchAsScript: function(name, url, id, callback){
        if(document.getElementById(id) != null) document.getElementById(id).remove();  // Delete script #checkWiki1 or #checkWiki2 if exist
        let s = document.createElement("script");
        s.src = url+"&callback="+callback;
        s.id = id;
        s.dataset.wikiName = name;
        document.body.appendChild(s);
    },
    submitNewGreatBlack: function(data){
        // add New Great Black
        this.postAxios(window.location.origin+"/addNewGreatBlack/", data, function(result){
          document.querySelector('#addWiki-loading').style.display = "none";
          blackVue.addSubmited = true;
          if(document.getElementById('addSuccess') != null) document.getElementById('addSuccess').remove();
          if(document.getElementById('addError') != null) document.getElementById('addError').remove();
          let imgParent = document.querySelector('#addForm .confirmation');
          if(result.data != undefined && result.data.status == "success"){
            // reload image to restart animation
            let img = document.createElement('img');
            img.id = "addSuccess";
            img.className = "addGifSuccessOrError";
            img.src = static+"greatblacks/images/confirm-success.gif";
            img.onload = function(){
              this.style.display = "initial";
              document.querySelector('.container-add .confirmation div.message').innerHTML = '<span class="green">The data sent has been successfully saved.</span>';
            }
            imgParent.insertBefore(img, imgParent.firstChild);
            // update history
            blackVue.getUserData();
          }
          else{
            let img = document.createElement('img');
            img.id = "addError";
            img.className = "addGifSuccessOrError";
            img.src = static+"greatblacks/images/confirm-error.gif";
            img.onload = function(){
              this.style.display = "initial";
              document.querySelector('.container-add .confirmation div.message').innerHTML = '<span class="red">The data sent could not be successfully validated.</span>';
            }
            imgParent.insertBefore(img, imgParent.firstChild);
          }
          console.log(result.data)
        });
    },
    postAxios: function(url, datas, callback){
      const config =
      {
          headers: {
              'method':'POST',
              'accept': '*/*',
              'content-type': 'application/json;charset=UTF-8'
          }
      };
      // check localy if not get from server and store it locally
      let key = JSON.stringify(url)+JSON.stringify(datas);
      if(key in this.postAxiosResponses) {callback(this.postAxiosResponses[key]);}
      else{
        axios.post(url, datas, config)
        .then((res) => {
          if(res && res.data && res.data.status && res.data.status == "success"){
            blackVue.postAxiosResponses[key] = res;  // save response only on succes in case error server
          }
          callback(res);
        }, (error) => {   console.log('error',error); }
        );
      }
    },
/////////////////////////////////// function for MAP //////////////////////////////////////////////////////////////////
    resetCarousel: function(){
      const cards = document.querySelectorAll(".card img");
      if(cards) cards.forEach((el)=>{
        el.src = this.onePixelUrl;
      });
      this.resetDataImages();
    },
    resetDataImages: function(){
        // reset events
        if (this.carousel) {
          for (let i = 0; i < this.carousel.elementsListener.length; i++) {
            this.carousel.elementsListener[i].removeAllEventListener();
            console.log("remove!");
          }
        }
        this.carousel = null;
        // destroy the 5 blob images
        for (key in this.objectURL.length) {
          if(key != "count" ) this.objectURL.revokeObjectURL(this.objectURL[key]);
        }
        this.dataImages = [];
        this.lastBlobImages = {'count':[]};
        // destroy component data
        for (let i = 0; i < this.objectURL2.length; i++) {
          this.objectURL2.revokeObjectURL(i);
        }
        this.dataImagesComponent = [];
        this.dataImagesComponent_backup = [];
        this.lastBlobImages2 = {};
        //reset search text
        document.getElementById("input_search").value = "";
    },
    show3D_Or_List: function(checkbox){
      if (checkbox.checked) {
        document.querySelector(".card-carousel .carousel").style.visibility = "hidden";
        document.querySelector(".map-container .name").style.opacity = "0";
        blackVue.addListImages(blackVue.dataImages);
      }
      else{
        document.querySelector(".carousel-container .list").style.display = "none";
        document.querySelector(".map-container .name").style.opacity = "1";
        document.querySelector(".card-carousel .carousel").style.visibility = "visible";
        blackVue.updateBlackName();
      }
      // on first load List image
      let description = document.querySelector(".carousel-container .description");
      if (description) {description.classList.remove('visible'); }  // hide description
      let activeCard = document.querySelector(".siblinggsCarourel.list .gallery.active");
      if(activeCard) {activeCard.classList.remove('active');} // hide share icon and border gallery
    },
    hideCarousel: function(e){
      if(!e.target.classList.contains("ignore")){
        this.isViewModeList = false;
        console.log("hide Carousel:")
        document.querySelector("#map span.name").style.display = "none";
        document.querySelector("#map .countryName").style.display = "none";
        document.querySelector("#map .tg-display").classList.remove("active");
        document.querySelector(".carousel-container").style.visibility = "hidden";
        document.querySelector(".card-carousel .carousel").style.visibility = "hidden";
        document.querySelectorAll(".rangeYear").forEach((el)=>el.classList.remove("active"));
        document.querySelector(".carousel-container .description").classList.remove('active');
        console.log("deletea:",this.carousel);
        this.resetDataImages();
      }
      if(e.target.tagName != "INPUT"){
        document.querySelectorAll(".rangeYear input").forEach((el)=>{
          el.blur();
        })
      }
    },
    showCarousel:function (ev){
      let countryName, countryCode;
      if(ev.type == "hit"){
        countryName = ev.target.dataItem.dataContext.name;
        countryCode = ev.target.dataItem.dataContext.id || ev.target.dataItem.dataContext.country;  // from polygon or from marker
      }
      else{ console.log(ev, "else");  // "change" from select countries
        const select = ev.target.querySelector("option:checked");
        countryName = select.innerText;
        countryCode = select.value;
      }
      // do not show carousel for other countries
      if(!(countryCode in blackVue.listMarkers) || ((countryCode in blackVue.listMarkers) && !blackVue.listMarkers[countryCode]) ) return;

      // select country
      this.selectCountryName(countryCode);
      // reset default carousel
      this.resetCarousel();
      // initialize blackVue.dataImages
      // check if already dowloaded array to build and store in dict with custom key "countryCode.startYear.EndYear.category"
      //if(countryCode != blackVue.countryCode){
        // get blackVue.dataImages and Initialize carousel on success
      blackVue.getBlacksByCountry(countryCode).then( function(data){
        console.log(data);
        blackVue.dataImages = [];
        /*blackVue.dataImages = old_urlsImages;*/

        const data_x = ["0","1","-1","2","-2"];
        if(data.length == 0) return;
        else {
          for (let i = 0; (i<5&i<data.length); i++) {  console.log("heeeeeeeeeeeeeee");
            blackVue.dataImages[i] = {"data-x": data_x[i], "url": data[i]["image_dataURI"], "name": data[i]["name"], "extracts":data[i]["summary"],
                                      "category":data[i]["category"], "internal_link": data[i]["internal_link"], "wiki_link": data[i]["wiki_link"]};
          }
        }
        if(data.length > 0){
          for (let i = 5; i < data.length; i++) {
            blackVue.dataImages[i] = {"data-x": "", "url": data[i]["image_dataURI"], "name": data[i]["name"], "extracts":data[i]["summary"],
                                      "category":data[i]["category"], "internal_link": data[i]["internal_link"], "wiki_link": data[i]["wiki_link"]};
          }
        }

        // be ready before  show3D_Or_List or skipCarousel
        document.querySelector(".carousel-container").style.visibility = "initial";
        document.querySelector("#map span.name").style.display = "inline-block";
        document.querySelector("#map .countryName").style.display = "block";
        document.querySelector("#map .tg-display").classList.add("active");
        //document.querySelector(".carousel-container .list").innerHTML = "";      // empty previous list, finaly not to allow component to rerender!
        document.querySelector(".carousel-container .description").classList.add('active');
        // Initialize carousel   need to be done even no update
        blackVue.countryCode = countryCode;
        if (!blackVue.isMobile) {
          blackVue.carousel = new CardCarousel(blackVue.cardsContainer, blackVue.cardsCarousel, blackVue.cardsController);
          blackVue.show3D_Or_List(document.getElementById("cb_display"));
        }
        else{
          blackVue.isViewModeList = true;
          blackVue.skipCarousel();
        }
        console.log("show");

        // fix scroll to bottom
        document.documentElement.scrollTop = 0;


      }, (e)=>{console.log("error:",e)});
      //}



    },
    clickOutsideMap: function(e){
      console.log("Window clickOutsideMap ....", e.target, );
      let carouselIsVisible = document.querySelector(".carousel-container").style.visibility != "hidden";
      if( carouselIsVisible && e.target.closest(".carousel-container") == null){  // e.target.closest(".carousel-container") == null
        if( !(!blackVue.isMobile && blackVue.carousel && blackVue.carousel.scrollDirection &&
               blackVue.carousel.scrollDirection.direction != undefined) ){  // not at mouseleave after scroll for computer only because in mobile all movement trigger scroll
          console.log("Window clickOutsideMap: hideCarousel Success", e );
          blackVue.hideCarousel(e);
        }
        else if(/iPad/i.test(navigator.userAgent) && blackVue.carousel){
            blackVue.hideCarousel(e);
        }
      }
      if(blackVue.carousel) blackVue.carousel.scrollDirection = {};
    },
    skipCarousel: function(){
      document.getElementById("cb_display").checked = true;
      document.getElementById("cb_display").dispatchEvent(new Event('change'));
    },
    selectCountryName: function(code){
      const choice = document.querySelector('select.countryName option[value="'+code+'"]');
      if(choice) {
        choice.closest("select").value = code;
        this.updateBorderCountry(choice);
      }
    },
    updateBorderCountry: function(choice){
      const font = window.getComputedStyle(choice, null).getPropertyValue("font-family");
      const size = window.getComputedStyle(choice, null).getPropertyValue("font-size");
      const textWidth = this.getTextWidth(choice.innerText, font, size, true, true);
      choice.closest("select").style.width = textWidth + 25 + 'px';
      console.log(`textWidth: ${choice.innerText} ${textWidth}, ${font}, ${size}`)
    },
    getTextWidth: function (text, font, size, bold=false, uppercase=false) {
    	let span = document.createElement("span");
    	span.id = "tempTestWidth";
      span.style.opacity = 0;
    	span.style.fontFamily = font;
    	span.style.fontSize = size;
    	span.style.height = 'auto';
    	span.style.width = 'auto';
    	span.style.position = 'absolute';
    	span.style.whiteSpace = 'no-wrap';
    	span.innerHTML = text;
    	if(bold) span.fontWeight = "bold";
    	if(uppercase) span.style.textTransform = "uppercase";
    	document.body.appendChild(span);

    	const width = Math.ceil(span.clientWidth);
    	document.querySelector("span#tempTestWidth").remove();
    	return width;
    },
    dataURIToBlob: function (dataURI) {
        // Validate input data
        if(!dataURI) return;
        // Convert image (in base64) to binary data
        let base64Index = dataURI.indexOf(';base64,') + ';base64,'.length;    //BASE64_MARKER: ';base64,'
        let base64 = dataURI.substring(base64Index);
        let raw = window.atob(base64);
        let rawLength = raw.length;
        let array = new Uint8Array(new ArrayBuffer(rawLength));
        for(i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
      /*  let urlBlob = URL.createObjectURL(
           new Blob([array], {type: "image/jpeg"})
        );*/
        // Create and return a new blob object using binary data
        return new Blob([array], {type: "image/jpeg"});
    },
    getCleanImage: function(base64Image){
        // Destroy old image
        if(this.tempBlobImage) {
          if(this.lastBlobImages['count'].length > 5){
            let oldBlobId = this.lastBlobImages['count'][5];
            this.objectURL.revokeObjectURL(this.lastBlobImages[oldBlobId]);  // a suivre revok for list?
            delete this.lastBlobImages[this.lastBlobImages[oldBlobId]];
            removeItemArray(this.lastBlobImages['count'], oldBlobId);
          }
        }
        // Create a new image from binary data
        let imageDataBlob = this.dataURIToBlob(base64Image);
        // Create a new object URL object
        this.tempBlobImage = this.objectURL.createObjectURL(imageDataBlob); console.log("blob:",imageDataBlob, this.tempBlobImage.toString());
        let strBlob = this.tempBlobImage.toString();
        // save data uri for later comparaison
        this.lastBlobImages[strBlob] = base64Image;
        this.lastBlobImages['count'].unshift(strBlob);  // add to the bebening of array
        // update blackname
        this.updateBlackName();
        // Set the new image
        return this.tempBlobImage;
    },
    dataURIToBlob2: function (dataURI) {
        // Validate input data
        if(!dataURI) return;
        // Convert image (in base64) to binary data
        let base64Index = dataURI.indexOf(';base64,') + ';base64,'.length;    //BASE64_MARKER: ';base64,'
        let base64 = dataURI.substring(base64Index);
        let raw = window.atob(base64);
        let rawLength = raw.length;
        let array = new Uint8Array(new ArrayBuffer(rawLength));
        for(i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
      /*  let urlBlob = URL.createObjectURL(
           new Blob([array], {type: "image/jpeg"})
        );*/
        // Create and return a new blob object using binary data
        return new Blob([array], {type: "image/jpeg"});
    },
    getCleanImage2: function(base64Image){
        // Create a new image from binary data
        let imageDataBlob = this.dataURIToBlob2(base64Image);
        // Create a new object URL object
        let tempBlobImage = this.objectURL2.createObjectURL(imageDataBlob);
        this.lastBlobImages2[tempBlobImage] = this.keyOf(base64Image);
        return tempBlobImage;
    },
    keyOf: function(url){
      for (let i in this.dataImages) {
        if(this.dataImages[i].url && this.dataImages[i].url == url) {return i;}
      }
    },
    click_loadNewImage: function(direction){
      if(blackVue.dataImages.length <= 5) return;  // use default behaviour
      if(direction == "left"){
        // remove old right data-x="2"
        blackVue.dataImages[0]["data-x"] = "";
        // then move it at the bottom of the array
        blackVue.dataImages.move(0, blackVue.dataImages.length-1);
        // load new image
        document.querySelector('.card[data-x="-2"] img').src = this.getCleanImage(blackVue.dataImages[4]["url"]);
      }
      else if (direction == "right"){
        // remove old left data-x="-2"
        blackVue.dataImages[4]["data-x"] = "";
        // then move at the top the bottom item of the array
        blackVue.dataImages.move(blackVue.dataImages.length-1, 0);
        // load new image
        document.querySelector('.card[data-x="2"] img').src = this.getCleanImage(blackVue.dataImages[0]["url"]);
      }
      this.reorderURLS();
    },
    isDuplicate: function(cards, url){
      // check if duplicate exist
        cards.forEach((item) => {
          const urlCard = (item.querySelector("img").src).replace(window.location.origin+'/', "");
          if( urlCard == url ) return true;
        });
        return false;
    },
    reorderURLS: function (){
      // reorder "data-x"
      blackVue.dataImages[0]["data-x"] = "2";
      blackVue.dataImages[1]["data-x"] = "1";
      blackVue.dataImages[2]["data-x"] = "0";
      blackVue.dataImages[3]["data-x"] = "-1";
      blackVue.dataImages[4]["data-x"] = "-2";
    },
    scroll_loadNewImage: function(direction){
      //skipEmptyImage();
      if(blackVue.dataImages.length <= 5) return;  // use default behaviour
      // find comming card
      const cards = document.querySelectorAll(".card");
      let id = 0;
      for (i in cards) {
        if(typeof cards[i] == "object"){
          let o = cards[i].style.opacity;
          o = parseInt(o.replace("px",""));
          if(o == 0 ) { id = cards[i].id; break; }
        }
      }

      if(direction == "left"){
        if(id > 0){
          console.log("scroll_loadNewImage:", id, direction);
          // remove old left data-x="-2"
          blackVue.dataImages[4]["data-x"] = "";
          // then move at the top the bottom item of the array
          blackVue.dataImages.move(blackVue.dataImages.length-1, 0);
          // load new image
          const url = blackVue.dataImages[0]["url"];
          if(!this.isDuplicate(cards, url)){
            document.querySelector('.card[id="'+id+'"] img').src = blackVue.getCleanImage(url);
          }
        }
      }
      else if (direction == "right"){
        if(id > 0){
          console.log("scroll_loadNewImage:", id, direction);
          // remove old right data-x="2"
          blackVue.dataImages[0]["data-x"] = "";
          // then move it at the bottom of the array
          blackVue.dataImages.move(0, blackVue.dataImages.length-1);
          // load new image
          const url = blackVue.dataImages[4]["url"]
          if(!this.isDuplicate(cards, url)){
            document.querySelector('.card[id="'+id+'"] img').src = blackVue.getCleanImage(url);
          }
        }
      }
      this.reorderURLS();
      console.log(blackVue.dataImages);
    },
    facebook: function(){
      return 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(this.internal_link);  // .replace(/#/g,"#!") a suivre with Open graph....
    },
    twitter: function(){
      return 'https://twitter.com/intent/tweet?text='+this.blackName+'&url='+encodeURIComponent('\n'+this.internal_link);  //.replace(/#/g,"%23"); &via=
    },
    whatsapp: function(){
      return 'https://wa.me/?text='+encodeURIComponent(this.internal_link);
    },
    updateBlackName: function(){  console.log("updateBlackName");
      const img = document.querySelector('.card.highlight img');

      if(img){
        if(img.src in this.lastBlobImages){
          // do not use dataId here because blackVue.dataImages order change on scroll! Annd we store only 5 dataUri.
          const dataUri = this.lastBlobImages[img.src];
          for (let i = 0; i < blackVue.dataImages.length; i++) {
              if( dataUri == blackVue.dataImages[i].url ) {
                this.blackName = blackVue.dataImages[i].name;
                this.extracts = blackVue.shortVersionExtracts(blackVue.dataImages[i].extracts);
                this.categories = blackVue.dataImages[i].category.join(', ');   //"category":[art, activist, spiritual]
                this.wiki_link = blackVue.dataImages[i].wiki_link || "#";
                this.internal_link =  blackVue.dataImages[i].internal_link;
                // scroll to top description
                document.querySelector(".carousel-container .description-content p").scrollTop = 0;
                break;
              }
          }
        }
        // update event clcik
        const cards = document.querySelectorAll(".card");
        for (let j = 0; j < cards.length; j++) {
          cards[j].removeEventListener("click", this.toggleDescription);
        }
        img.closest(".card.highlight").addEventListener("click", this.toggleDescription);
        // fix zIndex change from updateControllerLinks
        if(img.closest('.card[data-x="0"]') && img.src != blackVue.onePixelUrl) img.closest('.card[data-x="0"]').style.zIndex = "0";
        // skipEmptyImage
        if(this.dataImages.length < 5){
          this.skipEmptyImage(img);  console.log("skipa:");
        }
        // update z-index modified before image loaded
        let prev = (this.carousel) ? this.carousel.prev : null;
        let next = (this.carousel) ? this.carousel.next : null;
        if(prev && prev[0] && prev[0].style.zIndex == "-3" ) {prev[0].style.zIndex = "-1";}
        if(next && next[1] && next[1].style.zIndex == "-3" ) {next[1].style.zIndex = "-1";}
      }
      console.log("v-on change:");
    },
    skipEmptyImage: function(img){
        if(blackVue.lastScrollDirection.direction && img.src == blackVue.onePixelUrl){
          if (blackVue.lastScrollDirection.srcChanged){
            blackVue.lastScrollDirection.srcChanged = false;
            console.log("skipEmptyImage", blackVue.lastScrollDirection.direction, blackVue.lastScrollDirection.cursorState);

            if(blackVue.lastScrollDirection.direction == "left") {
              if(blackVue.lastScrollDirection.cursorState == "click"){
                blackVue.cardsContainer.dispatchEvent(new CustomEvent("prev", {detail: {type: "keyboard"}}));
                blackVue.lastScrollDirection.srcChanged = true;
              }
              else if(blackVue.lastScrollDirection.cursorState == "moving"){
                blackVue.cardsContainer.dispatchEvent(new CustomEvent("prev", {detail: {type: "scroll"}}));  // use scroll because will twice move with keyboard
              }
            }
            else if(blackVue.lastScrollDirection.direction == "right") {
              if(blackVue.lastScrollDirection.cursorState == "click"){
                blackVue.cardsContainer.dispatchEvent(new CustomEvent("next", {detail: {type: "keyboard"}}));
                blackVue.lastScrollDirection.srcChanged = true;
              }
              else if(blackVue.lastScrollDirection.cursorState == "moving"){
                blackVue.cardsContainer.dispatchEvent(new CustomEvent("next", {detail: {type: "scroll"}}));   // use scroll because will twice move with keyboard
              }
            }
            blackVue.skipEmptyImageAgain();
          }
        }
        else{
          blackVue.lastScrollDirection.srcChanged = true;
        }
    },
    skipEmptyImageAgain: function(){
      setTimeout(()=>{
        const img = document.querySelector('.card.highlight img');  console.log("skipEmptyImageAgain", ( img && img.src == blackVue.onePixelUrl));
        if( img && img.src == blackVue.onePixelUrl){
          blackVue.lastScrollDirection.srcChanged = true;
          blackVue.lastScrollDirection.cursorState = "click";  // use "click" because "scroll" get ignored
          blackVue.skipEmptyImage(img);  console.log("skipEmptyImageAgain skipEmptyImage");
        }
        else if(img && img.src != blackVue.onePixelUrl){
            blackVue.lastScrollDirection.srcChanged = false;  // some time on scroll go to the secound image but not a big deal, tryed to click on prev or next but worst
        }
      },100);
    },
    toggleDescription: function(e){  console.log("toggleDescription", this.lastScrollDirection.cursorState);
      if(e.target.className == "image-card"){
        if(this.lastScrollDirection.cursorState == "moving") return;
        document.querySelector(".carousel-container .description").classList.toggle('visible');
      }
      else if( ["share","shareLogo"].includes(e.target.className) ) this.toggleShareModal(e);
    },
    skipEventCard: function(e){
      console.log("skipEventCard:", e.target);
      if(["share","shareLogo"].includes(e.target.className)) return true;
      else return false;
    },
    toggleShareModal: function(e){ //force=false
      e.stopPropagation();
        const modal = document.getElementById("share-modal"); console.log("toggleShareModal", e.target, e.target.closest("#showcase"));
        if(e.target.closest("#showcase")){ console.log("pre other:",e.target.closest("#showcase"));
          this.toggleModal(modal, e.target.closest("#showcase"));
        }
        else{  console.log("no shoawcase");
          this.toggleModal(modal);
        }
        // update animation show button
        if(document.querySelector("#showcase.active")){
          // remove show button annimation for sharemodal
          document.querySelector('#share-modal button[name="show"]').classList.add("hidden");
        }
        else{
          document.querySelector('#share-modal button[name="show"]').classList.remove("hidden");
        }
    },
    shareModalClick: function(e){
      event.stopPropagation();  // this event is passed by the parent .card, so will not work
      // click outside modal
      if (e.target.classList.contains("modal")) this.toggleModal(e.target);
      // click copy
      else if(e.target.type == "button") {
        if(e.target.name == "copy"){
          console.log("copy",e.target);
          const input = document.querySelector("#share-modal .shareLink input")
          if(input.value == "") return;
          // select the url text OPTIONAL
          input.select();
          // copy url text
          document.execCommand("copy");
        }
        else if(e.target.name == "show"){ console.log("shiowwwwwwwwwww");
          // update url slug
          const slug = document.querySelector("#share-modal .shareLink input").value.replace(/.+\//,'');
          //if(decodeURIComponent(window.location.hash) == hash)  this.getShowcaseData(hash);   // will to trigger update hash if same
          //else window.location.hash = hash;
          this.getShowcaseData(slug);  // do not change url, the pop up is anoying on refresh page
        }
      }
      console.log("shareThis:",e.target);
    },
    updateSlug: function(removeFromUrl=false){
      const openShowcase = document.querySelector("#openShowcase");
      if (removeFromUrl) {
        // add slug to openShowcase link
        if(openShowcase) openShowcase.innerHTML = "#"+this.slug;
        // remove slug from url
        if(window.history.pushState) {
          history.replaceState(null, null, '/');
        }
      }
      else {
        // remove slug from openShowcase link
        if(openShowcase) openShowcase.innerHTML = "";
        // add slug to url
        if(window.history.pushState) {
          history.replaceState(null, null, this.slug);
        }
      }
    },
    showcase: function(el){
      if (el.type == "click" && el.target.classList.contains("modal")) {  // hide modal
        el.stopPropagation();
        this.toggleModal(el.target);
        this.updateSlug(true);
        console.log("slug", this.slug);
      }
      else if(el.classList && el.classList.contains("modal")){ console.log("show modal!");
        this.toggleModal(el);       // show modal after load internal url
        // add slug to openShowcase link
        this.updateSlug();
      }
      document.querySelector(".container").style.opacity = "1";
      document.querySelector("#showcase").style.backgroundColor = "transparent";
    },
    getShowcaseData: function(slug, data=false){ console.log("getShowcaseData onload");
      const modal = document.querySelector("#showcase");
      // data retreived on load personal black page
      if (data){
        this.processShowcaseData(modal, data);
        this.slug = slug;
      }
      else{  console.log("getShowcaseData click");
        // on show great black
        this.postAxios(window.location.origin+"/getGreatBlack/", {'slug':decodeURIComponent(slug)}, function(result){  // encode when from url
          console.log(result.data);

          modal.classList.remove("active");
          if(result.data.status == "success" && result.data.data.length > 0){
            // show map in case other tab was open
            blackVue.closeOtherStuff(modal);
            document.querySelector('#menuLinks a[data-link="greatblacks"]').click();
            // update slug
            blackVue.slug = result.data.slug;

            blackVue.processShowcaseData(modal, result.data.data[0]);
          }
        });
      }
    },
    processShowcaseData: function(modal, data){
      modal.querySelector(".name h2").innerHTML = data['name'];
      modal.querySelector(".born td:nth-child(3)").innerHTML = data['birth_date'] || data['birth_year'];
      modal.querySelector(".death td:nth-child(3)").innerHTML = data['death_date'] || data['death_year'];
      if(data['death_date'] || data['death_year']) {this.isDeath = true;}
      else {this.isDeath = false;}
      modal.querySelector(".category td:nth-child(3)").innerHTML = data['category'].join(', ');
      modal.querySelector(".country td:nth-child(3)").innerHTML = this.longVersionCountry(data['countries']).join(', ');
      modal.querySelector(".extracts p").innerHTML = this.shortVersionExtracts(data['summary']);
      modal.querySelector(".more a").innerHTML = "more";
      modal.querySelector(".more a").href = data['wiki_link'];
      this.internal_link = data['internal_link'];
      let img = document.querySelector("#showcase .image img");
      img.onload = function(){
        // avoid image load twice
        if(!(modal.classList.contains("active"))){
          blackVue.showcase(modal);
          // hide loading image
          if (document.getElementById("preloading")) {
            document.getElementById("preloading").remove();
          }
        }
      }
      img.src = this.getCleanImage(data['image_dataURI']);
    },
    longVersionCountry: function(listCountry){
      const countries = document.querySelectorAll('.map-container select[name="country"] option');
      for (let i = 0; i < listCountry.length; i++) {
        for (let c = 0; c < countries.length; c++) {
          if(listCountry[i] == countries[c].value) listCountry[i] = countries[c].textContent;
        }
      }
      return listCountry;
    },
    shortVersionExtracts: function(extracts){
      if(extracts.length > 1000) return extracts.substring(0,1000) +' ...';
      else {return extracts;}
    },
    isOnTimeLine: function(from, to){
      let response = false;
      if(to == null) to = this.currentYear;
      if(this.queryPeriod[0] == null && this.queryPeriod[1] == null) {
        response = true;
      }
      else if(this.queryPeriod[0] == null && this.queryPeriod[1] != null) {
        if(from <= this.queryPeriod[1]  || to <= this.queryPeriod[1]) response = true;
      }
      else if(this.queryPeriod[0] != null && this.queryPeriod[1] == null){
        if(from >= this.queryPeriod[0] || to >= this.queryPeriod[0]) response = true;
      }
      else if(this.queryPeriod[0] != null && this.queryPeriod[1] != null){
        // if any date is between range
        if((from >= this.queryPeriod[0] && from <= this.queryPeriod[1]) || (to >= this.queryPeriod[0] && to <= this.queryPeriod[1]) ) response = true;
        // if all range is bettween dates
        if(from <= this.queryPeriod[0] && to >= this.queryPeriod[1]) response = true;
        // if all dates is between range
        if(from >= this.queryPeriod[0] && to <= this.queryPeriod[1]) response = true;
      }
      //console.log("response:", from, to, response);
      return response;
    },
    changePeriode: function(e){
      if((e.target.value).toString().length > 10) return;
      try {
        let yearFrom, yearTo = null;
        let f = document.querySelector('.rangeYear input[name="from"]');
        let t = document.querySelector('.rangeYear input[name="to"]');
        if(f.value != "") yearFrom = parseInt(f.value);
        else yearFrom = null;
        if(t.value != "") yearTo = parseInt(t.value);
        else yearTo = null;

        if (yearFrom > this.currentYear) {yearFrom = this.currentYear; f.value = this.currentYear;}
        if (yearTo > this.currentYear) {yearTo = this.currentYear; t.value = this.currentYear;}

        // check if "from" not superior to "to"
        if(f.value != "" && t.value != "" && parseInt(f.value) > parseInt(t.value) ) {f.style.border = "1px solid red"; t.style.border = "1px solid red"; return;}
        else{ f.style.border = ""; t.style.border = "";}

        this.queryPeriod[0] = yearFrom;  // do not use e.target.name because when return used bad field remain different without new event
        this.queryPeriod[1] = yearTo;
        //console.log("change:",this.queryPeriod);
      } catch (e) {
        return;
      }
      this.updateStatusCountry();
    },
    changeCategory: function(e){
      console.log(e);
      let categories = [];
      const cat_name = e.target.closest("form").id.replace('cat_','');
      if (e.target.checked && !this.queryCategory.includes(cat_name))   this.queryCategory.push(cat_name);
      else removeItemArray(this.queryCategory, cat_name);
      this.updateStatusCountry();
    },
    updateStatusCountry: function(){
      // reset to false all status
      for (let country in this.listMarkers) {
        if(this.listMarkers.hasOwnProperty(country))  this.listMarkers[country] = false;
      }
      //console.log(this.listMarkers);
      // check period first
      let tempCountries = Object.keys(blackVue.listMarkers);
      for (let i = 0; i < this.blacksData.length; i++) {
        if(this.isOnTimeLine(this.blacksData[i]["birth_year"], this.blacksData[i]["death_year"])){
          // check each country
          for (let j=0; j<tempCountries.length; j++) {
            if( this.blacksData[i]["countries"].includes(tempCountries[j]) &&
                this.blacksData[i]["category"].some(r=> blackVue.queryCategory.includes(r))
              ){
                   this.listMarkers[tempCountries[j]] = true;
                   removeItemArray(tempCountries, tempCountries[j]);  // when country is ok do not search again
                   //console.log(tempCountries[j]);
            }
          }
        }
      }
      //console.log(this.listMarkers);
      this.updateMarkers();
    },
    updateMarkers: function (){
      //let theChart = document.querySelector(".MapPolygon").baseSprite;
      const series = chart.map.getKey("markers");
      series.mapImages.each(function(marker) {
          if( !(marker.country in blackVue.listMarkers) ) marker.hide();   // hide other countries without blacks
          else{ // check status of black coutries regarding period or category
            if(blackVue.listMarkers[marker.country] == false) marker.hide();
            else marker.show();
          }
      });
    /* console.log(ev.target.dataItem.dataContext.name);
      console.log(ev.target.dataItem.dataContext.id);
      console.log("dataContext:",ev.target.dataItem.dataContext);
      console.log(ev.target);
      console.log(ev.target.polygon.group.node);

    series.mapImages.each(function(marker) {
        //console.log(ev.target.closest('.MapPolygon'), marker)
        //console.log(marker.name, ev.target.dataItem.dataContext.name);
      //  if(marker.country == ev.target.dataItem.dataContext.id){
          // console.log(marker.name);
          marker.hide();
      //  }
        //else  console.log(marker.name);
      });*/
    },
    toggleViewMode: function(e){
      // on switch between list and 3D
        this.show3D_Or_List(e.target);
        if(document.getElementById("cb_display").checked) {
          this.isViewModeList = true;
          document.getElementById("input_search").value = "";
          this.filterSearch();
        }
        else {this.isViewModeList = false;}
        if(this.isMobile || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
          this.isViewModeList = true;
        }
    },
    filterSearch: function(e){
      const keyword = ((e)? e.target.value : document.getElementById("input_search").value).trim();
      console.log("keyword:", keyword, this.dataImagesComponent_backup.length, this.dataImagesComponent.length);
      if(!keyword){ console.log("je suis empty!");
        if(this.dataImagesComponent_backup.length == 0){ console.log("I'm in first Time!");
          this.dataImagesComponent_backup = this.dataImagesComponent;
        }
        else {
          console.log("I'm back!");
          this.dataImagesComponent = this.dataImagesComponent_backup;
        }
        this.dataImages_lastIndex = this.dataImagesComponent.length;
        return;
      }
      else{
        this.dataImages_lastIndex = this.dataImages.length;
      }
      this.dataImagesComponent = [];
console.log("je suis passé!");
      let count = 0;
      for (let i = 0; i < this.dataImages.length; i++){
          if( count < 4 && (new RegExp(keyword, 'i')).test(this.dataImages[i].name) ) { console.log("yes in", count, keyword, this.dataImages[i].name);
            this.dataImagesComponent.push(this.dataImages[i]); count++;
            if(count >= 4) break;
          }
      }
    },
    getBlacksByCountry: function (countryCode){
        return new Promise((resolve, reject) => {
            if(!countryCode || this.queryCategory.length <= 0 || this.queryPeriod <= 0) {
              reject(); return;
            }
            const datas = {
              'country': countryCode,
              'category': this.queryCategory,
              'period': this.queryPeriod
            };
            console.log("datas:", datas);
            this.postAxios(window.location.origin+"/getBlacksByCountry/", datas, function(result){
              console.log(result.data)
              if(result.data.status == "success"){resolve(result.data.query);}
              else reject(null);
            });
        });
      }   // end of all methods bracket
  },
  computed:{
    cardHighlighted(){
      if(this.carousel) {return this.carousel.cardHighlighted;}
      else return null;
    }
  },
  watch:{
    cardHighlighted(newValue, oldValue) { console.log("carousel change", );
      // fix small bug not skpiping enpty image
      const img = document.querySelector(".card.highlight img");
      if(img && img.src == this.onePixelUrl) {blackVue.lastScrollDirection.srcChanged = true;}
      this.updateBlackName();
    }
  },
  mounted(){   console.log("Mouted");
    if(this.authenticated == true){
      this.getUserData();
    }
    // get showcase black data
    let blackValues = document.querySelector('#json_string_blackValues')
    if(blackValues){
      const slug = window.location.href.replace(window.location.origin+'/','').trim();
      if(slug.match(/.+/)){
        blackValues = JSON.parse(blackValues.innerText);
        console.log(blackValues);
        if (Object.keys(blackValues).length > 0){
          this.getShowcaseData(decodeURIComponent(slug), blackValues);
        }
      }
    }
    // listen resize window
    window.addEventListener("resize", function(){  console.log("resize");
      // update isMobile on resize window           // document.querySelector(".carousel-container").clientWidth < 400
      if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || document.querySelector(".carousel-container").clientWidth < 400) {
        blackVue.isMobile = true;
        blackVue.skipCarousel();
      }
      else {blackVue.isMobile = false;}
      // update border select country
      let coutryOption = document.querySelector('select.countryName option:checked');
      if(coutryOption) blackVue.updateBorderCountry(coutryOption);
    });

    // on click on outside poligons
    window.addEventListener("click", function(e){ console.log("timeStamp:", Date.now() - blackVue.openPolygon_timeStamp);
      e.stopPropagation();
      if(Date.now() - blackVue.openPolygon_timeStamp > 500) {  // 300 millisecond = 0.5 s
        blackVue.clickOutsideMap(e);
      }
    });

  }
});

console.log("Dom",document.getElementById("isAuthenticated").innerHTML);
//use v-model
let black_name, birth_date, birth_place, death_date, death_place, wikiName, imageName, country, occupation, known_for, category, summary, image_url;
function checkWikiData1(data){
    try {
      blackVue.checkWikiData1(data);
    } catch (e) {
      console.error(e);
      blackVue.afterWikiRequest("show", "An error occured please try another link.", true);
    }
}

function checkWikiImage2(data){
    try {
      blackVue.checkWikiImage2(data);
    } catch (e) {
      console.error(e);
      blackVue.afterWikiRequest("show", "An error occured please try another link.", true);
    }
}






/*********************************************************************************************************************************************************
     amCharts 4
*********************************************************************************************************************************************************/
///////////////////////////////// Setup MAP ///////////////////////////////////////

// set height map
//document.getElementById("chartdiv").style.height = "100vh"; // (window.innerHeight - 0) + 'px';  console.log((window.innerHeight - 48) + 'px');

// Themes begin
am4core.useTheme(am4themes_dark);
am4core.useTheme(am4themes_animated);
// Themes end

// Create map instance
let chart = am4core.create("chartdiv", am4maps.MapChart);

// spinner loader
chart.preloader.disabled = true;   // not working but can show sometime, so disable


// Set map definition
chart.geodata = am4geodata_worldLow;

// Set projection
chart.projection = new am4maps.projections.Miller();

// Create map polygon series
let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

// Exclude Antartica
polygonSeries.exclude = ["AQ"];

// Make map load polygon (like country names) data from GeoJSON
polygonSeries.useGeodata = true;

// Configure series
let polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.tooltipText = "{name}";

polygonTemplate.polygon.fillOpacity = 1;  //0.8


// Create hover state and set alternative fill color
let hs = polygonTemplate.states.create("hover");
hs.properties.fill = am4core.color("#FFFFFF");

const orange = "#FF8726";


// Add image series
let imageSeries = chart.series.push(new am4maps.MapImageSeries());
////////////////////////////////
imageSeries.id = "markers";

// define template markers
let imageSeriesTemplate = imageSeries.mapImages.template;
imageSeriesTemplate.propertyFields.horizontalCenter = "middle";
imageSeries.mapImages.template.propertyFields.verticalCenter = "middle";
imageSeriesTemplate.propertyFields.longitude = "longitude";
imageSeriesTemplate.propertyFields.latitude = "latitude";
//imageSeriesTemplate.propertyFields.url = "url";
imageSeriesTemplate.propertyFields.country = "country";
imageSeriesTemplate.propertyFields.name = "name";
imageSeriesTemplate.nonScaling = true;
imageSeriesTemplate.tooltipText = "{name}";
imageSeriesTemplate.fill = am4core.color("#313131");
imageSeriesTemplate.background.fillOpacity = 0.6;
imageSeriesTemplate.background.fill = am4core.color("#ffffff");
imageSeriesTemplate.states.create("hover");


let circle = imageSeriesTemplate.createChild(am4core.Circle);
circle.radius = 3;
circle.fill = am4core.color("#FF8726");   // orange
//circle.path = targetSVG;


// set json list countries
try{
  const listCountries = JSON.parse(document.querySelector('#listCountries').innerText);
  imageSeries.data = listCountries
}
catch{
  console.log("JSON Error: data for imageSeries not initialized.");
}


// buttons & chart container
let buttonsAndChartContainer = chart.createChild(am4core.Container);
buttonsAndChartContainer.layout = "vertical";
 // for desktop
if(!(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || document.querySelector(".carousel-container").clientWidth < 400)) {
  buttonsAndChartContainer.height = 120;
}
else buttonsAndChartContainer.height = 150; // make this bigger if you want more space for the chart
buttonsAndChartContainer.width = am4core.percent(100);
buttonsAndChartContainer.valign = "bottom";

// add label for display showcase
let showcaseLabel = buttonsAndChartContainer.createChild(am4core.Label);
showcaseLabel.html = '<span id="openShowcase">&nbsp;</span>';
showcaseLabel.fontSize = 12;
showcaseLabel.align = "left";
showcaseLabel.fill = "grey";


// Chart & slider container
let chartAndSliderContainer = buttonsAndChartContainer.createChild(am4core.Container);
chartAndSliderContainer.layout = "vertical";
chartAndSliderContainer.height = am4core.percent(10);
chartAndSliderContainer.width = am4core.percent(100);
chartAndSliderContainer.background = new am4core.RoundedRectangle();
chartAndSliderContainer.background.fill = am4core.color("#000000");
chartAndSliderContainer.background.cornerRadius(30, 30, 0, 0)
chartAndSliderContainer.background.fillOpacity = 0.25;
chartAndSliderContainer.paddingTop = 12;
chartAndSliderContainer.paddingBottom = 0;

// label TIME LINE used as reperage as well Do not edit text!
let label = chartAndSliderContainer.createChild(am4core.Label);
label.text = "TIME LINE";
label.fontSize = 12;
label.align = "center";
label.fill = "grey";


// Slider container
let sliderContainer = chartAndSliderContainer.createChild(am4core.Container);
sliderContainer.width = am4core.percent(100);
sliderContainer.padding(0, 15, 15, 10);
sliderContainer.layout = "horizontal";

let slider = sliderContainer.createChild(am4core.Slider);
slider.width = am4core.percent(100);
slider.valign = "middle";
slider.background.opacity = 0.4;
slider.opacity = 0.7;
slider.background.fill = am4core.color("#ffffff");
slider.marginLeft = 20;
slider.marginRight = 35;
slider.height = 15;
slider.start = 1;
slider.showSystemTooltip = false;




  // play button
  let playButton = sliderContainer.createChild(am4core.PlayButton);
  playButton.valign = "middle";
  // play button behavior
  playButton.events.on("toggled", function(event) {
    if (event.target.isActive) {
      play();
    } else {
      stop();
    }
  })
playButton.background.fill = am4core.color(orange)
//playButton.stroke = am4core.color(orange)
//playButton.getFillFromObject = false;
//let pbs = playButton.states.create("hover");
//pbs.properties.fill = am4core.color("#FFFFFF");
console.log(playButton.states)

// make slider grip look like play button
slider.startGrip.background.fill = playButton.background.fill;
slider.startGrip.background.strokeOpacity = 0;
slider.startGrip.icon.stroke = am4core.color("#ffffff");
slider.startGrip.background.states.copyFrom(playButton.background.states)






///////////////////////////////////////////////////////////////// Suite check box
// Slider container for categories checkboes
let checkboxContainer = chartAndSliderContainer.createChild(am4core.Container);
checkboxContainer.width = 0;
checkboxContainer.height = 0;
checkboxContainer.padding(0, 15, 15, 10);
checkboxContainer.layout = "horizontal";
checkboxContainer.fill = "#fff";
checkboxContainer.align = "center";

let label2 = checkboxContainer.createChild(am4core.Label);  // will be hiden, used only for reperage
label2.text = "categories";
label2.fontSize = 0;  // to hide on load
label2.align = "center";
label2.fill = "#000000";




let sliderAnimation;
let slideStatus = 0;
let slideStatusInterval = null;
// stop animation if dragged
slider.startGrip.events.on("drag", () => {
  stop();
  if (sliderAnimation) {
    sliderAnimation.setProgress(slider.start);
  }
});


  // play behavior
function play() {
  if (!sliderAnimation) {
    sliderAnimation = slider.animate({ property: "start", to: 1, from: 0 }, 10000, am4core.ease.linear).pause();
    sliderAnimation.events.on("animationended", () => {
      playButton.isActive = false;
    })
  }
  if (slider.start >= 1) {
    slider.start = 0;
    sliderAnimation.start();
  }
  sliderAnimation.resume();
  playButton.isActive = true;
}

// stop behavior
function stop() {
  if (sliderAnimation) {
    sliderAnimation.pause();
    document.querySelectorAll(".rangeYear").forEach((el) => { el.classList.remove("active"); });
  }
  playButton.isActive = false;
}

///////////////////////////////// END Setup MAP ///////////////////////////////////////



/////////////////////// MAP build in functions ////////////////



// onclick on any polygon
polygonTemplate.events.on("hit", function(ev) {
  ev.event.stopPropagation();   // not working!
  blackVue.openPolygon_timeStamp = Date.now();
  blackVue.showCarousel(ev);
  console.log("1 polygonTemplate:", ev.target, );
  // focus range Year
  document.querySelectorAll(".rangeYear").forEach((el)=>el.classList.add("active"));
});

// onclick on any marcker
imageSeriesTemplate.events.on("hit", function(ev) {
    ev.event.stopPropagation();    // not working!
    blackVue.openPolygon_timeStamp = Date.now();
    blackVue.showCarousel(ev);
    console.log("2 imageSeriesTemplate:", ev.target);
});

// on processing map's data
polygonSeries.events.on("beforedatavalidated", function(ev) {
  if(!blackVue.beforedatavalidated){        // first trigger      // check because this event will trigger twice
    console.log("beforedatavalidated");
    blackVue.beforedatavalidated = "done";
    // send the new element to VueJS
    blackVue.cardsContainer = document.querySelector(".card-carousel");
    blackVue.cardsCarousel = document.querySelector(".card-carousel .carousel");
    blackVue.cardsController = document.querySelector(".card-carousel + .card-controller");
    // processing countries data
    blackVue.listMarkers = []; console.log("second:")
    try{
      const allBlacks_CountriesAndCategories = JSON.parse(document.getElementById('json_string_listMarkers').innerText);
      blackVue.blacksData = allBlacks_CountriesAndCategories;
      document.getElementById('json_string_listMarkers').remove();
      console.log("allBlacks_CountriesAndCategories", allBlacks_CountriesAndCategories);  // categories, periode
      for (let i = 0; i < allBlacks_CountriesAndCategories.length; i++) {
        // fill timeline
        if(allBlacks_CountriesAndCategories[i]["birth_year"] && !blackVue.timeLine.includes(allBlacks_CountriesAndCategories[i]["birth_year"]) ){
           blackVue.timeLine.push(allBlacks_CountriesAndCategories[i]["birth_year"]);
        }
        if(allBlacks_CountriesAndCategories[i]["death_year"] && !blackVue.timeLine.includes(allBlacks_CountriesAndCategories[i]["death_year"]) ) {
          blackVue.timeLine.push(allBlacks_CountriesAndCategories[i]["death_year"]);
        }
        // fill available countries in markers
        for (let j = 0; j < allBlacks_CountriesAndCategories[i]["countries"].length; j++) {
            if( !(allBlacks_CountriesAndCategories[i]["countries"][j] in blackVue.listMarkers) ) blackVue.listMarkers[allBlacks_CountriesAndCategories[i]["countries"][j]] = true;
        }
      }
      // sort timeline Array
      blackVue.timeLine.sort(function(a, b){return a - b});
      console.log("listMarkers:", blackVue.listMarkers);
    }
    catch(e){
      console.log("JSON Error: listMarkers", e);
    }
  }
  else{    // second trigger
    // update markers before they show
    blackVue.updateMarkers();
  }
});

// when map ready
chart.events.on('ready', (ev) => {
    console.log('amcharts ready');  //chart.openModal("OK. Now I'm serious."); //chart.openPopup("Hello there!");
    // update markers in case they was not updated
    blackVue.updateMarkers();
    if (document.getElementById("preloading")) {
      document.getElementById("preloading").remove();
    }

    // move map to fix centred on smoll screens
    let map = document.querySelector("g[style]");
    let c = document.querySelector(".map-container");
    const clientWidth = c.clientWidth;
    const clientHeight = c.clientHeight;
    const mapHeight = clientWidth-20;
    // for mobile only
    if(map && clientWidth < 500) {
      if (mapHeight < clientHeight*2/5) {
        map.setAttribute("transform", "translate(0,-"+mapHeight/2+")");
      }
      else if (mapHeight < clientHeight*3/5) {
        map.setAttribute("transform", "translate(0,-"+mapHeight/3+")");
      }
    }

    // disable/remove useless country on country select menu
    document.querySelectorAll('select.countryName option').forEach((el) => {
      if(!(el.value in blackVue.listMarkers)) el.remove();   //el.setAttribute('disabled',true);
    });

    // add rangeYear input field
    console.log("tspan:",document.querySelectorAll("tspan"));
    let g, label, g1, g2;
    document.querySelectorAll("tspan").forEach((el)=>{
      console.log(el)
      if(el.textContent == "TIME LINE") { g1 = el.closest("g[fill]"); }
      if(el.textContent == "categories") { g2 = el.closest("g[fill]"); el.closest("g[style]").remove(); }
    });
    let foreign1 = document.createElementNS('http://www.w3.org/2000/svg',"foreignObject");
    foreign1.setAttribute('width', 80);
    foreign1.setAttribute('height',25);
    foreign1.setAttribute('x',70);
    foreign1.setAttribute('y',-3);
    let form1 = document.createElement('FORM');
    form1.className = "rangeYear";
    let input1 = document.createElement("INPUT");
    input1.type = "number";
    input1.name = "to";
    input1.onchange = function(e){
      e.stopPropagation();
      blackVue.changePeriode(e);
    }
    form1.appendChild(input1);
    foreign1.appendChild(form1);

    let foreign2 = document.createElementNS('http://www.w3.org/2000/svg',"foreignObject");
    foreign2.setAttribute('width', 80);
    foreign2.setAttribute('height',25);
    foreign2.setAttribute('x',-90);
    foreign2.setAttribute('y',-3);
    let form2 = document.createElement('FORM');
    form2.className = "rangeYear";
    let input2 = document.createElement("INPUT");
    input2.type = "number";
    input2.name = "from";
    input2.onchange = function(e){
      e.stopPropagation();
      blackVue.changePeriode(e);
    }
    form2.appendChild(input2);
    foreign2.appendChild(form2);

    g1.prepend(foreign1)
    g1.prepend(foreign2)

    // add categories ckeckbox field
    let activist, scientist, politic, art, sport, spiritual, other;
    // add checkboxes         // for desktop and iPad (removed |iPad|)
    if(!(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || document.querySelector(".carousel-container").clientWidth < 400)){
      activist = createCheckbox_foreignObject(78,25,-290,-10,"cat_activist","Activist");
      scientist = createCheckbox_foreignObject(90,25,-200,-10,"cat_scientist","Scientist");
      politic = createCheckbox_foreignObject(70,25,-100,-10,"cat_politic","Politic");
      art = createCheckbox_foreignObject(50,25,-20,-10,"cat_art","Art");
      sport = createCheckbox_foreignObject(65,25,40,-10,"cat_sport","Sport");
      spiritual = createCheckbox_foreignObject(85,25,120,-10,"cat_spiritual","Spiritual");
      other = createCheckbox_foreignObject(70,25,220,-10,"cat_other","Other");
    }
    else{    // for mobile
      activist = createCheckbox_foreignObject(78,25,-160,-10,"cat_activist","Activist");
      scientist = createCheckbox_foreignObject(90,25,-80,-10,"cat_scientist","Scientist");
      politic = createCheckbox_foreignObject(70,25,13,-10,"cat_politic","Politic");
      art = createCheckbox_foreignObject(50,25,85,-10,"cat_art","Art");
      sport = createCheckbox_foreignObject(65,25,-160,23,"cat_sport","Sport");
      spiritual = createCheckbox_foreignObject(85,25,-80,23,"cat_spiritual","Spiritual");
      other = createCheckbox_foreignObject(70,25,13,23,"cat_other","Other");
      // hide show button annimation for sharemodal
      document.querySelector('#share-modal button[name="show"]').classList.add("mobile");
    }

    g2.prepend(activist);
    g2.prepend(scientist);
    g2.prepend(politic);
    g2.prepend(art);
    g2.prepend(sport);
    g2.prepend(spiritual);
    g2.prepend(other);

     // slide event    // what to do when slider is dragged
     let yearFrom = document.querySelector('.rangeYear input[name=from]');
     let yearTo = document.querySelector('.rangeYear input[name=to]');
     slider.events.on("rangechanged", function(event) {
         let index = Math.round((blackVue.timeLine.length - 1) * slider.start);
         console.log("slideStatus 1", slideStatus, index)
         document.querySelectorAll(".rangeYear").forEach((el) => { el.classList.add("active"); });

         if(index < blackVue.timeLine.length -1){
           yearFrom.value = blackVue.timeLine[index];
           yearTo.value = blackVue.timeLine[index+1];
           yearFrom.dispatchEvent(new Event('change'));
           yearTo.dispatchEvent(new Event('change'));
           if(slideStatusInterval == null){
              slideStatusInterval = setInterval(function(){
                if(slideStatus == 1){
                  clearInterval(slideStatusInterval);
                  slideStatusInterval = null;
                  setTimeout(()=>{
                    if(slider.start == 1) {
                      slideStatus = 0;
                      yearFrom.value = "";
                      yearTo.value = "";
                      yearFrom.dispatchEvent(new Event('change'));
                      yearTo.dispatchEvent(new Event('change'));
                    }
                  }, 1000);
                  document.querySelectorAll(".rangeYear").forEach((el) => { el.classList.remove("active"); });
                  console.log(slideStatusInterval);
                }
                console.log("interval",slideStatusInterval);
                slideStatus = 1;
              },500);
          }
          slideStatus = 0;
        }
     });

     // add event for openShowcase link
     const openShowcase = document.getElementById("openShowcase");
     if(openShowcase) {
       openShowcase.closest("foreignObject").style.width = "100%";
       openShowcase.onclick = function(){
         blackVue.showcase(document.querySelector("#showcase"));
         if(window.history.pushState) {
           history.replaceState(null, null, blackVue.slug);
         }
       };
     }

});


function createCheckbox_foreignObject(width,height,x,y,id,name){
  let foreign = document.createElementNS('http://www.w3.org/2000/svg',"foreignObject");
  foreign.setAttribute('width', width);
  foreign.setAttribute('height',height);
  foreign.setAttribute('x',x);
  foreign.setAttribute('y',y);
  let form = document.createElement('FORM');
  form.id = id;
  form.className = "categories";
  form.innerHTML = '<label class="container-checkbox">'+name+'<input type="checkbox" checked="checked"><span class="checkmark"></span></label>';
  form.onclick = function(e){
    e.stopPropagation();
    if(e.target.tagName == "INPUT")  blackVue.changeCategory(e);
  }
  foreign.appendChild(form);
  return foreign;
}



/*************************************** Usful function **************************************/

/*
// detect zoom level
chart.events.on("zoomlevelchanged", test);
function test(ev){
    let chart = ev.target.baseSprite;
    let series = chart.map.getKey("markers");
    series.mapImages.each(function(image) {
      console.log(chart.zoomLevel, chart, chart.radius);
      if (chart.zoomLevel && chart.zoomLevel > 4) {
      }
    });
}*/

/*
// zoom on click
polygonTemplate.events.on("hit", function(ev) {
  ev.target.series.chart.zoomToMapObject(ev.target)
});
*/


/**************************************** Carousel ***************************************/

class DraggingEvent {
  constructor(target = undefined, carousel = undefined) {
    this.target = target;
    this.carousel = carousel;
    // Carrousel Prev and Next button
    this.prev = null;
    this.next = null;
    this.leftPosLastCards = {"left":{"id":"","leftPos":101}, "right":{"id":"","leftPos":0}};
    // save last image state
    this.left_lastCard = null;
    this.right_lastCard = null;
    // save scroll direction
    this.scrollDirection = {};
    this.cardHighlighted = "3";    // the middle card, third card onload
    this.cursorState = 0;
    this.elementsListener = [target, carousel, document.body, blackVue.cardsController];
  }

  event(callback, self=this) {  //self=this to retreive the original this (the instance)
    let handler;

    this.target.addEventListener("mousedown", e => {
      e.preventDefault()

      // for skip any event on shareLogo click
      if(blackVue.skipEventCard(e)) return;

      handler = callback(e)

      self.carousel.addEventListener("mousemove", handler)

      document.body.addEventListener("mouseleave", clearDraggingEvent)

      document.body.addEventListener("mouseup", clearDraggingEvent)

      function clearDraggingEvent() {
        self.carousel.removeEventListener("mousemove", handler)
        document.body.removeEventListener("mouseleave", clearDraggingEvent)
        document.body.removeEventListener("mouseup", clearDraggingEvent)


        handler(null)
        // after mouseup or mouseleave, update links
        self.updateControllerLinks()
        // save scroll direction computer
        self.updateScrollDirection(event)
        console.log("direction pc:", self.scrollDirection);
        console.log("clearDraggingEvent");
      }
      //self.eventsToDelete["functions"].push(handler,clearDraggingEvent);
    })

    this.target.addEventListener("touchstart", e => {

      // for skip any event on shareLogo click
      if(blackVue.skipEventCard(e)) return;

      handler = callback(e)

      self.carousel.addEventListener("touchmove", handler)

      document.body.addEventListener("touchend", clearDraggingEvent)

      document.body.addEventListener("mouseleave", clearDraggingEvent)

      function clearDraggingEvent() {
        self.carousel.removeEventListener("touchmove", handler)
        document.body.removeEventListener("touchend", clearDraggingEvent)
        document.body.removeEventListener("mouseleave", clearDraggingEvent)

        handler(null)
       // save scroll direction for mobile
        self.updateScrollDirection(event)
        console.log("direction mobile:", self.scrollDirection);
      }
      //self.eventsToDelete["functions"].push(handler,clearDraggingEvent);
    },{ passive: true})
  }




  updateScrollDirection(e){
    this.scrollDirection.end = this.getStartingPoint(e)[0];   //get end croll
    this.cursorState = "moving"; blackVue.lastScrollDirection.cursorState = "moving";
    if(this.scrollDirection.start - this.scrollDirection.end > 0 ) { this.scrollDirection.direction = "left";  blackVue.lastScrollDirection.direction = "left"; }
    else if(this.scrollDirection.start - this.scrollDirection.end < 0 ) { this.scrollDirection.direction = "right"; blackVue.lastScrollDirection.direction = "right"; }
    else{  // click
        this.cursorState = "click";  blackVue.lastScrollDirection.cursorState = "click";
    }
  }
  // update Prev and Next link
  updateControllerLinks(){  console.log("updateControllerLinks");
      document.querySelectorAll(".card[data-x]").forEach((el)=>{el.onclick = null;})
      this.prev = document.querySelectorAll('.card[data-x="1"], .card[data-x="2"]');
      this.next = document.querySelectorAll('.card[data-x="-1"], .card[data-x="-2"]');
      let self = this;
      if(this.prev.length > 0) {
        this.prev.forEach((el)=>{
            if(blackVue.dataImages.length < 5 && el.querySelector(".image-card").src == blackVue.onePixelUrl) el.style.zIndex = "-3"; // give .card[data-x="2"] more clickable espace
            el.onclick = function(e){
              // check if click was trigged by real click or mouseleave
              console.log("click prev",self.cursorState);
              blackVue.lastScrollDirection.direction = "left";
              if(self.cursorState == "click" && el.querySelector(".image-card").src != blackVue.onePixelUrl) {
                  self.target.dispatchEvent(new CustomEvent("prev", {detail: {type: "keyboard"}}));
              }
           }
         });
      }
      if(this.next.length > 0) {
        this.next.forEach((el)=>{
            if (blackVue.dataImages.length < 5 && el.querySelector(".image-card").src == blackVue.onePixelUrl) el.style.zIndex = "-3";  // give .card[data-x="2"] more clickable espace
            el.onclick = function(e){
              // check if click was trigged by real click or mouseleave
              console.log("click next",self.cursorState);
              blackVue.lastScrollDirection.direction = "right"
              if(self.cursorState == "click" && el.querySelector(".image-card").src != blackVue.onePixelUrl) {
                  self.target.dispatchEvent(new CustomEvent("next", {detail: {type: "keyboard"}}));
              }
           }
         });
       }
       // change zIndex of highlighted card // move card to back in case carousel stack on empty card
       let highlighted = document.querySelector('.card[data-x="0"]');
       if(blackVue.dataImages.length < 5 && highlighted.querySelector(".image-card").src == blackVue.onePixelUrl) highlighted.style.zIndex = "-3";
  }

  getStartingPoint(ev){
    let startingX, startingY;
    if ("touches" in ev) {
      if(ev.touches.length > 0){
        startingX = ev.touches[0].clientX
        startingY = ev.touches[0].clientY
      }
      else{
        startingX = ev.changedTouches[0].clientX
        startingY = ev.changedTouches[0].clientY
      }
    } else {
      startingX = ev.clientX
      startingY = ev.clientY
    }
    return [startingX, startingY]
  }
  // Get the distance that the user has dragged
  getDistance(callback) {
    let self = this;
    function distanceInit(e1) {
      let [startingX, startingY] = self.getStartingPoint(e1);

      console.log("getDistance:", startingX, startingY);
      // save starting distance
      self.scrollDirection.start = startingX;


      return function(e2) {
        if (e2 === null) {
          return callback(null)
        } else {

          if ("touches" in e2) {
            return callback({
              x: e2.touches[0].clientX - startingX,
              y: e2.touches[0].clientY - startingY
            })
          } else {
            return callback({
              x: e2.clientX - startingX,
              y: e2.clientY - startingY
            })
          }
        }
      }
    }

  this.event(distanceInit);

  }
}


class CardCarousel extends DraggingEvent {
  constructor(container, carousel = undefined, controller = undefined) {
    super(container, carousel)

    // DOM elements
    this.container = container
    this.controllerElement = controller
    this.cards = container.querySelectorAll(".card")

    // Carousel data
    this.centerIndex = (this.cards.length - 1) / 2;
    this.cardWidth = this.cards[0].offsetWidth / this.container.offsetWidth * 100
    this.xScale = {};

    // observer for mutation
    //this.observer = null;

    // Resizing
    window.removeEventListener("resize", this.updateCardWidth.bind(this));
    window.addEventListener("resize", this.updateCardWidth.bind(this));

// activate controller from link .visuallyhidden
    if (this.controllerElement) {
      let controller = this.controllerElement
      controller.addEventListener("keydown", this.controller.bind(this))
      //this.controllerElement.addEventListener("click", this.controller.bind(this))
      this.target.addEventListener("prev", function(e){ console.log("prev");
        if(e.detail.type == "keyboard") controller.dispatchEvent(new KeyboardEvent('keydown',{'key':'','keyCode':'39'}));
        else if(e.detail.type == "scroll") controller.dispatchEvent(new KeyboardEvent('keydown',{'key':'','keyCode':'0'}));
      });
      this.target.addEventListener("next", function(e){ console.log("next");
        if(e.detail.type == "keyboard") controller.dispatchEvent(new KeyboardEvent('keydown',{'key':'','keyCode':'37'}));
        else if(e.detail.type == "scroll") controller.dispatchEvent(new KeyboardEvent('keydown',{'key':'','keyCode':'0'}));
      });
      //this.controllerElement.dispatchEvent(new KeyboardEvent('keydown',{'key':'','keyCode':'39'}));
      //this.controllerElement.click();
      this.controllerElement.focus();
      document.querySelector(".card-carousel").classList.add("smooth-return");
      //window.dispatchEvent(new Event("mouseup"));
      console.log("Carousel ready!");
      //document.querySelector('.card[data-x="1"]').addEventListener("click", function(){console.log("click next")});
      //document.querySelector('.card[data-x="1"]').addEventListener("click", function(){console.log("click prev")});
    }

    // add listener for highlight change    // i see twice mutation leave like that not a big deal, probably caused by tiwice highlight change
/*    this.observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
      	  if(mutation.type === 'attributes' && mutation.target.className == "card highlight"){
              console.log("mutation", mutation);
              // update blackname for less than 6 images ( no onchange url)
              setTimeout(function(){
                blackVue.updateBlackName();
              },10);  // 0 will do the job as well
      	  }
        });
    });
    this.observer.observe(this.container, {
      attributes: true,
      attributeOldValue : true,
      attributeFilter: ['class'],
      characterData: true,
      subtree: true
    });
*/

    // Initializers
    this.build()

    // Bind dragging event
    super.getDistance(this.moveCards.bind(this));
  }



  updateCardWidth() {
    this.cardWidth = (this.cards[0].offsetWidth / this.container.offsetWidth * 100);
    this.build();
  }

  build(fix = 0) {
    for (let i = 0; i < this.cards.length; i++) {
      const x = i - this.centerIndex;
      const scale = this.calcScale(x)
      const scale2 = this.calcScale2(x)
      const zIndex = -(Math.abs(i - this.centerIndex));
      const leftPos = this.calcPos(x, scale2)

      this.xScale[x] = this.cards[i]

      this.updateCards(this.cards[i], {
        x: x,
        scale: scale,
        leftPos: leftPos,
        zIndex: zIndex
      })
    }
    // settup prev and next links at load
    this.updateControllerLinks();
    // load first set of image
    this.loadFirstImages()
  }

  loadFirstImages(){ console.log("load");
      for (let i = 0; (i<5&i<blackVue.dataImages.length); i++) {   // (i<5&i<blackVue.dataImages.length) this limit loop to only first 5
        if(blackVue.dataImages[i]["data-x"] == "0") document.querySelector('.card[data-x="0"] img').src=blackVue.getCleanImage(blackVue.dataImages[i]["url"]);
        else if(blackVue.dataImages[i]["data-x"] == "1") document.querySelector('.card[data-x="1"] img').src=blackVue.getCleanImage(blackVue.dataImages[i]["url"]);
        else if(blackVue.dataImages[i]["data-x"] == "-1") document.querySelector('.card[data-x="-1"] img').src=blackVue.getCleanImage(blackVue.dataImages[i]["url"]);
        else if(blackVue.dataImages[i]["data-x"] == "2") document.querySelector('.card[data-x="2"] img').src=blackVue.getCleanImage(blackVue.dataImages[i]["url"]);
        else if(blackVue.dataImages[i]["data-x"] == "-2") document.querySelector('.card[data-x="-2"] img').src=blackVue.getCleanImage(blackVue.dataImages[i]["url"]);
      }
      // add cards to list to remove event later
      const cards = document.querySelectorAll('.card');
      for (let i = 0; i < cards.length; i++) {
        this.elementsListener.push(cards[i]);
      }
  }

  controller(e) {  //console.log("e:", e, e.keyCode);
    const temp = {...this.xScale};

      if (e.keyCode === 39) {
        // Right arrow
        for (let x in this.xScale) {
          const newX = (parseInt(x) - 1 < -this.centerIndex) ? this.centerIndex : parseInt(x) - 1;
          temp[newX] = this.xScale[x]
        }
      }

      if (e.keyCode == 37) {
        // Left arrow
        for (let x in this.xScale) {
          const newX = (parseInt(x) + 1 > this.centerIndex) ? -this.centerIndex : parseInt(x) + 1;
          temp[newX] = this.xScale[x]
        }
      }

// for custom event and any key who will not produce caracter, e.keyCode == 0
console.log("keyCode", e.keyCode);

      this.xScale = temp;

      for (let x in temp) {
        const scale = this.calcScale(x),
              scale2 = this.calcScale2(x),
              leftPos = this.calcPos(x, scale2),
              zIndex = -Math.abs(x)

        this.updateCards(this.xScale[x], {
          x: x,
          scale: scale,
          leftPos: leftPos,
          zIndex: zIndex
        })
      }
      // update prev and next links
      if(e.keyCode === 39 || e.keyCode == 37){
        this.updateControllerLinks();
        if(blackVue.dataImages.length > 5){

          //for(let i=0; (i<5&i<blackVue.dataImages.length); i++){ console.log(blackVue.dataImages)       {"data-x": 1, "url": ""}
            // click right (key right)
          if(e.keyCode === 39) {
            blackVue.click_loadNewImage("right");
          }
            // click left (key left)
          else if(e.keyCode === 37) {
            blackVue.click_loadNewImage("left");
          }

          console.log("change");
          if(self.left_lastCard == document.querySelector('.card[data-x="-2"]')){
            console.log("-2:",document.querySelector('.card[data-x="-2"]'));
          }
          self.left_lastCard = document.querySelector('.card[data-x="-2"]');
          if(self.right_lastCard == document.querySelector('.card[data-x="2"]')){
            console.log("2:",document.querySelector('.card[data-x="2"]'));
          }
          self.right_lastCard = document.querySelector('.card[data-x="2"]');
        }
      }

  }

  calcPos(x, scale) {
    let formula;

    if (x < 0) {
      formula = (scale * 100 - this.cardWidth) / 2

      return formula

    } else if (x > 0) {
      formula = 100 - (scale * 100 + this.cardWidth) / 2

      return formula
    } else {
      formula = 100 - (scale * 100 + this.cardWidth) / 2

      return formula
    }
  }

  updateCards(card, data) {
    if (data.x || data.x == 0) {
      card.setAttribute("data-x", data.x)
    }

    if (data.scale || data.scale == 0) {
      card.style.transform = `scale(${data.scale})`

      if (data.scale == 0) {
        card.style.opacity = data.scale
      } else {
        card.style.opacity = 1;
      }
    }

    if (data.leftPos) {
      card.style.left = `${data.leftPos}%`;

      //console.log(window.getComputedStyle(document.querySelector('.card[data-x="2"] '), null).getPropertyValue("z-index"));
    /*  console.log("data:", card.id, data.leftPos);
      // save extrem left card leftPos
      if(this.leftPosLastCards.left.leftPos > data.leftPos){
         this.leftPosLastCards.left.id = card.id;
         this.leftPosLastCards.left.leftPos = data.leftPos;
      }
      // save extrem right card leftPos
      if(this.leftPosLastCards.right.leftPos < data.leftPos){
         this.leftPosLastCards.right.id = card.id;
         this.leftPosLastCards.right.leftPos = data.leftPos;
      }*/
    }

    if (data.zIndex || data.zIndex == 0) {
      if (data.zIndex == 0) {  //console.log("not highlight:", card);
        // save current card highlighted         //card.classList.contains("highlight") &&
        if(this.cardHighlighted != card.id && this.xScale[0] == card) { console.log("highlight:", card);
          // signal card change
          // check direction croll
          console.log("change",this.cardHighlighted, card.id);
          //this.target.dispatchEvent(new CustomEvent("prev", {detail: {type: "scroll"}}))
          //this.target.dispatchEvent(new CustomEvent("next", {detail: {type: "scroll"}}))
          this.cardHighlighted = card.id;
          // now after new card, add new image
          console.log("gggggggggggggggggg:",this.scrollDirection.start, event);
          this.updateScrollDirection(event)
          if(this.cursorState == "moving" && this.scrollDirection.direction == "right") blackVue.scroll_loadNewImage("right");  //(this.xScale, "right");
          else if(this.cursorState == "moving" && this.scrollDirection.direction == "left") blackVue.scroll_loadNewImage("left");
        }
        card.classList.add("highlight");
      } else {
        card.classList.remove("highlight");
      }

      card.style.zIndex = data.zIndex
    }
  }

  calcScale2(x) {
    let formula;

    if (x <= 0) {
      formula = 1 - -1 / 5 * x

      return formula
    } else if (x > 0) {
      formula = 1 - 1 / 5 * x

      return formula
    }
  }

  calcScale(x) {
    const formula = 1 - 1 / 5 * Math.pow(x, 2)

    if (formula <= 0) {
      return 0
    } else {
      return formula
    }
  }

  checkOrdering(card, x, xDist) {
    const original = parseInt(card.dataset.x)
    const rounded = Math.round(xDist)
    let newX = x

    if (x !== x + rounded) {
      if (x + rounded > original) {
        if (x + rounded > this.centerIndex) {

          newX = ((x + rounded - 1) - this.centerIndex) - rounded + -this.centerIndex
        }
      } else if (x + rounded < original) {
        if (x + rounded < -this.centerIndex) {

          newX = ((x + rounded + 1) + this.centerIndex) - rounded + this.centerIndex
        }
      }

      this.xScale[newX + rounded] = card;
    }

    const temp = -Math.abs(newX + rounded)

    this.updateCards(card, {zIndex: temp})

    return newX;
  }

  moveCards(data) {
    let xDist;

    if (data != null) {
      this.container.classList.remove("smooth-return")
      xDist = data.x / 250;
    } else {


      this.container.classList.add("smooth-return")
      xDist = 0;

      for (let x in this.xScale) {
        this.updateCards(this.xScale[x], {
          x: x,
          zIndex: Math.abs(Math.abs(x) - this.centerIndex)
        })
      }
    }

    // update state cursor   1 time == click , more == scroll
    //this.cursorState.id += 1;
    //console.log("moving:", this.cursorState);

    for (let i = 0; i < this.cards.length; i++) {
      const x = this.checkOrdering(this.cards[i], parseInt(this.cards[i].dataset.x), xDist);
      const scale = this.calcScale(x + xDist);
      const scale2 = this.calcScale2(x + xDist);
      const leftPos = this.calcPos(x + xDist, scale2);

      this.updateCards(this.cards[i], {
        scale: scale,
        leftPos: leftPos
      });
    }
  }
}



// mehtod to reorganize array
Array.prototype.move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

// remove array with provided value
function removeItemArray (arr, value) {
  let index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
}
