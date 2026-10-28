let h1 = document.querySelector('h1');


console.log( h1 );
console.log( h1.style.backgroundColor = 'red' );

document.getElementById('h1').addEventListener('click', () => { alert ('You clicked me!') });


const form = document.getElementById('#task');
const input = document.querySelector('#taskInput');

form.addEventListener ('submit'), (e) => {
    e.preventDefault();
}
  const task = input.value.target();
    if (!task) return;

    cart.push()