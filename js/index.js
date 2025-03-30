import * as elements from "./elements.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var telegramUser = urlParams.get('user');
var isAnonymous = urlParams.get('anon');

async function sendInputTG(userInput, isAnonymous, telegramUser) {
  try {
    const response = await fetch("/api/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userInput, isAnonymous, telegramUser }),
    });

    const result = await response.json();

    if (response.ok) {
      if (elements.inputStatus) {
        elements.inputStatus.textContent = "Relato/problema enviado com sucesso!";
      }
    } else {
      throw new Error(result.error || "Erro desconhecido ao enviar a mensagem.");
    }
  } catch (error) {
    alert(error.message);
    if (elements.inputStatus) {
      elements.inputStatus.textContent = "Erro ao enviar relato/problema, tente novamente!";
    }
  }
}


function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
};

document.addEventListener("DOMContentLoaded", () => {
  if (isAnonymous && !(isAnonymous == "yes" || isAnonymous == "no")) {
    isAnonymous = "no";
  };

  if (isAnonymous == "yes") {
    alert("Informação importante:\nSeu endereço de IP será incluído no seu relato anônimo somente para fins de segurança.")
  };

  if (telegramUser && !telegramUser.includes("@")) {
    telegramUser = `@${telegramUser}`;
  };

  isAnonymous = capitalizeFirstLetter(isAnonymous);

  if (elements.telegramUser) {
    elements.telegramUser.textContent = telegramUser;
  };

  if (elements.isAnonymous) {
    elements.isAnonymous.textContent = isAnonymous;
  };

  if (elements.inputStatus) {
    elements.inputStatus.style.display = "none";
  }
})

if (elements.sendInput) {
  elements.sendInput.addEventListener("click", () => {
    if (!elements.userInput.value == "") {
      if (elements.inputStatus) {
        elements.inputStatus.style.display = "block";
        elements.inputStatus.textContent = `Enviando relato/problema...`;
      }
      sendInputTG(elements.userInput.value, isAnonymous, telegramUser)
    } else {
      const errorMsg = "Por favor coloque algum texto!"
      alert(errorMsg)

      if (elements.inputStatus) {
        elements.inputStatus.style.display = "block";
        elements.inputStatus.textContent = errorMsg;
      }
    }
  })
}

if (elements.goToNextPage) {
  elements.goToNextPage.addEventListener("click", () => {
    if (!elements.telegramUserInput.value == "") {
      window.location.href = `/enviar.html?anon=${elements.isAnonymousChooser.value}&user=${elements.telegramUserInput.value}`
    } else {
      const errorMsg = "Por favor coloque seu usuário no campo de usuário!"
      alert(errorMsg)

      if (elements.inputStatus) {
        elements.inputStatus.style.display = "block";
        elements.inputStatus.textContent = errorMsg;
      }
    }
  })
}