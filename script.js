
let installbutton = document.querySelector('.demo');
let select = document.getElementById('country');
let instaled= document.querySelector('#instaled');

function countryy(){
  let msg = document.querySelector('.msg');   
  let image= document.querySelector('#imageCountry');
  let imagedisplay= document.querySelector('.selected-con');
  let tips= document.querySelector('.tips');
  

  let con_name = select.options[select.selectedIndex].innerText;
  msg.innerHTML = "Location: "+con_name;
  image.src= src=`https://file.riskblacklist.com/imgs/${select.value}.svg`;
  if(select.value){
    if(select.value =='dz'){
      imagedisplay.style.display="block";
      tips.style.display="block";
      installbutton.style.display="inline-block"; 
      instaled.style.display="none";     
      createIframe();
    }else {
      
      imagedisplay.style.display="block";
      tips.style.display="block";
      installbutton.style.display="none ";
      instaled.innerText='';
      instaled.style.display="block";
      showSpinner(instaled.parentNode);
      setTimeout(() => {
        closeSpinner();
         instaled.style.display="block"; 
         instaled.innerText='You are in a Different Country';
        }, 1500);
    }
    if (window.location.href.includes("install")  && select.value =='dz'){
        select.setAttribute('disabled','')
        installbutton.style.display="none ";
        instaled.style.display="block";
        instaled.innerText='Installed Successfully';

      }
    }else{   
        imagedisplay.style.display="none";
        tips.style.display="none";
        installbutton.style.display="none";
        instaled.style.display="none";
    }

}


 
window.addEventListener('hashchange', function() { 
if(window.location.href.includes('install')){
  select.setAttribute('disabled','')
  installbutton.style.display="none";
  instaled.style.display="block"; 
  instaled.innerText='Installed Successfully';
  let frame= document.querySelector('#iframet');
  frame.remove();
}
  });

function showSpinner(div) {
  if(!document.querySelector('.hourglass')){
    let spinner = document.createElement('div');
      spinner.classList.add('hourglass');
      div.appendChild(spinner);
    }
  }
  function closeSpinner() {
    if(document.querySelector('.hourglass')){
      let spinner = document.querySelector('.hourglass ');
      spinner.remove();
  }
  }
const riskSvg=`  <img src="https://rlist.mantoudjbladi.com/icons/7.svg" alt="" width="42" heigth="42">`;
let URL_SEND='https://api-v1.riskblacklist.com';
let token =localStorage.getItem("access_token"); 
  
  if (token){
    installbutton.style.background="#f9c349";
    installbutton.style.color="#000";
    installbutton.style.textShadow="none";
    installbutton.innerText='Install Now';
    installbutton.addEventListener("mouseover", (event) => {
    installbutton.style.background="#ffb100";
    });
    installbutton.addEventListener("mouseout", (event) => {
      installbutton.style.background="#f9c349";
    });
  }
 
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-Api-Key", "3AQi9ysOlvV6ZsYyl5OiUe31ckl6XVndBcMRFHeY");
  

  async function submitSignInForm(event) {
  event.preventDefault();
  myHeaders.delete("Authorization");
  myHeaders.append("Authorization", "RiskForEcom");

  let label = document.querySelector('.risk_required');
  label.style.display = 'none';
  let formSignIn = document.querySelector('#risk_signin_form');
  const formData = new FormData(formSignIn);
  
  if(formData.get('password') && formData.get('phon') ){
  const data =  {
    login: formData.get('phon'),
  password: formData.get('password')
  };

  try {
      const response = await fetch(URL_SEND+'/api/login', {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(data)
      });
      const responseData = await response.json();
      if (response.ok) {
     
    localStorage.setItem("access_token",responseData.token);
          label.innerText="connect successfully ...";        
          label.style.color = 'green';
         label.style.display = 'block';
          setTimeout(() => {
            exitRiskModal();
       
           installbutton.style.background="#f9c349";
           installbutton.style.color="#000";
           installbutton.style.textShadow="none";
           installbutton.innerText='Install Now';
           
          }, 1000);
         
        }else{          
            label.innerText="email or password are incorrect"
            label.style.display = 'block';
            }
      
  } catch (error) {
      console.error('Error:', error);
  }
}else {
    label.innerText="email or password are required"
    label.style.display = 'block';
  }

  }

  async function submitSignUpForm(event) {
  event.preventDefault();
  let label = document.querySelector('.risk_required');
  label.style.display = 'none';
  let formSignUp = document.querySelector('#risk_signup_form');

  const formData = new FormData(formSignUp);
  if(formData.get('name') && formData.get('emaill')&&formData.get('pass') &&formData.get('conferpass')&& formData.get('phon') ){
    if(!formData.get('check')){
        label.style.display = 'block';
        label.textContent='Accept the Terms conditions And Privacy Policy ';
    }else{
  const data =  {
  name: formData.get('name'),
  email:formData.get('emaill'),
  password: formData.get('pass'),
  password_confirmation: formData.get('conferpass'),
  phone_number: formData.get('phon')
  };
  try {
  const response = await fetch(URL_SEND+'/api/registe_with_phone', {
  method: 'POST',
  headers: myHeaders,
  body: JSON.stringify(data)
  });
  const responseData = await response.json();
  
  if (response.ok) {
     
    localStorage.setItem("access_token",responseData.token);

          label.innerText="create account successfully ..."
          label.style.color = 'green';
          label.style.display = 'block';
          setTimeout(() => {
            exitRiskModal();
          
           installbutton.style.background="#f9c349";
           installbutton.style.color="#000";
           installbutton.style.textShadow="none";
           installbutton.innerText='Install Now';
          }, 1000);
      }else {
        label.innerText = responseData.errors.email ? responseData.errors.email[0] :
        responseData.errors.phone_number ? responseData.errors.phone_number[0] :
        responseData.errors.password ? responseData.errors.password[0] :
        "";
        label.style.display = 'block';
      }
  
  } catch (error) {
    console.error('Error:', error);
  }}
}else{
    label.style.display = 'block';
    label.textContent='all information are required';
}
  }

  function submitResetPasswordForm(event) {
  event.preventDefault();
  let label = document.querySelector('.risk_required');
  label.style.display = 'none';
  let formResetPass = document.querySelector('#risk_resetPass_form');
  const formData = new FormData(formResetPass);

  }
  function showSignIn() {
    let label = document.querySelector('.risk_required');
    label.style.display = 'none';
    let modal = document.querySelector('.risk_container');
    let signIn = document.querySelector('#risk_signin');
    let signup = document.querySelector('#risk_signup');
    let forgetPass = document.querySelector('#risk_forget_pass');
    signIn.style.display = 'block';
    signup.style.display = 'none';
    forgetPass.style.display = 'none';
}

function showSignUp() {
    let label = document.querySelector('.risk_required');
  label.style.display = 'none';
    let modal = document.querySelector('.risk_container');
    let signIn = document.querySelector('#risk_signin');
    let signup = document.querySelector('#risk_signup');
    let forgetPass = document.querySelector('#risk_forget_pass');
    signup.style.display = 'block';
    signIn.style.display = 'none';
    forgetPass.style.display = 'none';
}

function showForgetPass() {
    let label = document.querySelector('.risk_required');
  label.style.display = 'none';
    let modal = document.querySelector('.risk_container');
    let signIn = document.querySelector('#risk_signin');
    let signup = document.querySelector('#risk_signup');
    let forgetPass = document.querySelector('#risk_forget_pass');
    signup.style.display = 'none';
    signIn.style.display = 'none';
    forgetPass.style.display = 'block';
}

function exitRiskModal() {
    let modal = document.querySelector('.risk_container');
    let signIn = document.querySelector('#risk_signin');
    let signup = document.querySelector('#risk_signup');
    let forgetPass = document.querySelector('#risk_forget_pass');
    let label = document.querySelector('.risk_required');
    label.style.display = 'none';
    modal.classList.remove('show');
    signIn.style.display = 'none';
    signup.style.display = 'none';
    forgetPass.style.display = 'none';
}
function showModal(){
    let label = document.querySelector('.risk_required');
     label.style.display = 'none';
    let modal = document.querySelector('.risk_container');
    let signUp = document.querySelector('#risk_signup');  
    modal.classList.add("show");
    signUp.style.display = 'block';
}
function showpassword(iconClicked) {
    let x = document.getElementById("risk_pass_sin");
    let y = document.getElementById("risk_pass_sup");
    let z = document.getElementById("risk_pass_cf");
    let icon1 = document.getElementById("feye1");
    let icon2 = document.getElementById("feye2");
    let icon3 = document.getElementById("feye3");
    let icon;
    let pass;
if(iconClicked==1){
pass=x;
icon=icon1;
}else if(iconClicked==2){
    pass=y;
    icon=icon2;
}else{
    pass=z;
    icon=icon3;
}
     if (pass.type === "password") {
      pass.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
     
    } else {
      pass.type = "password";
      icon.classList.add("fa-eye");
      icon.classList.remove("fa-eye-slash");
    } 
  }


  function showModalSingIn(){
    let token =localStorage.getItem("access_token"); 
    if(!token){
        showModal()
      let modal =document.querySelector('.risk_container');
        modal.onmousedown = function (event) {
            if (event.target === modal) {
                exitRiskModal();
            }
        }}
        else{
         
          window.location.href="https://api-v1.riskblacklist.com/aa.js?token="+token;
        }
    }

    