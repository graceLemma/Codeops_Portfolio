let bill = Number(500);
let number_of_people = 4;
let PaymentMethod = 'CBE';
 
let rate;

if (bill > 500){
    rate = 0.10;
}
else {
    rate = 0.05
}
let tip = bill * rate
switch (PaymentMethod) {
    case 'telebirr':
        ServiceFee = 5;
        break;
    case 'CBE':
        ServiceFee = 10;
        break;}
        let total = bill + tip + ServiceFee;
        let amount_per_person = total / number_of_people;

        console.log(bill);
        console.log(`original bill: ${bill}ETB`);
        console.log(`tip: ${tip}ETB`);
        console.log(`service fee: ${ServiceFee}ETB`);
        console.log(`total: ${total}ETB`);
        console.log(`amount per person: ${amount_per_person}ETB`);
