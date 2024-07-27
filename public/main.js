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