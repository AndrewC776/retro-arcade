// For zip
const math = Math
const PI = math.PI
const doc = document


// Image
const createImg = _ =>new Image()
const toPng = a =>a.toDataURL()


// Get canvas ID
const getCanvas = a => doc.getElementById(a)
const getContext = a => a.getContext('2d')



// Basic function (FP)
const max=(a,b)=>a>b?a:b;
const min =(a,b)=>(a<b)?a:b;
const rand=a=>math.random()*a
const randInt=a=>rand(a)|0;
const randIntBetween=(a,b)=>a+randInt(b-a+1);
const floor = a =>math.floor(a)
const floorSet = a =>reXY(floor(a.x),floor(a.y))
const reXY = (x,y)=>({x,y})
const set = a =>reXY(a.x,a.y)
const add = (a,b) =>reXY(a.x+b.x,a.y+b.y)
const dot=(a,b)=>reXY(a.x*b,a.y*b)
const substract=(a,b)=>reXY(a.x-b.x,a.y-b.y)
const comp=(a,b)=>a.x==b.x&&a.y==b.y
const collisionRect=(a,as,b,bs)=>(a.x+as.x>b.x&&b.x+bs.x>a.x&&a.y+as.y>b.y&&b.y+bs.y>a.y)?1:0
const clone = a =>{
    if (a == null || typeof a != 'object' || a instanceof Image) {
        return a;
    }
    const b = Array.isArray(a)?[]:{};
    for (let key in a) {
        b[key] = clone(a[key]);
    }
    return b;
}

const distance=(a,b)=>math.hypot(a.x-b.x,a.y-b.y);
const removeItem = (a,b)=>a.filter(e=>e!=b)
const appendItem = (a,b)=>(a.push(b),a)

const Pad=(a,b=5,c="0")=>a.padStart(b,c)
const IntToString=a=>a.toString()

const randWeight = (values, weights) => {
    
    const random = math.random();
    let cumulativeWeight = 0;
  
    for (let i = 0; i < values; i++) {
      cumulativeWeight += weights[i];
      if (random < cumulativeWeight) {
        return i;
      }
    }

    return 0;
};
