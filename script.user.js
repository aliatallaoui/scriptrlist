// ==UserScript==
// @name        RiskBlackList.v.1.1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match         *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=noest-dz.com
// @exclude     https://www.yalidine.com/*
// @exclude     https://www.yalidine.app/*
// @grant        none

// @run-at document-start

// ==/UserScript==

(function() {
    'use strict';
    let token ='123456';
    localStorage.setItem('access_token',token);
    if(window.location.href.includes("/dane/"))
    {
        if(!window.top.location.href.includes("#install")){
            window.top.location=window.top.location+"#install";
        }
    }
    document.addEventListener("DOMContentLoaded", async function() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://login.riskblacklist.com/wp-content/themes/blist/scriptrlist/custom.css';
        document.head.appendChild(link);
        const excludeKeywords = ['facebook', 'youtube', 'google', 'riskblacklist','trueclient'];
        const currentUrl = window.location.href;
        if (excludeKeywords.some(keyword => currentUrl.includes(keyword))) {
            return;
        }
        const API_URL = "https://api-v1.riskblacklist.com/api/";
        const hostName=window.location.hostname;
        const publicScript_Url = API_URL+ "get-script?url=" +hostName+"/public";
        const privateScript_Url = API_URL+ "get-script?url=" +hostName +"/private";
        const response = await fetch(publicScript_Url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "X-Api-Key": "3AQi9ysOlvV6ZsYyl5OiUe31ckl6XVndBcMRFHeY"
            }
        });
        const firstScriptURL = await response.json();
        const scriptPublic = document.createElement('script');
        scriptPublic.setAttribute('src', firstScriptURL.scriptPath);
        const vDataBase = document.createElement('script');
        vDataBase.textContent = `let versionDataBase = ${firstScriptURL.versions};`;
        document.body.append(vDataBase);
        scriptPublic.addEventListener('load', async function() {
            const response = await fetch(privateScript_Url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "X-Api-Key": "3AQi9ysOlvV6ZsYyl5OiUe31ckl6XVndBcMRFHeY"
                }
            });
            const secondScriptURL = await response.json();
            const scriptPrivate = document.createElement('script');
            scriptPrivate.setAttribute('src', secondScriptURL.scriptPath);
            document.head.appendChild(scriptPrivate);
        });
        document.head.appendChild(scriptPublic);
});
})();
