import { getElements } from "./elements.js";
const elements = getElements();

const ipAddress = await (await (await fetch("https://api.ipify.org?format=json")).json()).ip;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var telegramUser = urlParams.get('user');
var isAnonymous = urlParams.get('anon');
var isLifeIssue = urlParams.get('issue');
let isLifeIssueStr = "";
let isAnonymousStr = "";

function userAlert(error) {
  if (elements.inputStatus) {
    elements.inputStatus.style.display = "block";
    elements.inputStatus.innerText = error;
  }
  alert(error);
}

async function sendInputTG(userInput, ipAddress, isAnonymous, telegramUser, isLifeIssue) {
  try {
    const response = await fetch("/api/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userInput, ipAddress, isAnonymous, telegramUser, isLifeIssue }),
    });

    const result = await response.json();

    if (response.ok) {
      userAlert("Relato/problema enviado com sucesso!");
    } else {
      userAlert(result.error || "Erro desconhecido ao enviar a mensagem.");
    }
  } catch (error) {
    userAlert("Erro ao enviar relato/problema, tente novamente!\n\n" + error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  isAnonymous = isAnonymous && !(isAnonymous === "yes" || isAnonymous === "no") ? "no" : isAnonymous;
  isLifeIssue = isLifeIssue && !(isLifeIssue === "account" || isLifeIssue === "problem") ? "account" : isLifeIssue;

  if (isAnonymous && isAnonymous == "yes") {
    userAlert("Informação importante:\nSeu endereço de IP será incluído no seu relato anônimo somente para fins de segurança.")
  };

  if (telegramUser && !telegramUser.includes("@")) {
    telegramUser = `@${telegramUser}`;
  };

  isLifeIssueStr = isLifeIssue === "account" ? "Relato" : isLifeIssue === "problem" ? "Problema pessoal" : "Relato";
  isAnonymousStr = isAnonymous === "yes" ? "Sim" : isAnonymous === "no" ? "Não" : "Não";

  console.log(isAnonymous);

  if (elements.telegramUser) {
    elements.telegramUser.innerText = telegramUser;
  };
  
  if (elements.isLifeIssue) {
    elements.isLifeIssue.innerText = isLifeIssueStr;
  }

  if (elements.isAnonymous) {
    elements.isAnonymous.innerText = isAnonymousStr;
  };
})

if (elements.sendInput) {
  elements.sendInput.addEventListener("click", () => {
    if (!elements.userInput.value == "") {
      userAlert(`Você irá enviar o seu relato agora. Clique em OK para continuar.`);
      sendInputTG(elements.userInput.value, ipAddress, isAnonymous, telegramUser, isLifeIssue)
    } else {
      userAlert("Por favor coloque algum texto!");
    }
  })
}

if (elements.goToNextPage) {
  elements.goToNextPage.addEventListener("click", () => {
    if (!elements.telegramUserInput.value == "") {
      window.location.href = `/enviar.html?anon=${elements.isAnonymousChooser.value}&issue=${elements.isLifeIssueChooser.value}&user=${elements.telegramUserInput.value}`
    } else {
      userAlert("Por favor coloque seu usuário no campo de usuário!");
    }
  })
}