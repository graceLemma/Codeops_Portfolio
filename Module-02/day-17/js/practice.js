//function greet (student){
  //  console.log 
//}

//function bill ( total, tax = 0.05){
  //  return total + tax;
//}

//const bill = () => { return bill + //tax;};

//function makeGretter (city){
 //   let city = "hawassa";
   // let hello = function (name) {
     //   return `Hello ${name} from ${city}`;}

  //  return hello;
    //};

   // function makeGretter (section){
      //  let section = "section b";
    //    let hello = function (name) {
   //         return `Hello ${name} from ${section}`;}
    //    return hello;
   // };



    function adder (a, b, fun){
        console.log(fun(a, b));
 };

 function sum (a, b){
    return a + b;
 }
 function sub (a, b){
    return a - b;
 }
 function mul (a, b){
    return a * b;
 }
function div (a, b){
    return a / b;
 }
 adder (20, 10, sum);
 adder (20, 10, div);
 adder (20, 10, mul);
 adder (20, 10, sub);