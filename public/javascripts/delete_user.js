function confirming(){
    if(window.confirm("WARNING!!!\nThis will delete all your posts along with your account.\n\nDo you still want to continue?")){
      document.getElementById("delete_user").submit();
    }
}

console.log("---JS LOADED---")