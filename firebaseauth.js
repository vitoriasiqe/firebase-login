// Importa as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Configurações do Firebase
const firebaseConfig = {
  apiKey: " ",
  authDomain: " ",
  projectId: " ",
  storageBucket: " ",
  messagingSenderId: " ",
  appId: " ",
  measurementId: " "
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

//função para logar com a conta do google
const googleLogin = document.getElementById("google001")

googleLogin.addEventListener("click", function () {
  signInWithPopup(auth, provider)
    .then((result) => {

      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      console.log(user);
      window.location.href = "../homepage.html";

    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
})

//função para recuperar senha 

const recuperar = document.getElementById("reset");
recuperar.addEventListener("click", function (event) {
  event.preventDefault()
  function isValidEmail(email) {
    // Regex mais robusta que a do Python, mas ainda não 100% precisa.
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  // pop up para inserir o email
  let email = prompt("Insira o email cadastrado para a recuperação da senha:");
  // verifica se o campo esta vazio
  if (email == null || email == "") {
    Swal.fire({
      title: "Campo vazio!",
      text: "campo de email vazio, por favor insira um email",
      icon: "error"
    });
    // varifica se esta em formato de email
  } else if (!isValidEmail(email)) {
    Swal.fire({
      title: "Formato errado!",
      text: "O valor inserido não está no formato de email.",
      icon: "error"
    });
  } else {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Swal.fire({
          title: "Email enviado!",
          text: "Caso o email esteja cadastrado um email de recuperação foi enviado para sua caixa de email",
          icon: "success"
        });

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Swal.fire({
          title: "Email não enviado!",
          text: "Não foi possível encontar nenhum email cadastrado no sitema",
          icon: "error"
        });
      });
  }
})


// Função para exibir mensagens temporárias na interface
function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 0;
  }, 5000); // A mensagem desaparece após 5 segundos
}

// Lógica de cadastro de novos usuários
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
  event.preventDefault(); // Previne o comportamento padrão do botão

  // Captura os dados do formulário de cadastro
  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;
  const firstName = document.getElementById('fName').value;
  const lastName = document.getElementById('lName').value;

  const auth = getAuth(); // Configura o serviço de autenticação
  const db = getFirestore(); // Conecta ao Firestore

  // Cria uma conta com e-mail e senha
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user; // Usuário autenticado
      const userData = { email, firstName, lastName }; // Dados do usuário para salvar

      showMessage('Conta criada com sucesso', 'signUpMessage'); // Exibe mensagem de sucesso

      // Salva os dados do usuário no Firestore
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          window.location.href = 'index.html'; // Redireciona para a página de login após cadastro
        })
        .catch((error) => {
          console.error("Error writing document", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode == 'auth/email-already-in-use') {
        showMessage('Endereço de email já existe', 'signUpMessage');
      } else {
        showMessage('não é possível criar usuário', 'signUpMessage');
      }
    });
});

// Lógica de login de usuários existentes
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
  event.preventDefault(); // Previne o comportamento padrão do botão

  // Captura os dados do formulário de login
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const auth = getAuth(); // Configura o serviço de autenticação

  // Realiza o login com e-mail e senha
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage('usuário logado com sucesso', 'signInMessage'); // Exibe mensagem de sucesso
      const user = userCredential.user;

      // Salva o ID do usuário no localStorage
      localStorage.setItem('loggedInUserId', user.uid);

      window.location.href = 'homepage.html'; // Redireciona para a página inicial
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/invalid-credential') {
        showMessage('Email ou Senha incorreta', 'signInMessage');
      } else {
        showMessage('Essa conta não existe', 'signInMessage');
      }
    });
});

const recoverPasswordLink = document.getElementById('recover-password-link');

recoverPasswordLink.addEventListener('click', (event) => {
  event.preventDefault(); // Impede o comportamento padrão do link

  // Obtenha o endereço de email do usuário
  const email = prompt("Digite seu endereço de email:");

  // Envie a solicitação de redefinição de senha para o Firebase
  firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      // Exibir uma mensagem de sucesso
      alert("Um email foi enviado para redefinir sua senha.");
    })
    .catch((error) => {
      // Exibir uma mensagem de erro
      alert(error.message);
    });
});
