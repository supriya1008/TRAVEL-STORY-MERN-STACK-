export const validateEmail=(email)=>{
    const regex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};


export const getInitials=(name)=>{
   if(!name) return "";
   const words=name.split(" ");
   let intials="";
   for(let i=0;i<Math.min(words.length,2);i++){
    initials+=words[i][0];
   } 
   return intials.toUpperCase();
};