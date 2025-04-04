import * as elements from "./elements.js";
import { userAlert } from "./modal.js";

async function getIp() {
  try {
    return await (await (await fetch("https://api.ipify.org?format=json")).json()).ip;
  } catch (error) {
    userAlert("Aviso: Erro ao coletar informações essenciais", `<p>Erro ao pegar seu endereço IP!</p><br><br><p>${error}</p>`);
    location.reload();
  }
}

async function sendInputTG(userInput, ipAddress, isAnonymous, telegramUser, typeOfIssue) {
  try {
    const response = await fetch("/api/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userInput, ipAddress, isAnonymous, telegramUser, typeOfIssue }),
    });

    const result = await response.json();

    if (response.ok) {
      userAlert("Aviso: Envio de relato", `<p>Relato/problema enviado com sucesso!</p>`);
    } else {
      userAlert("Aviso: Erro ao enviar relato", `<p>${result.error} || "Erro desconhecido ao enviar a mensagem."</p>`);
    };
  } catch (error) {
    userAlert("Aviso: Erro ao enviar relato", `<p>Erro ao enviar relato/problema, tente novamente!</p><br><br><p>${error}</p>`);
  };
};

document.addEventListener("DOMContentLoaded", () => {
  let typeOfIssueStr = "";
  let isAnonymousStr = "";
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var telegramUser = urlParams.get('user');
  var isAnonymous = urlParams.get('anon');
  var typeOfIssue = urlParams.get('type');

  isAnonymous = isAnonymous && !(isAnonymous === "yes" || isAnonymous === "no") ? "yes" : isAnonymous;
  typeOfIssue = typeOfIssue && !(typeOfIssue === "account" || typeOfIssue === "problem") ? "account" : typeOfIssue;

  if (isAnonymous && isAnonymous == "yes") {
    userAlert("Aviso: Envio de relato anônimo", `<p>Informação importante: Seu endereço de IP será incluído no seu relato anônimo somente para fins de segurança.</p>`
    );
  };

  if (telegramUser && !telegramUser.includes("@")) {
    telegramUser = `@${telegramUser}`;
  };

  typeOfIssueStr = typeOfIssue === "account" ? "Relato" : typeOfIssue === "problem" ? "Problema pessoal" : "Relato";
  isAnonymousStr = isAnonymous === "yes" ? "Sim" : isAnonymous === "no" ? "Não" : "Não";

  if (elements.telegramUser) {
    elements.telegramUser.textContent = telegramUser;
  };

  if (elements.typeOfIssue) {
    elements.typeOfIssue.textContent = typeOfIssueStr;
  }

  if (elements.isAnonymous) {
    elements.isAnonymous.textContent = isAnonymousStr;
  };
});

if (elements.sendInput) {
  elements.sendInput.addEventListener("click", () => {
    if (!elements.userInput.value == "") {
      userAlert("Aviso: Envio de relato", `<p>Você irá enviar o seu relato agora. Clique em OK para continuar.</p>`);
      sendInputTG(elements.userInput.value, getIp(), isAnonymous, telegramUser, typeOfIssue);
    } else {
      userAlert("Aviso: Falta de informações", `<p>Por favor coloque algum texto!</p>`);
    };
  });
};

if (elements.goToNextPage) {
  elements.goToNextPage.addEventListener("click", () => {
    if (!elements.telegramUserInput.value == "") {
      window.location.href = `/send?anon=${elements.isAnonymousChooser.value}&type=${elements.typeOfIssueChooser.value}&user=${elements.telegramUserInput.value}`;
    } else {
      userAlert("Aviso: Falta de informações", `<p>Por favor coloque seu usuário no campo de usuário!</p>`);
    };
  });
};