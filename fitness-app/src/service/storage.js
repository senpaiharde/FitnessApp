import { v4 } from "uuid";

export function getUserId() {
 let id = localStorage.getItem('userId');
 if(!id){
    id = v4();
    localStorage.setItem('userId', id)
 }
}


