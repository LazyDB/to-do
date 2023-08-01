export class Subject{
    constructor(){
        this.observer=[];
    }

register(observer){
    this.observer.push(observer);
    console.log(this.observer);
    }

notifyObserver(state){
    this.observer.forEach(observer=>{observer(state)}) 
}

}
0001