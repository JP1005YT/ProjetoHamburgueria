function changeTheme(theme){
    console.log(theme)
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