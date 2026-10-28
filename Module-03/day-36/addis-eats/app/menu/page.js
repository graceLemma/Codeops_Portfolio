export default function Menu() {
    return <main> <Dishlist dishes={dishes} /> </main>;
}

export default function Dishlist({ params }) {
    const { id } = params;
    return <h1>Dishlist for {id}</h1>;
}
