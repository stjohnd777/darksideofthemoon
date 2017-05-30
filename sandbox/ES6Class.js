/**
 * Created by danielstjohn on 5/25/17.
 */

class Displayable {

}
class Point extends  Displayable {

    static Add(p0,p1){

    }

    constructor(x,y,z){
        super();
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(p1) {
        this.x += p1.x;
        this.y += p1.y;
        return this;
    }

    neg(){
        return new Point(-this.x,-this.y,-this.z);
    }
    norm () {
        let sum = this.x +this.y + this.z ;
        return Math.sqrt(sum);
    };

}

class Line extends  Displayable {
    constructor(p0,p1){
        super();
        this.p0 = p0;
        this.p1 = p1;
    }

    len () {
        return add(p1.neg()).norm();
    }

     pointAt (t){
      return new Point( p0.x * (1-t) - p1.x * t, p0.y * (1-t) - p1.y * t, p0.z * (1-t) - p1.z * t)
    }
}



let _1 = new Point(1,1,1);
console.log(_1.norm());
