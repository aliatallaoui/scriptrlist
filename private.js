
const allowedUrls =["https://app.noest-dz.com/validation/orders",
"https://app.noest-dz.com/toprepare/orders",
                     "https://app.noest-dz.com/validated/orders",
                     "https://app.noest-dz.com/inpreparation/orders",
                     "https://app.noest-dz.com/valid/orders",
                     "https://app.noest-dz.com/vers/hub",
                     "https://app.noest-dz.com/in/hub",
                     "https://app.noest-dz.com/livraisons",
                     "https://app.noest-dz.com/livraisons/suspendu",
                     "https://app.noest-dz.com/livraison/non/encaisse",
                     "https://app.noest-dz.com/retours/transit"];



let token =localStorage.getItem("access_token"); 

(async ()=>{
const response =await fetch(URL_SEND+"/api/check-token?token="+token);
const result = await response.json();
let vToken = result.valid
if(vToken){   
  uploadData(); 
  localStorage.setItem('valid_token', true) ;
}else{
  localStorage.setItem('valid_token', false) ;
}
})();



if (allowedUrls.includes(window.location.href)) {    
    let validToken = localStorage.getItem("valid_token");
     let table = document.querySelector("#myTable tbody")
     let checkUser;
     if (window.location.href.includes("/validation/orders") || window.location.href.includes("toprepare/orders") || window.location.href.includes("inpreparation/orders")) {
         checkUser = 3;
     } else {
         checkUser = 2;
     }
     const intervalId = setInterval(checkRows, 100);
     function checkRows() {
         const rows = table.querySelectorAll('tr');
         if (rows.length > 0) {
             if(table.rows[0].childElementCount>1){
                 clearInterval(intervalId);
                 createButton();   
                        
             }
             else{
                  clearInterval(intervalId);
             }
         }
     }

   
     function createButton(){
         if(!document.querySelector('#button-check')){
         for (let i = 0; i < table.rows.length; i++)
         {
             let td = table.rows[i].children[checkUser];
             const regex = /(\b\d{10}\b)/g;
             const regex2 = /(\b\d{9}\b)/g;
             let text = td.textContent;
             let phoneNumbers = text.match(regex) || text.match(regex2);
             let button = document.createElement("button");
             let buttonContainer = document.createElement("div");
           if(phoneNumbers){
             buttonContainer.setAttribute("class", "risk_button_container");
             button.setAttribute("id", "button-check");
             button.setAttribute("class", "risk_button");
             button.innerHTML = "Check";
             buttonContainer.appendChild(button);
             td.appendChild(buttonContainer);                               
             button.addEventListener("click", async function () {
              validToken =  localStorage.getItem("valid_token");
              token =localStorage.getItem("access_token");
              showSpinner(buttonContainer);
                
              try{
                  if(token && (validToken=='true'||validToken==true)){
                   
                    showModalDetails(td,buttonContainer,phoneNumbers,closeSpinner)                                    
                  }else{
                   showModalSingIn(closeSpinner);
                   
                                           
                  }
                 }catch (error) {
                     console.error(error);
                 }
             })
           }
         }
         }
     const observer = new MutationObserver((mutationsList) => {
         createButton();
     });
     observer.observe(table, { childList: true });
     let spinner;
     function showSpinner(div) {
      if(!document.querySelector('.lds-hourglass')){
         spinner = document.createElement('div');
         spinner.classList.add('lds-hourglass');
         div.appendChild(spinner);
        }
     }
      function closeSpinner() {
        if(document.querySelector('.lds-hourglass')){
          spinner.remove();
      }
     }
     }
 }

let VERSION_DB=versionDataBase;
let originalVersion =localStorage.getItem('DBV-version') || 1 ;
if(VERSION_DB!=originalVersion && VERSION_DB!=1){
var request = indexedDB.deleteDatabase(location.hostname);
request.onsuccess = function(event) {
console.log('IndexedDB database deleted successfully');
localStorage.setItem('DBV-version', VERSION_DB) ;
};

request.onerror = function(event) {
console.log('Error deleting IndexedDB database');
};

}



function uploadData()
{
if (!indexedDB) {
alert("not support indexedDB");
} else {
var db;
var request = indexedDB.open(location.hostname, 1);
request.onupgradeneeded = function (event) {
  db = event.target.result;
  var objectStore = db.createObjectStore("store", { keyPath: "id" });
};
request.onsuccess = function (event) {
  db = event.target.result;
  generateData();
};
request.onerror = function (event) {
 // console.log("Error creating/accessing IndexedDB database");
};
}
function add(i) {
var transaction = db.transaction(["store"], "readwrite");
var objectStore = transaction.objectStore("store");
var item = { id: i };
var request = objectStore.add(item);
request.onsuccess = function (event) {
 // console.log("Item added to the object store");
};
request.onerror = function (event) {
//  console.log("Error adding item to the object store");
};
}
async function check(item) {
var transaction = db.transaction(["store"], "readwrite");
var objectStore = transaction.objectStore("store");
var trakingId = { id: item };
var request = objectStore.get(trakingId.id);
return new Promise((resolve, reject) => {
  request.onsuccess = function (event) {
    var result = event.target.result;
    if (!result) {
      resolve(0);
    } else {
      resolve(1);
    }
  };
});
}
async function getDATA(url, isNext = false, url_2) {
try {
  var itemsIds = [];
 
  let exData=[];
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  let response = await fetch(
    "https://app.noest-dz.com/" + url,
    requestOptions
  );
  let data = await response.json();
  if (!isNext) {
  
    if (url == "retours/recu/list") {
      let allOrders = [].concat(...data.data.map((item) => item.orders));
      allOrders =allOrders.filter((obj) => obj.type_id != 2);
      return allOrders; 
    } else {
      const fData =data.data.filter((obj) => obj.type_id!=2);
      return fData;
    }
  } else {
    if(data.data.length){
      itemsIds = data.data.map(obj => obj.transaction_id);
      let lastSentIndex = parseInt(localStorage.getItem("lastSentIndex")) || 0;
      if(lastSentIndex>itemsIds.length){
        lastSentIndex=0;
      }
      for (let i = lastSentIndex; i < itemsIds.length; i++) {

        let item = itemsIds[i];
     

let res = await check(item);
if(!res){
        let itemD = await getItemData(item, url_2);
        itemD = itemD.filter((obj) => obj.livred_at);

        const filteredArray = itemD.filter(obj => !obj.tracking.endsWith('-EXCH'));
      
        exData = filteredArray.map(({tracking, client, phone, phone_2, livred_at: orderdate, adresse, commune, wilaya})=>
          ({ tracking, client, phone, phone_2, orderdate, delivery_status: "1", adresse: adresse ? adresse : "", commune, wilaya })
        );
        

        const sentSuccessfully = await sendData(exData);
        if (sentSuccessfully) {
   
           add(item);
       
          }
}
localStorage.setItem("lastSentIndex", i);//
        await delay(delayTime);
        if (i === itemsIds.length - 1) {
          localStorage.removeItem("lastSentIndex");
        }
      }

      return 1 ;
    }else{
      return 1 ;
    }
}
}
 catch (error) {
  console.error(error);
}
}
//
async function getItemData(id, url) {
try {
  var myHeaders = new Headers();
  var xscrf = document .querySelector('meta[name="csrf-token"]').getAttribute("content");
  myHeaders.append("Accept", "application/json");
  myHeaders.append("x-csrf-token", xscrf);
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  var urlencoded = new URLSearchParams();
  urlencoded.append("transaction_id", String(id));
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };
  let response = await fetch(
    "https://app.noest-dz.com/" + url,
    requestOptions
  );
  if (!response.ok) {
    throw new Error(`Error! status: ${response.status}`);
  }
  let data = await response.json();
  return data;
} catch (error) {
  console.error(error);
}
}
const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));
let delayTime = 2000;
const endpoints = [
{ url: "retours/transit/list", isNext: false, url_2: null, state: "retours" },
{ url: "retours/recu/list", isNext: false, url_2: null, state: "retours" },
{ url: "retours/payment/list", isNext: false, url_2: null, state: "retours" },
{ url: "livraison/non/encaisse/list",isNext: false,url_2: null,state: "livre",},
{ url: "livraison/NVCashed/list",isNext: false,url_2: null,state: "livre",},
{ url: "livraison/cashin/list",isNext: true,url_2: "livraison/cashin/more",state: "livre",},
{ url: "livraison/cashin/list/history",isNext: true,url_2: "livraison/cashin/more/history",state: "livre",},

];
async function generateData() {
try {
  let extractedData = [];

  let lastEndpointIndex = localStorage.getItem("lastEndpointIndex") || 0;
  for (let i = parseInt(lastEndpointIndex); i < endpoints.length; i++) {
    const endpoint = endpoints[i];
    let data = await getDATA(endpoint.url, endpoint.isNext, endpoint.url_2);
    if(data!=1){
    if (endpoint.state == "livre") {
      extractedData = data.map(
        ({
          tracking,
          client,
          phone,
          phone_2,
          livred_at: orderdate,
          adresse,
          commune,
          wilaya,
        }) => ({
          tracking,
          client,
          phone,
          phone_2,
          orderdate,
          delivery_status: "1",
          adresse: adresse ? adresse : "",
          commune,
          wilaya,
        })
      );
    } else {
      extractedData = data.map(
        ({
          tracking,
          client,
          phone,
          phone_2,
          expedier_at: orderdate,
          adresse,
          commune,
          wilaya,
        }) => ({
          tracking,
          client,
          phone,
          phone_2,
          orderdate,
          delivery_status: "0",
          adresse,
          commune,
          wilaya,
        })
      );
    }
        sendData(extractedData);
    }
    
    localStorage.setItem("lastEndpointIndex", i);
    if (i === endpoints.length - 1) {
      localStorage.setItem("lastEndpointIndex", 0);
    }

    await delay(delayTime);
  }
} catch (error) {
  console.error(error);
   setTimeout(() => {
          generateData()
      }, delayTime);
}
}
async function sendData(orders) {

  try {
      let itemsData = [];
      for (const item of orders ) {
      const res = await check(item.tracking);
      if (!res) {
        itemsData.push(item);
      }
    }
    let finalData = itemsData.map(({
      tracking,
      client,
      phone,
      phone_2,
      orderdate,
      delivery_status,
      adresse,
      commune,
      wilaya,
    })=>{
      return {tracking, client,
        phone:filterPhoneNumber(phone)
        ,phone_2:filterPhoneNumber(phone_2)
        ,orderdate,delivery_status,adresse,commune,wilaya};
    }
    )
    if(itemsData.length){
  const accessToken = localStorage.getItem('access_token');
  const response = await fetch(URL_SEND+'/api/orders', {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: accessToken,
      "X-Api-Key": "3AQi9ysOlvV6ZsYyl5OiUe31ckl6XVndBcMRFHeY",
    },
    body: JSON.stringify(finalData),
  });
   if(response.ok){
        for(const id of orders){
              add(id.tracking)
          }
          return true;
        }
}
} catch (error) {
  console.error("Error sending Data", error);
    setTimeout(() => {
          sendData(orders)
      }, delayTime);
}
return false;
}
}  

function filterPhoneNumber(phoneNumber) {

if(phoneNumber && phoneNumber!="0"){

let phoneN = phoneNumber.replace(/\D/g, '');
let filteredNumber = phoneN.replace(/^(0|00|\+)?213/, '');
filteredNumber = filteredNumber.startsWith('0') ? filteredNumber.slice(1) : filteredNumber; 
if (!filteredNumber.startsWith('0')) {
filteredNumber = '0' + filteredNumber;
}
if (filteredNumber.length === 10) {
return filteredNumber;
}}else{
  return "0"
}
}

