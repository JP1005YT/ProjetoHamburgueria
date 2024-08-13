function changeTheme(theme){
    if(theme === undefined){
      let themaAtual = document.querySelector("html").classList.value
      if(themaAtual == "theme-light"){
        document.querySelector("html").classList.value = "theme-dark"
        window.localStorage.setItem('theme','dark')
      }else{
        document.querySelector("html").classList.value = "theme-light"
        window.localStorage.setItem('theme','light')
      }
    }else{
      document.querySelector("html").classList.value = "theme-" + theme
    }
  }
let memoryTheme = window.localStorage.getItem('theme')
changeTheme(memoryTheme)

function secondsToDate(seconds) {
  const date = new Date(seconds * 1000);
  return date.toISOString().split('T')[0];
}
function dateToSeconds(dateString) {
  const date = new Date(dateString);
  return Math.floor(date.getTime() / 1000);
}
function formatDateToDDMMYYYY(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}
function ordenarPorNome(arr) {
  return arr.sort((a, b) => a.nome.localeCompare(b.nome));
}
function formatarData() {
  const dataAtual = new Date();

  const dia = String(dataAtual.getDate()).padStart(2, '0');
  const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Meses são de 0 a 11
  const ano = dataAtual.getFullYear();

  const horas = String(dataAtual.getHours()).padStart(2, '0');
  const minutos = String(dataAtual.getMinutes()).padStart(2, '0');

  return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}
function gerExcel(){
  if(confirm("Deseja Gerar um Arquivo Excel?")){
    fetch('/export', { 
      method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha na requisição.');
        }
        return response.blob(); // Recebe o buffer como um blob
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob); // Cria um URL para o blob
        const a = document.createElement('a'); // Cria um elemento <a> para download
        a.href = url;
        a.download = 'dados_tratados.xlsx'; // Nome do arquivo para download
        document.body.appendChild(a); // Adiciona o elemento ao DOM
        a.click(); // Simula o clique para iniciar o download
        a.remove(); // Remove o elemento do DOM
        window.URL.revokeObjectURL(url); // Libera o URL do blob
    })
  }
};

function formatarParaMoeda(valor) {
  // Converte para número de ponto flutuante, se o valor for uma string
  if (typeof(valor) !== 'number') {
      valor = parseFloat(valor);
  }

  // Verifica se o valor é um número válido
  if (isNaN(valor)) {
      return 'NaN(dev)';
  }

  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}